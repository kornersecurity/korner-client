(function(exports) {

  //
  //
  // home
  //   abstract
  //
  // home.show
  //   concrete
  //
  // home.tabs
  //   abstract
  //
  // home.tabs.dashboard
  //   concrete
  //

  exports.homeRoutes = function(stateProvider, urlProvider) {

    stateProvider

    //
    // Home Routes
    // -----------------------------------

    .state('app.home', {
        url: "/home",
        abstract: true,
        templateUrl: urlProvider.basepath('home.html'),
        controller: 'homeController',
        data: {
          accessLevel: accessLevels.user
        }
      })

      .state('app.home.select', {
      url: '/select/:checkKornerNotices',
      views: {
        'main-content-view': {
          templateUrl: urlProvider.basepath('home-select.html'),
          controller: 'home.select.controller'
        }
      }
    })

    //
    // Home Tab Routes
    // -----------------------------------
      .state('app.home.tabs', {
        url: "/tabs",
        views: {
          'main-content-view': {
            templateUrl: urlProvider.basepath('home-tabs.html')
          }
        }
      })

    .state('app.home.tabs.dashboard', {
      url: '/dashboard/:checkKornerNotices',
      views: {
        'home-tabs-content': {
          templateUrl: urlProvider.basepath('home-dashboard.html'),
          controller: 'homeDashboardController'
        },
        'home-dashboard-content': {
          templateUrl: urlProvider.basepath('home-dashboard.html'),
          controller: 'homeDashboardController'
        }
      }
    })

    .state('app.home.tabs.circle-feed', {
      url: '/circle-feed',
      views: {
        'home-tabs-content': {
          templateUrl: urlProvider.basepath('home-circle-feed.html'),
          controller: 'home.circle.feed.controller'
        },
        'home-dashboard-content': {
          templateUrl: urlProvider.basepath('home-dashboard.html'),
          controller: 'homeDashboardController'
        }
      }
    })

    .state('app.home.tabs.config', {
      url: '/config',
      views: {
        'home-tabs-content': {
          templateUrl: urlProvider.basepath('home-config.html'),
          // controller: 'homeConfigController'
        },
        'home-dashboard-content': {
          templateUrl: urlProvider.basepath('home-dashboard.html'),
          controller: 'homeDashboardController'
        }
      }
    });

  };

})(typeof exports === 'undefined' ? this : exports);
