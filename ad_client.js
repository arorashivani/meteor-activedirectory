Meteor.loginWithLDAP = function (user, password,ad_config, callback) {
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

      // if args still holds options item, grab it
      if (args.length > 0) ad_config = args.shift(); else ad_config = {};

var details = _.defaults({
      username: user,
      adPass: password
  });

  Meteor.call("testUser",input_name,e.detail.password,function (error,result) {
    if (error) {
      console.log(error.reason);
    }
    else if (result === null) {
      console.log("User Id not found in LDAP");
    }
    else {
      Accounts.callLoginMethod({
        methodArguments: [e],
        userCallback: function() {
          const scLayout = document.querySelector("sc-layout");
          scLayout.set('route.path','/dashboard/task');
        }
      });
    }
  });
}
