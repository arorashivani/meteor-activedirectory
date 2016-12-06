
Meteor.loginWithLDAP = function (user, password, callback) {
  var details = _.defaults({
    username: user.split("@")[0],
    email:user,
    adPass: password
  });

  Meteor.call("authWithLDAP",details,function (err,outcome) {
    if (err) {
      //console.log("ERORRRRRRR "+err);
      Meteor.error(err);
    } else {
      if (outcome == true) {
        Accounts.callLoginMethod({
          methodArguments: [{user:details.username,email:details.email}],
          userCallback: function (error, result) {
            if (error) {
              callback && callback(error);
            } else {
              callback && callback(result);
            }
          }
        });
      }
      else {
        callback(outcome);}
      }})
    };
