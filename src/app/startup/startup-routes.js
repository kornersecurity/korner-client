(function(exports) {


  exports.startupRoutes = function(stateProvider, urlProvider) {
    //
    // Startup Routes
    // -----------------------------------

    stateProvider

      .state('app.startup', {
        url: "/startup",
        abstract: true,
        templateUrl: urlProvider.basepath('startup.html'),
        data: {
          accessLevel: accessLevels.none
        }
      })
      .state('app.startup.splash', {
        url: "/splash",
        title: 'Splash',
        templateUrl: urlProvider.basepath('startup-splash.html'),
        controller: 'startup.splash.controller'
      });
  };





})(typeof exports === 'undefined' ? this : exports);
