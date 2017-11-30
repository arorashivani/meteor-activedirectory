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

const invalidCredentials = 'INVALID_CREDENTIALS';
const userNotFound = 'USER_NOT_FOUND';
const tempBlock = 'Not permitted to logon at this time. Try after sometime or contact support team.';
const readableErrorMessages = {
  '49': invalidCredentials,
  '52e': invalidCredentials,
  '775': tempBlock,
}

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
          if (err) {
            const errorCodes = _.keys(readableErrorMessages);
            const errorCode = _.find(errorCodes, (code) => {
              const arg = `data ${code}`;
              return err.message.match(arg);
            });
            const errorMessage = errorCode ? readableErrorMessages[errorCode] : err.message;
            future.throw(new Meteor.Error('authentication-failed', errorMessage));
          } else if (auth) {
            future.return(true);
          } else {
            // pwd
            future.throw(new Meteor.Error('authentication-failed',`Authentication Failed for user ${options.username}`));
          }
        });
      }
    });
    return future.wait();
  }
});
