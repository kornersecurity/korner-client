// Routes and Config for the App file

App.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$httpProvider',
  'urlProvider',
  function(
    $stateProvider,
    $urlRouterProvider,
    $httpProvider,
    urlProvider
  ) {

    // $log.debug("app.config: WARNING: CORS Requests [enabled] for Ionic Serve");
    // $log.debug("should be [disabled] for device testing!!!!");
    // $log.debug("");


    //
    // Enable receiving cookies when using CORS
    //-----------------------------------------
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];


    //
    // Routes Definition
    //------------------------------------------


    // if none of the states below are matched, use this as the fallback
    $urlRouterProvider.otherwise('/startup/splash');

    $stateProvider.state('app', {
      url: "",
      abstract: true,
      // template: '<div ui-view class="jojojo"></div>',
      views: {
        'app-view': {
          templateUrl: urlProvider.basepath('app.html'),
        }
      },
      data: {
        accessLevel: accessLevels.none
      },
      sticky: true,
      dsr: true
    });


    startupRoutes($stateProvider, urlProvider);
    accountRoutes($stateProvider, urlProvider);
    circleRoutes($stateProvider, urlProvider);
    homeRoutes($stateProvider, urlProvider);
    intrusionRoutes($stateProvider, urlProvider);
    //gettingStartedWizardRoutes($stateProvider, urlProvider);
    wizardManagerRoutes($stateProvider, urlProvider);
    wizardWelcomeRoutes($stateProvider, urlProvider);
    wizardFobSetupRoutes($stateProvider, urlProvider);
    wizardExtenderSetupRoutes($stateProvider, urlProvider);
    wizardTagSetupRoutes($stateProvider, urlProvider);
    wizardCircleSetupRoutes($stateProvider, urlProvider);

    debugRoutes($stateProvider, urlProvider);



  }
]);

angular.module('app')
  .controller('NullController', function() {});
