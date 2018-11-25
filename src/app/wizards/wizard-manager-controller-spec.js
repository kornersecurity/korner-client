// 'use strict';
//
// describe('wizardManagerController', function()
// {
//   var controller, scope;
//
//   beforeEach(function()
//   {
//     module('app.wizard');
//
//     inject(function($injector)
//     {
//
//     });
//   });
//
//   beforeEach(inject(function($rootScope, $controller, $state)
//   {
//      scope = $rootScope.$new();
//      scope.wizardMangerData = {wizardType:0};
//      spyOn($state, 'go');
//      controller = $controller('wizardManagerController',
//      {
//        '$scope': scope,
//        '$stateParams': {wizardType: '3'},
//        '$state':$state
//      });
//
//   }));
//
//   describe('Initialization', function()
//   {
//     it('is instantiated', function()
//     {
//       expect(controller).toBeDefined();
//     });
//
//     // it('has a wizardType', function()
//     // {
//     //   expect(scope.wizardMangerData.wizardType).toBe(0);
//     // })
//
//     // it('should call $state.go when wizardType is 3.', inject(function($state)
//     // {
//     //   // spyOn($state, 'go');
//     //   expect($state.go).toHaveBeenCalledWith('wizard-manager.circle-setup.p1');
//     // }));
//
//     // it('should have a wizardType equal to stateParams.wizardType.', inject(function($state)
//     // {
//     //   expect(scope.wizardManagerData.wizardType).toBe(3);
//     // }));
//   });
// });
//
// /*
//
// Wizard Type
//   Fob
//   Extender
//   Tag
//   Circle
//   Welcome [Welcome, Fob, Extender, Tag, Circle]
//   Hardware [Fob, Extender, Tag]
//
// API
// goToPreviousPage;
// goToNextPage;
// wizardClose;
// changeState;
// wizardCompleted;
// */
