ActiveDirectory = Npm.require('activedirectory');
let ad_def_config = { url: false,
               baseDN: false,
               username: false,
               password: false
         }
        ad_def_config = _.extend(ad_def_config,Meteor.settings.ldap);

security = {};

security.create = function (config) {
  // Set options
  console.log(ad_def_config);
  this.config = _.defaults(config, ad_def_config);

  // Make sure options have been set
  try {
      check(this.options.url, String);
      //check(this.options.dn, String);
  } catch (e) {
      throw new Meteor.Error('Bad Defaults', 'Options not set. Make sure to set LDAP_DEFAULTS.url and LDAP_DEFAULTS.dn!');
  }
  ad = new ActiveDirectory(config);
};


security.create.prototype.testUser = function (username,password) {
  ad.findUser(username, function(err, user) {
    if (err) {
      console.log('ERROR: ' +JSON.stringify(err));
      return;
    }

    if (! user) console.log('User: ' + username + ' not found.');
    else {
      ad.authenticate(user.cn, password, function(err, auth) {
        if (err) {
          console.log('ERROR: '+JSON.stringify(err));
          return null;
        }
        if (auth) {
          //console.log('Authenticated!');
          console.log(user);
          //Meteor.loginWithPassword(username, password);
          return user;
        }
        else {
          console.log('Authentication failed!');
          return false;
        }
      });
    }
  });

};

Accounts.registerLoginHandler(function(loginRequest) {

  if(!loginRequest.username || !loginRequest.adPasss ) {
    return undefined;
  }

  Account.authObj =  new security.create(ad_def_config);
console.log(Account.authObj);
  var authCheck = Accounts.authObj.testUser(loginRequest.username,loginRequest.adPass);

  if (authCheck.error) {
        return {
            userId: null,
            error: authCheck.error
        };
    }
    else if (authCheck.emptySearch) {
        return {
            userId: null,
            error: new Meteor.Error(403, 'User not found in LDAP')
        };
    }
    else {
  var userId = null;
  var user = Meteor.users.findOne({username: input_name});
  if(!user) {
    userId = Meteor.users.insert({username: input_name});
  } else {
    userId = user._id;
  }
  return {userId: userId};
}
});
