(function(exports) {


  exports.debugRoutes = function(stateProvider, urlProvider) {
    //
    // Accounts Routes
    // -----------------------------------

    stateProvider

      .state('app.debug', {
        url: "/debug",
        templateUrl: urlProvider.basepath('debug.html'),
        abstract: true,
        data: {
          accessLevel: accessLevels.none
        }
      })
      .state('app.debug.info', {
        url: "/info",
        title: 'Debug Info',
        templateUrl: urlProvider.basepath('debug-info.html'),
        controller: 'debug.info.controller'

      });
  };





})(typeof exports === 'undefined' ? this : exports);
