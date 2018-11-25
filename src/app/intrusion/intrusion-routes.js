(function(exports) {

  exports.intrusionRoutes = function(stateProvider, urlProvider) {

    stateProvider

    //
    // Intrusion Routes
    // -----------------------------------

      .state('app.intrusion', {
      url: '/intrusion',
      templateUrl: urlProvider.basepath('intrusion.html'),
      controller: 'intrusionController',
      data: {
        accessLevel: accessLevels.user
      }
    });

  };

})(typeof exports === 'undefined' ? this : exports);
