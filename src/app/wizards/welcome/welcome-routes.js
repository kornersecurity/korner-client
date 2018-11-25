(function(exports) {

  exports.wizardWelcomeRoutes = function(stateProvider, urlProvider) {

    stateProvider

    .state('wizard-manager.welcome', {
      url: "/welcome",
      abstract: true,
      templateUrl: urlProvider.basepath('welcome.html'),
      controller: 'welcomeController'
    })

    .state('wizard-manager.welcome.p1', {
      url: "/p1",
      templateUrl: urlProvider.basepath('welcome-p1.html'),
      controller: 'welcomeControllerPage1'
    });

  };


})(typeof exports === 'undefined' ? this : exports);
