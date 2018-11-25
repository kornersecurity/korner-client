// Main application file


if (typeof $ === 'undefined') {
  throw new Error('This application\'s JavaScript requires jQuery');
}

var App = angular.module('app', [
  'ionic',
  'restangular',
  'ngAnimate',
  'ngStorage',
  'ngCordova',
  'angular.filter',
  'angularMoment',
  'gettext',
  'ui.router',
  'cfp.loadingBar',
  'ngMaterial',
  'ngMessages',
  'ct.ui.router.extras.sticky',
  'ngFileUpload',
  'app.core',
  'app.component',
  'app.startup',
  'app.account',
  'app.account.component',
  'app.account.service',
  'app.circle',
  'app.credits',
  'app.circlefeed',
  'app.intrusion',
  'app.debug',
  'app.home',
  'app.invitation',
  'app.notice',
  'app.profile',
  'app.profile.service',
  'app.wizard',
  'app.fob.setup',
  'ionic-timepicker',
  'app.timepicker'
]);


App.config(['$logProvider', '$mdGestureProvider', '$mdThemingProvider', 'appSettingsConst', function($logProvider, $mdGestureProvider,
  $mdThemingProvider, appSettingsConst) {
  $logProvider.debugEnabled(appSettingsConst.debug);
  $mdGestureProvider.skipClickHijack();

  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('green')
    .warnPalette('orange');

  $mdThemingProvider.theme('alarmTheme')
    .primaryPalette('green')
    .accentPalette('cyan')
    .warnPalette('red');

  $mdThemingProvider.theme('alarmTheme2')
    .primaryPalette('deep-orange')
    .accentPalette('cyan')
    .warnPalette('red');

  $mdThemingProvider.theme('menuTheme')
    .primaryPalette('cyan')
    .accentPalette('amber')
    .warnPalette('blue-grey');

  $mdThemingProvider.theme('wizardTheme')
    .primaryPalette('blue-grey')
    .accentPalette('amber')
    .warnPalette('blue-grey');



}]);

App.run([
  '$rootScope',
  '$ionicPlatform',
  'gettextCatalog',
  'appSettingsConst',
  '$log',
  'ServerLoggerService',
  '$state',
  '$mdDialog',
  'connection',
  'clientUpdateEventConst',
  function(
    $rootScope,
    $ionicPlatform,
    gettextCatalog,
    appSettingsConst,
    $log,
    ServerLoggerService,
    $state,
    $mdDialog,
    connection,
    clientUpdateEventConst
  ) {
    $ionicPlatform.ready(function() {

      // works for earlier version of Android (2.3.x)
      if (navigator && navigator.userAgent && (androidLang = navigator.userAgent
          .match(/android.*\W(\w\w)-(\w\w)\W/i))) {
        gettextCatalog.setCurrentLanguage(androidLang[1].split('-')[0]);
      } else {
        // works for iOS and Android 4.x
        if (navigator.userLanguage) {
          gettextCatalog.setCurrentLanguage(navigator.userLanguage.split('-')[0]);
        } else if (navigator.language) {
          gettextCatalog.setCurrentLanguage(navigator.language.split('-')[0]);
        }
      }
      // $log.debug("CURRENT LANGUAGE: "+gettextCatalog.currentLanguage);
      gettextCatalog.setCurrentLanguage('en');
      gettextCatalog.debug = appSettingsConst.debug;
      // $log.debug("DEBUG MODE: "+gettextCatalog.currentLanguage);

      $rootScope.appRuntime = {
        hasCamera: (navigator.camera !== undefined && navigator.camera !== null),
        canImportContacts: (navigator.contacts !== undefined && navigator.contacts !== null),
        isMobileApp: (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1)
      };

      $rootScope.appRuntime.version = appSettingsConst.version;
      $rootScope.appRuntime.build   = appSettingsConst.build;
      if(appSettingsConst.endPoint.indexOf('secure') > -1) {
        $rootScope.appRuntime.environment   = '';
      } else if(appSettingsConst.endPoint.indexOf('korner-test') > -1) {
        $rootScope.appRuntime.environment   = 't';
      } else {
        $rootScope.appRuntime.environment   = 'd';
      }

      $log.debug('[app] END POINT:           '+appSettingsConst.endPoint+" ("+$rootScope.appRuntime.environment+')');
      $log.debug('[app] IS TEST ENVIRONMENT: '+(appSettingsConst.endPoint.indexOf('korner-test') > -1));
      $log.debug('[APP] VERSION:             '+appSettingsConst.version+"."+appSettingsConst.build);

      // console.log("[app] APP RUNTIME - URL: " + document.URL);
      // console.log("[app] APP RUNTIME - CAN IMPORT CONTACTS: " + $rootScope.appRuntime.canImportContacts);
      // console.log("[app] PLATFORM: " + navigator.platform);

      if (navigator.platform !== 'MacIntel') {
        $rootScope.appRuntime.contentOffset = 0;
      }

      ServerLoggerService.logAppInfo();

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      // if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //   // cordova.plugins.Keyboard.disableScroll(true);
      // }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        window.StatusBar.styleDefault();
        window.StatusBar.hide();
        ionic.Platform.isFullScreen = true;
      }


      $rootScope.$on('$stateChangeError', function(event, toState, toParams,
        fromState, fromParams, error) {
        $log.debug(error);
      });

      // $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
      //   console.log($state.current.name);
      //   if($state.current.name.indexOf('wizard-manager') > -1){
      //     event.preventDefault();
      //   } else {
      //     $mdDialog.cancel();
      //   }
      // });

      $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        $rootScope.$previousState = from;
        // $log.debug('[APP] PREVIOUS STATE: '+from);
        // console.log(from);
        // console.log(to);
      });


      // Stops Android back button event
      $ionicPlatform.onHardwareBackButton(function() {
        event.preventDefault();
        event.stopPropagation();
        // alert('[app] BACK BUTTON PRESSED');
      });

      document.addEventListener("pause", onAppPause, false);
      document.addEventListener("resume", onAppResume, false);

      function onAppPause(){
        $rootScope.$apply(function() {
          $rootScope.$emit('AppEvent:Pause');
          $rootScope.appTimeInBackground = Date.now();
        });
      }

      function onAppResume(){
        $log.debug('[app] RESUME - APP INACTIVE FOR: '+(Date.now() - $rootScope.appTimeInBackground)/1000+' SECONDS');


        if(Date.now() - $rootScope.appTimeInBackground > 5 * 60 * 1000) {
          $rootScope.$apply(function() {
            $rootScope.$emit('AppEvent:Restart', true);
            $rootScope.restart();
          });
        } else if(Date.now() - $rootScope.appTimeInBackground > 30 * 1000) {

            if(connection.isConnected()) {
              // $log.debug('[app] DISPATCHING AppEvent:ReloadFobs');
              if($rootScope.removeSocketStateChangeHandler){
                $rootScope.removeSocketStateChangeHandler();
              $rootScope.removeSocketStateChangeHandler = null;
            }

            connection.disconnect();
              }



          $rootScope.removeSocketStateChangeHandler = $rootScope.$on(clientUpdateEventConst.SOCKET_STATE_CHANGE, function(readyState) {
            // $log.debug('[app] SOCKET CONNECTED: '+connection.isConnected());
            // if(connection.isConnected()) {
            //   // $log.debug('[app] DISPATCHING AppEvent:ReloadFobs');
            //   if($rootScope.removeSocketStateChangeHandler){
            //     $rootScope.removeSocketStateChangeHandler();
            //   }

              $rootScope.$emit('AppEvent:ReloadFobs', true);
              $rootScope.$emit('AppEvent:ReloadActivity', true);
            // }
          });

          connection.connect();

        }
      }

    });


    // Set to abbreviated moment's time ago format
    moment.locale('en', {
      relativeTime: {
        future: "Now",
        past: "%s",
        s: "%ds",
        m: "1m",
        mm: "%dm",
        h: "1h",
        hh: "%dh",
        d: "1d",
        dd: "%dd",
        M: "1mon",
        MM: function(number, withoutSuffix, key, isFuture) {
          $log.debug("number = " + number);
          $log.debug("withoutSuffix = " + withoutSuffix);
          $log.debug("key = " + key);
          $log.debug("isFuture = " + isFuture);
          return "xxx";
        },
        y: "1y",
        yy: "%dy"
      }
    });


  }
]);

App.factory('_', ['$window',
  function($window) {
    // place lodash include before angular
    return $window._;
  }
]);

App.config(function($ionicConfigProvider) {

  $ionicConfigProvider.views.maxCache(0);

  $ionicConfigProvider.tabs.position("bottom");
  $ionicConfigProvider.navBar.alignTitle("center");

  // Disables ios Swipe to navigate back
  $ionicConfigProvider.views.swipeBackEnabled(false);
});

App.config(function(RestangularProvider, serverProvider, connectionProvider, appSettingsConst) {

  // $log.debug('server base url for Restangular: ' + serverProvider.getBaseUrl());
  console.log('APP SETTINGS: '+appSettingsConst);
  serverProvider.setConnectionParams(appSettingsConst);
  RestangularProvider.setBaseUrl(serverProvider.getBaseUrl());
  connectionProvider.setSocketUri(serverProvider.getSocketUri());

  // $log.debug('');

});

App.config(['$animateProvider', function($animateProvider) {
  // restrict animation to elements with the bi-animate css class with a regexp.
  // note: "bi-*" is our css namespace at @Bringr.
  $animateProvider.classNameFilter(/^((?!(fa-spinner)).)*$/);
}]);


App.provider('url', [function() {
  // In the provider function, you cannot inject any
  // service or factory. This can only be done at the
  // "$get" method.

  this.name = 'urlProviderName';

  return {

    $get: function() {
      var name = this.name;
      return {};
    },
    // Set here the base of the relative path
    // for all app views
    basepath: function(uri) {
      return 'app/views/' + uri;
    }

  };



}]);
//
// angular.element(document).ready(function() {
//   $.get('app/config/settings-config.json').success(
//     function(data) {
//       var connectionParams = data.environments[data.selectedEnvironment];
//
//       console.log('BOOTSTRAPING APP: '+connectionParams.debug);
//
//       App.constant('appSettings', {
//         connectionParams: connectionParams,
//       });
//
//       App.constant('appDebugConst', {
//         isDebugOn: connectionParams.debug,
//       });
//
//       angular.bootstrap('#app', ['app']);
//     });
// });
