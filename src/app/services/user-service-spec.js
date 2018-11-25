// 'use strict';
//
// describe('UserService', function()
// {
//   var service, scope, state, restangularMock, Restangular, $httpBackend, userServiceMock, sessionServiceMock;
//
//   beforeEach(module('app.core', function ($provide)
//   {
//     restangularMock = {
//       one: function(fobId, success)
//          {
//             deferred = $q.defer();
//             return deferred.promise;
//           }
//     };
//     $provide.value("Restangular", restangularMock);
//   }));
//
//   // beforeEach(function()
//   // {
//   //   restangularMock = {
//   //     one: jasmine.createSpy()
//   //   }
//   //
//   //   sessionServiceMock = {
//   //     getSelectedFob: function () {
//   //         return {fob_id: 2};
//   //     }
//   //   };
//   //
//   //   userServiceMock = {
//   //     getUsers: function ()
//   //     {
//   //       return [
//   //         {
//   //           first_name: 'First',
//   //           last_name:  'User',
//   //           email:     'first@user.com',
//   //           fullname:  'First User',
//   //           status:    1
//   //         },
//   //         {
//   //           first_name: 'Second',
//   //           last_name:  'User',
//   //           email:     'second@user.com',
//   //           fullname:  'Second User',
//   //           status:    3
//   //         },
//   //         {
//   //           first_name: 'Third',
//   //           last_name:  'User',
//   //           email:     'third@user.com',
//   //           fullname:  'Third User',
//   //           status:    4
//   //         }
//   //       ];
//   //     },
//   //     countUsersByStatus: function(userStatus)
//   //     {
//   //       // STATUS_CREATED: 1,
//   //       // STATUS_INVITED: 2,
//   //       // STATUS_DECLINED:3,
//   //       // STATUS_ACTIVE:  4,
//   //       // STATUS_DISABLED:5,
//   //       // STATUS_NEW:     6
//   //       switch(userStatus)
//   //       {
//   //         case 1:
//   //           return 1;
//   //         case 2:
//   //           return 1;
//   //         case 3:
//   //           return 1;
//   //         case 4:
//   //           return 1;
//   //         case 5:
//   //           return 1;
//   //         case 6:
//   //           return 1;
//   //       }
//   //       return 0;
//   //     }
//   //   };
//   // });
//
//   beforeEach(inject(function ($rootScope, userService)
//   {
//     scope         = $rootScope.$new();
//     service       = userService;
//   }));
//
//   describe('HTTP Calls', function()
//   {
//
//     beforeEach(inject(function (_Restangular_, _$httpBackend_)
//     {
//       Restangular   = _Restangular_;
//       $httpBackend  = _$httpBackend_;
//       // for(var r in Restangular)
//         // $log.debug("RESTANGULAR PROVIDER: "+r, Restangular[r].baseUrl);
//     }));
//
//     afterEach(inject(function($httpBackend, $rootScope)
//     {
//      // Force all of the http requests to respond.
//      $httpBackend.flush();
//
//      // Force all of the promises to resolve.
//      // VERY IMPORTANT: If we do not resolve promises, none of the dependent
//      // expectations will be called, and the spec may pass inadvertantly.
//      $rootScope.$digest();
//
//      // Check that we don't have anything else hanging.
//      $httpBackend.verifyNoOutstandingExpectation();
//      $httpBackend.verifyNoOutstandingRequest();
//     }));
//     xit('should get a list of users from the server', function()
//     {
//
//
//       var responseMock = [
//         {
//           fob_user_id:        1,
//           first_name:          'First',
//           last_name:           'User',
//           email:              'first@user.com',
//           fullname:           'First User',
//           fob_user_status_id: 1
//         },
//         {
//           fob_user_id:        2,
//           first_name:          'Second',
//           last_name:           'User',
//           email:              'second@user.com',
//           fullname:           'Second User',
//           fob_user_status_id: 3
//         },
//         {
//           fob_user_id:        3,
//           first_name:          'Third',
//           last_name:           'User',
//           email:              'third@user.com',
//           fullname:           'Third User',
//           fob_user_status_id: 4
//         }
//       ];
//
//       // spyOn(Restangular, 'one');//.and.returnValue(responseMock);//.andReturn(responseMock);
//
//       // $httpBackend.expect('GET', 'fobs/2/users').respond({response: responseMock});
//       //
//       // service.getFobUsers(2, function (users, userCount){
//       //   $log.debug("USERS: "+users, userCount);
//       // });
//       // expect(Restangular.one).toHaveBeenCalled();
//       // expect(Restangular.one.calls.any()).toEqual(false);
//       // $httpBackend.flush();
//       // scope.$digest();
//       // $log.debug("GETTING USERS: "+userService.getUsers());
//
//     });
//   });
//
//   describe('Users', function()
//   {
//     it('should get a list of users', function()
//     {
//       // service.getImageUrl(2, 'ts');
//       // $log.debug('USER COUNT: '+scope.userCount);
//     });
//   });
// });
//
//
// // User Service API
// // getFobUsers(fobId, success)
// // getUsers()
// // getImageUrl(fobUserId, imageSize) //image size: 'ts' and 'pm'
// // getChatName(fobUserId)
// // addUser(userData)
// // updateUser(userData)
// // removeUser(fob_user_id)
// // setFullName(user)
// // hasUsersWithStatus(status)
// // countUsersByStatus(status)
// // resetServiceData()
