Package.describe({
  name: 'meteor-activedirectory',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});


Npm.depends({
  activedirectory: "0.7.2"
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2');
  api.use('ecmascript');
//  api.mainModule('meteor-activedirectory.js');
 api.use([ 'tinytest'], ['client', 'server']);
 //api.add_files('meteor-file-test.js', ['client', 'server']);
 api.add_files("ad_server.js", "server");
 api.add_files("ad_client.js", "client");
 api.use([
    "accounts-base",
    "check"
  ], ["client", "server"]);
  api.export('AD_CONFIG', 'server');
  api.export('security', 'server');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('meteor-activedirectory');

  api.add_files('meteor-file-test.js', ['client', 'server']);
//  api.mainModule('meteor-activedirectory-tests.js');
});
