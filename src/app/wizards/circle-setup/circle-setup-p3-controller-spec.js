// 'use strict';
//
// xdescribe('circleSetupControllerPage3', function()
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
//      controller = $controller('circleSetupControllerPage3', {
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
//   });
//
// });
//
//
// // $scope.nextPage = function()
// // $scope.wizard.wizardClose = function()
// // $scope.previousPage = function()
// // $scope.wizardDone = function()
// // $scope.toggleHelp = function()
// // $scope.getScrollHeight = function(height)
// // $scope.userName = function(fobUserId)
// // $scope.setState = function(templateName)
// // $scope.hasUsersWithStatus = function(status)
// // $scope.hasUsersWithStatuses = function(status1, status2)
// // $scope.hasPendingInvites = function()
// // $scope.wizard.circleSetup.countPendingInvites = function()
// // $scope.wizard.circleSetup.countNewUsers = function()
