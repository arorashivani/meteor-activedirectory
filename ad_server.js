const ActiveDirectory = Npm.require('activedirectory');
const Future = Npm.require('fibers/future');
let ad_def_config = {
  url: false,
  baseDN: false,
  username: false,
  password: false
}
ad_def_config = _.extend(ad_def_config,Meteor.settings.ldap);

Accounts.registerLoginHandler(function (input_name) {
  const future = new Future();
  let userId = null;
  const user = Meteor.users.findOne({username: input_name.user});
  if(!user) {
    const em_address =
      userId = Accounts.createUser({username: input_name.user,email:input_name.email});
    future.return({userId: userId});
  } else {
    userId = user._id;
    //  console.log({userId: userId});
    future.return({userId: userId});
  }
  //console.log({userId: userId});
  return future.wait();
});

Meteor.methods({
  authWithLDAP : function (options) {
    const future = new Future();
    const ad = new ActiveDirectory(ad_def_config);
    //  console.log(JSON.stringify(options));
    const flag = 0;
    const finalChoice = ad.findUser(options.username, function(err, user) {
      if (err && err.message.match('ECONNREFUSED')) {
        future.throw(new Meteor.Error('connection-error', 'Could not connect to LDAP server'));
      } else if (err) {
        future.throw(new Meteor.Error('user-not-found', err.message));
      } else if (! user) {
        future.throw(new Meteor.Error("validation-failed", `User: ${options.username} not found.`));
      }
      else {
        //console.log("YESS  " + JSON.stringify(options)+ JSON.stringify(user));
        ad.authenticate(user.userPrincipalName, options.adPass, function(err, auth) {
          if (err && err.message.match('DSID-0C0903D9')) {
            future.throw(new Meteor.Error('authentication-failed', 'Invalid password /login temporarily blocked because of multiple attempts, try after sometime.'));
          } else if (err) {
            future.throw(new Meteor.Error('authentication-failed', err.message));
          } else if (auth) {
            future.return(true);
          } else {
            //pwd
            future.throw(new Meteor.Error('authentication-failed',`Authentication Failed for user ${options.username}`));
          }
        });
      }
    });
    return future.wait();
  }
});
