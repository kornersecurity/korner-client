(function(exports) {

  exports.wizardTagSetupRoutes = function(stateProvider, urlProvider) {

    stateProvider

    .state('wizard-manager.tag-setup', {
      url: "/tag-setup",
      abstract: true,
      // parent: 'wizard-manager',
      templateUrl: urlProvider.basepath('tag-setup.html'),
      controller: 'tagSetupController'
    })

    .state('wizard-manager.tag-setup.editTagName', {
      url: "/edit",
      // parent: 'wizard-manager.fob-setup',
      templateUrl: urlProvider.basepath('edit-tag-name.html'),
      controller: 'editTagNameModalController'
    })

    .state('wizard-manager.tag-setup.p1', {
      url: "/p1",
      // parent: 'wizard-manager.fob-setup',
      templateUrl: urlProvider.basepath('tag-setup-p1.html'),
      controller: 'tagSetupControllerPage1'
    })

    .state('wizard-manager.tag-setup.p2', {
      url: "/p2",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('tag-setup-p2.html'),
      controller: 'tagSetupControllerPage2'
    })

    .state('wizard-manager.tag-setup.p3', {
      url: "/p3",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('tag-setup-p3.html'),
      controller: 'tagSetupControllerPage3'
    })

    .state('wizard-manager.tag-setup.p3a', {
      url: "/p3a",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('tag-setup-p3a.html'),
      controller: 'tagSetupControllerPage3a'
    })

    .state('wizard-manager.tag-setup.p4', {
      url: "/p4",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('tag-setup-p4.html'),
      controller: 'tagSetupControllerPage4'
    })

    .state('wizard-manager.tag-setup.p5', {
      url: "/p5",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('tag-setup-p5.html'),
      controller: 'tagSetupControllerPage5'
    })

    .state('wizard-manager.tag-setup.p6', {
      url: "/p6",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('tag-setup-p6.html'),
      controller: 'tagSetupControllerPage6'
    })

    .state('wizard-manager.tag-setup.p7', {
      url: "/p7",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('tag-setup-p7.html'),
      controller: 'tagSetupControllerPage7'
    })

    .state('wizard-manager.tag-setup.p8', {
      url: "/p8",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('tag-setup-p8.html'),
      controller: 'tagSetupControllerPage8'
    })

    .state('wizard-manager.tag-setup.p9', {
      url: "/p9",
      // parent: 'wizard-fob-setup',
      templateUrl: urlProvider.basepath('tag-setup-p9.html'),
      controller: 'tagSetupControllerPage9'
    });

  };


})(typeof exports === 'undefined' ? this : exports);
