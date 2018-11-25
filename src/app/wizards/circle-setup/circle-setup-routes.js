(function(exports) {

  exports.wizardCircleSetupRoutes = function(stateProvider, urlProvider) {

    stateProvider

    //
    // Wizard Circle Setup Routes
    // -----------------------------------


    // .state('wizard-circle-setup', {
    //   url: "/wizard-circle-setup",
    //   parent: 'wizard-manager',
    //   abstract: true,
    //   // template: '<div ui-view class="jojojo"></div>',
    //   templateUrl: urlProvider.basepath('wizard-circle-setup.html'),
    //   controller: 'circleSetupController',
    //   data: {
    //     accessLevel: accessLevels.none
    //   }
    // })

    .state('wizard-manager.circle-setup', {
      url: "/circle-setup",
      abstract: true,
      // parent: 'wizard-manager',
      templateUrl: urlProvider.basepath('circle-setup.html'),
      controller: 'circleSetupController'
    })

    .state('wizard-manager.circle-setup.add-contacts', {
      url: "/add-contacts",
      // parent: 'wizard-manager.circle-setup',
      templateUrl: urlProvider.basepath('add-contacts.html'),
      controller: 'addContactModalController'
    })

    .state('wizard-manager.circle-setup.import-contacts', {
      url: "/import-contacts",
      // parent: 'wizard-manager.circle-setup',
      templateUrl: urlProvider.basepath('import-contacts.html'),
      controller: 'importContactsModalController'
    })

    .state('wizard-manager.circle-setup.p1', {
      url: "/p1",
      // parent: 'wizard-manager.circle-setup',
      templateUrl: urlProvider.basepath('circle-setup-p1.html'),
      controller: 'circleSetupControllerPage1'
    })

    .state('wizard-manager.circle-setup.p2', {
      url: "/p2",
      // parent: 'wizard-circle-setup',
      templateUrl: urlProvider.basepath('circle-setup-p2.html'),
      controller: 'circleSetupControllerPage2'
    })

    .state('wizard-manager.circle-setup.p3', {
      url: "/p3",
      // parent: 'wizard-manager.circle-setup',
      templateUrl: urlProvider.basepath('circle-setup-p3.html'),
      controller: 'circleSetupControllerPage3'
    });

  };


})(typeof exports === 'undefined' ? this : exports);
