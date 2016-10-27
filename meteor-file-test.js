Tinytest.add('meteor-activedirectory - first test',function (test) {
  test.equal(1,10,"dummy test which failed:)");
})
// if(Meteor.isServer){
//   Meteor.methods({
//     'test/method':function () {console.log('innn');
//       return true;
//     }
//   });
// }
// if(Meteor.isClient){
// testAsyncMulti('meteor-activedirectory - first test',[function (test,expect){
//   Meteor.call('test/method',expect(function (err,res) {
//     test.isTrue(res);
//   }));
// } ]);
// }
