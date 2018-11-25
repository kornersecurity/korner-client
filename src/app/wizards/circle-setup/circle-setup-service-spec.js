// 'use strict';
//
// xdescribe('circleSetupController', function()
// {
//   // var controller, scope, state, ionicModal, userService, sessionService, userServiceMock, sessionServiceMock, fobUserStatusConst, ionicScrollDelegate, contentCircleSetup, ionicPopup;
//   var controller, scope, state, userServiceMock, sessionServiceMock;
//
//   beforeEach(module('app.wizard.circle'));
//
//   beforeEach(function()
//   {
//     sessionServiceMock = {
//       getSelectedFob: function () {
//           return {fob_id: 2};
//       }
//     };
//
//     userServiceMock = {
//       getUsers: function ()
//       {
//         return [
//           {
//             first_name: 'First',
//             last_name:  'User',
//             email:     'first@user.com',
//             fullname:  'First User',
//             status:    1
//           },
//           {
//             first_name: 'Second',
//             last_name:  'User',
//             email:     'second@user.com',
//             fullname:  'Second User',
//             status:    3
//           },
//           {
//             first_name: 'Third',
//             last_name:  'User',
//             email:     'third@user.com',
//             fullname:  'Third User',
//             status:    4
//           }
//         ];
//       },
//       countUsersByStatus: function(userStatus)
//       {
//         // STATUS_CREATED: 1,
//         // STATUS_INVITED: 2,
//         // STATUS_DECLINED:3,
//         // STATUS_ACTIVE:  4,
//         // STATUS_DISABLED:5,
//         // STATUS_NEW:     6
//         switch(userStatus)
//         {
//           case 1:
//             return 1;
//           case 2:
//             return 1;
//           case 3:
//             return 1;
//           case 4:
//             return 1;
//           case 5:
//             return 1;
//           case 6:
//             return 1;
//         }
//         return 0;
//       }
//     };
//   });
//
//   beforeEach(inject(function($rootScope, $controller, _$state_)
//   {
//      scope = $rootScope.$new();
//      state = _$state_
//      controller = $controller('circleSetupController', {
//        '$scope':         scope,
//        'sessionService': sessionServiceMock,
//        'userService':    userServiceMock
//      });
//
//   }));
//
//   describe('Initialization', function()
//   {
//
//     it('is instantiated', function()
//     {
//       expect(controller).toBeDefined();
//     });
//
//     it('fob_id to be 2', function()
//     {
//       expect(scope.fob.fob_id).toBe(2);
//     });
//
//     it('user to not be undefined', function()
//     {
//       expect(scope.users).toBeDefined();
//     });
//
//     it('user to have 3 users', function()
//     {
//       expect(scope.users.length).toBe(3);
//     });
//
//     it('should have 0 new users', function()
//     {
//       expect(scope.wizard.circleSetup.newUsersCount).toBe(0);
//     });
//
//     it('should have 4 pages', function()
//     {
//       expect(scope.totalPages).toBe(4);
//     });
//
//     it('should be on first page', function()
//     {
//       expect(scope.currentPage).toBe(1);
//     });
//   });
//
// });
//
//
// // resendInvitation
// // removeCircleMember
// // inviteCircleMembers
