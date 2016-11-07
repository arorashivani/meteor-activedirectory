ActiveDirectory = Npm.require('activedirectory');
Future = Npm.require('fibers/future');
let ad_def_config = { url: false,
  baseDN: false,
  username: false,
  password: false
}
ad_def_config = _.extend(ad_def_config,Meteor.settings.ldap);

Accounts.registerLoginHandler(function (input_name) {
  future = new Future();
  var userId = null;
  var user = Meteor.users.findOne({username: input_name.user});
  if(!user) {
    userId = Meteor.users.insert({username: input_name.user});
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
    future = new Future();
    ad = new ActiveDirectory(ad_def_config);
  //  console.log(JSON.stringify(options));
    var flag = 0;
    var finalChoice = ad.findUser(options.username, function(err, user) {
      if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        e = new Meteor.Error("validation-failed", err.message);
        future.return(e);
      }
      if (! user) {console.log('User: ' + options.username + ' not found.');
      e = new Meteor.Error("validation-failed", "User not found in ldap");
      future.return(e);}
      else {
        //console.log("YESS  " + JSON.stringify(options)+ JSON.stringify(user));
        ad.authenticate(user.cn, options.adPass, function(err, auth) {
          if (err) {
            console.log('ERROR: '+JSON.stringify(err));
            e = new Meteor.Error("validation-failed", "Username and password do not match");
            future.return(e);
          }
          if (auth) {
          //  console.log('Authenticated!');
          //  console.log(options.username);
            future.return(true);
          }
          else {
            //pwd
            console.log('Authentication failed!');
            //future.return(false);
          }
        });
      }
    });
    return future.wait();
  }
});
