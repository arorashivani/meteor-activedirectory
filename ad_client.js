
Meteor.loginWithLDAP = function (user, password, callback) {
  var details = _.defaults({
    username: user.split("@")[0],
    adPass: password
  });

  Meteor.call("authWithLDAP",details,function (err,outcome) {
    if (err) {
      console.log("ERORRRRRRR "+err);
    } else {
      if (outcome == true) {
        Accounts.callLoginMethod({
          methodArguments: [{user:details.username}],
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
