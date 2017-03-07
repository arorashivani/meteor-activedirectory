Meteor.loginWithLDAP = function (user, password, callback) {
  const details = _.defaults({
    username: user.split("@")[0],
    email: user,
    adPass: password
  });

  Meteor.call('authWithLDAP', details, function (err, outcome) {
    if (err) {
      console.log(err.message);
      callback && callback(err, null);
    } else {
      Accounts.callLoginMethod({
        methodArguments: [{ user: details.username, email: details.email }],
        userCallback: function (error, result) {
          callback && callback(error, result);
        }
      });
      callback(outcome);
    }
  });
};
