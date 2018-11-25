(function(exports) {

  exports.wizardManagerRoutes = function(stateProvider, urlProvider) {

    stateProvider

    //
    // Wizard Manager Setup Routes
    // -----------------------------------


    .state('wizard-manager', {
      url: "/wizard-manager/:wizardType",
      // abstract: true,
      // template: '<div ui-view class="jojojo"></div>',
      views: {
        'wizard-view': {
          templateUrl: urlProvider.basepath('wizard-manager.html'),
          controller: 'wizardManagerController'
        }
      },
      data: {
        accessLevel: accessLevels.user
      }
    })
    .state('wizard-manager.wizard-summary', {
      url: "/wizard-summary",
      // abstract: true,
      // template: '<div ui-view class="jojojo"></div>',
      templateUrl: urlProvider.basepath('wizard-summary.html'),
      controller: 'wizardSummaryController'
    });

  };


})(typeof exports === 'undefined' ? this : exports);
