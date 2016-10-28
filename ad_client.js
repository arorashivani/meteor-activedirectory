Meteor.loginWithLDAP = function (user, password, callback) {
  // Retrieve arguments as array
      var args = [];
      for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
      }
      // Pull username and password
      user = args.shift();
      password = args.shift();

      // Check if last argument is a function
      // if it is, pop it off and set callback to it
      if (typeof args[args.length - 1] == 'function') callback = args.pop(); else callback = null;


var details = _.defaults({
      username: user.split("@")[0],
      adPass: password
  });
console.log("detailssssss   "+JSON.stringify(details));

Accounts.callLoginMethod({
  methodArguments: [details],
  userCallback: function (error, result) {
      if (error) {
          callback && callback(error);
      } else {
          callback && callback();
      }
  }
});
  // Meteor.call("testUser",details.username,details.adPass,function (error,result) {
  //   if (error) {
  //     console.log(error.reason);
  //   }
  //   else if (result === null) {
  //     console.log("User Id not found in LDAP");
  //   }
  //   else {
  //
  //   }
  // });
}
;
