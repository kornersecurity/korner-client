'use strict';

xdescribe('circleSetupController.p2', function()
{
  var controller, scope;

  beforeEach(module('app.wizard.circle'));


  beforeEach(inject(function($rootScope, $controller)
  {
     scope = $rootScope.$new();
     controller = $controller('circleSetupControllerPage2', {
       '$scope':         scope,
     });

  }));

  describe('Initialization', function()
  {

    it('is instantiated', function()
    {
      expect(controller).toBeDefined();
    });
  });

});
