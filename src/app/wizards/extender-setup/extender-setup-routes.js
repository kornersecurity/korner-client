(function(exports) {

  exports.wizardExtenderSetupRoutes = function(stateProvider, urlProvider) {

    stateProvider

    .state('wizard-manager.extender-setup', {
      url: "/extender-setup",
      abstract: true,
      // parent: 'wizard-manager',
      templateUrl: urlProvider.basepath('extender-setup.html'),
      controller: 'extenderSetupController'
    })

    .state('wizard-manager.extender-setup.p1', {
      url: "/p1",
      // parent: 'wizard-manager.fob-setup',
      templateUrl: urlProvider.basepath('extender-setup-p1.html'),
      controller: 'extenderSetupControllerPage1'
    })

    .state('wizard-manager.extender-setup.p2', {
      url: "/p2",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('extender-setup-p2.html'),
      controller: 'extenderSetupControllerPage2'
    })

    .state('wizard-manager.extender-setup.p3', {
      url: "/p3",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('extender-setup-p3.html'),
      controller: 'extenderSetupControllerPage3'
    })

    .state('wizard-manager.extender-setup.p4', {
      url: "/p4",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('extender-setup-p4.html'),
      controller: 'extenderSetupControllerPage4'
    })


    .state('wizard-manager.extender-setup.setTag', {
      url: "/set-tag",
      // parent: 'wizard-manager.fob-setup',
      templateUrl: urlProvider.basepath('set-tag.html'),
      controller: 'setTagController'
    });

  };


})(typeof exports === 'undefined' ? this : exports);
