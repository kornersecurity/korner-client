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
//
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
//       },
//
//       getChatName: function(fobUserId)
//       {
//         return 'First User';
//       },
//
//       hasUsersWithStatus: function(userStatus)
//       {
//         if(userStatus === 1 || userStatus === 3 || userStatus === 4)
//           return true;
//
//         if(userStatus === 2)
//           return false;
//       }
//     };
//   });
//
//   beforeEach(inject(function($rootScope, $controller)
//   {
//      scope = $rootScope.$new();
//      scope.wizardManagerData = {wizardCompleted: function(){}};
//
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
//     // it('should have 4 pages', function()
//     // {
//     //   expect(scope.totalPages).toBe(4);
//     // });
//     //
//     // it('should be on first page', function()
//     // {
//     //   expect(scope.currentPage).toBe(1);
//     // });
//   });
//
//
//   // describe('Wizard Navigation', function()
//   // {
//   //
//   //   it('should be on page 2 when calling nextPage from page 1.', function()
//   //   {
//   //     scope.nextPage();
//   //
//   //     expect(scope.currentPage).toEqual(2);
//   //   });
//   //
//   //   it('should be on page 4 when calling nextPage 3 times.', function()
//   //   {
//   //     scope.nextPage();
//   //     scope.nextPage();
//   //     scope.nextPage();
//   //
//   //     expect(scope.currentPage).toEqual(4);
//   //   });
//   //
//   //   it('should be on page 1 when calling previousPage from page 1.', function()
//   //   {
//   //     scope.previousPage();
//   //     expect(scope.currentPage).toBe(1);
//   //   });
//   //
//   //   it('should broadcast a toggle help.', function()
//   //   {
//   //     spyOn(scope, '$broadcast');
//   //     scope.toggleHelp()
//   //     expect(scope.$broadcast).toHaveBeenCalled();
//   //   });
//   //
//   //   it('should call $scope.wizard.wizardManagerData.wizardCompleted() when wizardDone is called.', inject(function($state)
//   //   {
//   //     spyOn(scope.wizardManagerData, 'wizardCompleted');
//   //     scope.wizardDone();
//   //     expect(scope.wizardManagerData.wizardCompleted).toHaveBeenCalled();
//   //   }));
//   //
//   //
//   //   it('user to not be undefined', function()
//   //   {
//   //     expect(scope.users).toBeDefined();
//   //   });
//   //
//   //   it('user to have 3 users', function()
//   //   {
//   //     expect(scope.users.length).toBe(3);
//   //   });
//   //
//   //   it('should have 0 new users', function()
//   //   {
//   //     expect(scope.wizard.circleSetup.newUsersCount).toBe(0);
//   //   });
//   //
//   //   it('should have 4 pages', function()
//   //   {
//   //     expect(scope.totalPages).toBe(4);
//   //   });
//   //
//   //   it('should be on first page', function()
//   //   {
//   //     expect(scope.currentPage).toBe(1);
//   //   });
//   // });
//
//   describe('User Service calls', function()
//   {
//     it('should return "First User" when userName is called with 1.', function()
//     {
//       expect(scope.userName(1)).toEqual('First User');
//     });
//
//     it('should have users with status 1, 3 and 4 and have no users with status 2.', function()
//     {
//       expect(scope.hasUsersWithStatus(1)).toEqual(true);
//       expect(scope.hasUsersWithStatus(3)).toEqual(true);
//       expect(scope.hasUsersWithStatus(4)).toEqual(true);
//       expect(scope.hasUsersWithStatus(2)).toEqual(false);
//     });
//
//     it('should have pending invites.', function()
//     {
//       expect(scope.hasPendingInvites()).toEqual(true);
//     });
//
//     it('should have 2 pending invites.', function()
//     {
//       expect(scope.countPendingInvites()).toEqual(2);
//     });
//
//     it('should have 0 new users.', function()
//     {
//       expect(scope.$scope.wizard.circleSetup.countNewUsers()).toEqual(0);
//     });
//   });
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
// // $scope.hasUsersWithStatuses = function(status1, status2) // no longer used
// // $scope.hasPendingInvites = function()
// // $scope.wizard.circleSetup.countPendingInvites = function()
// // $scope.wizard.circleSetup.countNewUsers = function()
