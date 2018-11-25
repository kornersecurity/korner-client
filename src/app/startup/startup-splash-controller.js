(function() {
  'use strict';

  angular.module('app.startup')
    .controller('startup.splash.controller', startupSplashController);


  /* @ngInject */
  function startupSplashController(
    $rootScope,
    $scope,
    $state,
    $ionicLoading,
    $ionicPopup,
    connection,
    accountAuthService,
    SessionService2,
    gettextCatalog,
    $log,
    $cordovaSplashscreen
  ) {

    $log.debug('>>> startup.splash.controller');

    function showWait() {
      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>',
      });
    }

    function hideWait() {
      $ionicLoading.hide();
      if(window.cordova && cordova.plugins.Keyboard) {
        $cordovaSplashscreen.hide();
      }
    }


    function showServerUnavailable() {
      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner><br/>Server under maintenance.<br/>Please wait...',
      });
    }

    function hideServerUnavailable() {
      $ionicLoading.hide();
    }

    function showNetworkIssue() {
      $ionicPopup.show({
        templateUrl: 'app/views/network-issue-popup.html',
        title: 'Korner',
        scope: $scope,
        buttons: [{
          text: '<b>Retry</b>',
          type: 'button-positive',
          onTap: function(e) {
            showWait();
            checkNetwork();
          }
        }]
      });
    }

    function checkNetwork() {
      if (connection.isNetworkAvailable()) {
        console.log('CHECKING NETWORK');
        checkUserLogin();
      } else {
        hideWait();
        showNetworkIssue();
      }
    }

    function checkUserLogin() {
      console.log('CHECKING USER LOGGED IN');

      accountAuthService.hasCurrentUser().then(
        function(currentUser) {
          SessionService2.onStartup().then(
            function() {
              hideWait();
            },
            function(res){
              if(res === undefined || res.status === 503 ||
                 res.status === 0 || res === 0 || res === 503){
                showServerUnavailable();
                checkServerStatus();
              }
            }
          );
        },
        function(res) {
          hideWait();
          if(res.status === 503 || res.status === 0){
            showServerUnavailable();
            checkServerStatus();
          } else {
            $state.go('app.account.login', {}, {});
          }
        }
      );
    }

    function checkServerStatus(){
        setTimeout(function() {
          connection.checkServerStatus().then(function(){
            console.log('SERVER AVAILABLE');
            hideServerUnavailable();
            showWait();
            checkUserLogin();
          }, function(res){
            checkServerStatus();
            console.log('SERVER UNAVAILABLE');
          });
        }, 1000*4);
    }

    ionic.Platform.ready(function() {
      setTimeout(function() {
        showWait();
        checkNetwork();
      }, 1000);
    });

  }
})();
