// 'use strict';
//
// xdescribe('addContactsController', function()
// {
//   var controller, scope, state, userServiceMock, sessionServiceMock, childScope;
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
//     scope = $rootScope.$new();
//     state = _$state_
//     $controller('circleSetupController', {
//       '$scope':         scope,
//       '$state':         state,
//       'sessionService': sessionServiceMock,
//       'userService':    userServiceMock
//     });
//
//     childScope = scope.$new();
//     controller = $controller('circleSetupController.addContactModalController', {
//      '$scope':         childScope,
//      'userService':    userServiceMock
//     });
//
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
//   });
//
//   describe('API', function()
//   {
//
//     it('is instantiated', function()
//     {
//       expect(controller).toBeDefined();
//     });
//
//     it('user should not be undefined when edit user data.', function()
//     {
//       expect(scope.users).toBeDefined();
//     });
//
//     it('user should be undefined when defining a user.', function()
//     {
//       expect(scope.users.length).toBe(3);
//     });
//
//     it('should have 0 new users', function()
//     {
//       expect(scope.wizard.circleSetup.newUsersCount).toBe(0);
//     });
//   });
// });
//
// // Controller API
// // $scope.modalActionType
// // $scope.newUserData
// // $scope.userToEdit
// // $scope.users
// // $scope.wizard.circleSetup.hasNewUser
// // $scope.closeModal()
// // $scope.addContact = function()
