// 'use strict';
//
// xdescribe('circleSetupControllerPage1', function()
// {
//   // var controller, scope, state, ionicModal, userService, sessionService, userServiceMock, sessionServiceMock, fobUserStatusConst, ionicScrollDelegate, contentCircleSetup, ionicPopup;
//   var controller, scope, state, userServiceMock;
//
//   beforeEach(module('app.wizard.circle'));
//
//   beforeEach(function()
//   {
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
//      scope.hasUsersWithStatus = function(status){ return true; };
//      state = _$state_
//      spyOn(scope, 'hasUsersWithStatus').andReturn(true);
//      controller = $controller('circleSetupControllerPage1', {
//        '$scope':         scope,
//        'userService':    userServiceMock
//      });
//   }));
//
//   describe('Initialization', function()
//   {
//     it('is instantiated', function()
//     {
//       expect(controller).toBeDefined();
//     });
//   });
//
//   describe('API', function()
//   {
//     it('should show active group', function()
//     {
//       scope.showActiveGroup = false;
//       expect(scope.wizard.circleSetup.toggleGroup('active')).toBe(Object);
//     });
//   });
//
// });
//
// // Controller Properties
// // $scope.fobUserStatusConst
// // $scope.wizard.circleSetup.hasNewUser
// // $scope.wizard.circleSetup.invitedUsersCount
// // $scope.wizard.circleSetup.newUsersCount
// //
// // $scope.showHelp = ($scope.users.length > 1) ? false : true;
// // $scope.showActiveGroup = false;
// // $scope.showPendingGroup = true;
// // $scope.showDeclinedGroup = false;
// //
// // $scope.$on('toggleHelp', function(e) {
// //   $scope.showHelp = !$scope.showHelp;
// // });
// //
// // Controller API
// // $scope.wizard.circleSetup.toggleGroup(group)
// // $scope.isGroupShown(group)
// // $scope.showAddImportActionSheet
// // $scope.editUser(user)
// // $scope.resendInvitation(user)
// // $scope.removeUser(user)
// // $scope.closeModal
// // $scope.wizard.circleSetup.hasNewUser
// // $scope.wizard.circleSetup.newUsersCount
// // $scope.wizard.circleSetup.invitedUsersCount
// // $scope.canShowEdit
