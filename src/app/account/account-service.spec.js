// // account-service.spec.js
//
// 'use strict';
//
// xdescribe('Account service unit tests', function() {
//
//  // First, we load the app's module
//   beforeEach(module('app.account'));
//
//
//
//   var accountAuthService;
//   var scope;
//   var $httpBackend;
//
//   beforeEach(inject(function ($rootScope, $injector) {
//
//     $httpBackend = $injector.get('$httpBackend');
//
//     scope = $rootScope.$new();
//     accountAuthService = $injector.get('accountAuthService');
//
//
//     // $httpBackend.whenPOST(/.*/).passThrough();
//     // $httpBackend.whenGET(/.*/).passThrough();
//
//   }));
//
//   it ('should try to login', function() {
//
//
//
//         var loginInfo = {
//           email: 'matt.smith@kornersafe.com',
//           password: 'Password',
//           rememberMe: true
//         };
//
//
//
//   accountAuthService.login(loginInfo,
//     function(user) {
//       $log.debug("loginInfo");
//       $log.debug("user");
//       expect(1 + 1).toBe(2);
//     },
//     function(data, status, headers, config) {
//             $log.debug("loginInfo");
//
//     expect(1 + 1).toBe(3);
//     }
//   );
//
//
//
//
//   });
//
//
//   it ('should be true', function() {
//     expect(1 + 1).toBe(2);
//   });
//
//
//   it ('should be false', function() {
//     expect(false).toBeFalsy();
//   });
//
//
// })
