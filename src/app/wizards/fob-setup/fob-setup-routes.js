(function(exports) {

  exports.wizardFobSetupRoutes = function(stateProvider, urlProvider) {

    stateProvider

    .state('wizard-manager.fob-setup', {
      url: "/fob-setup",
      abstract: true,
      // parent: 'wizard-manager',
      templateUrl: urlProvider.basepath('fob-setup.html'),
      controller: 'fobSetupController'
    })

    .state('wizard-manager.fob-setup.p1', {
      url: "/p1",
      // parent: 'wizard-manager.fob-setup',
      templateUrl: urlProvider.basepath('fob-setup-p1.html'),
      controller: 'fobSetupControllerPage1'
    })

    .state('wizard-manager.fob-setup.p2', {
      url: "/p2",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('fob-setup-p2.html'),
      controller: 'fobSetupControllerPage2'
    });

  };


})(typeof exports === 'undefined' ? this : exports);
