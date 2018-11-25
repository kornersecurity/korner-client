(function() {
  'use strict';

  angular.module('app.account')
    .controller('account.login.controller', accountLoginController);

  /* @ngInject */
  function accountLoginController(
    $rootScope,
    $scope,
    $timeout,
    $state,
    $localStorage,
    $ionicLoading,
    $ionicPopup,
    _,
    accountAuthService,
    SessionService2,
    contentCircleSetup,
    $log
  ) {

    $scope.$storage = $localStorage.$default({
      email: '',
      rememberMe: true
    });

    $scope.login = {
      email: '',
      password: '',
      rememberMe: false
    };

    $scope.alerts = [];
    $scope.shows = 0;
    $scope.timeoutPending = false;

    var showAlert = function() {
      $scope.shows++;
      if (!$scope.timeoutPending) {
        $scope.timeoutPending = true;
        $timeout(hideAlert, 3500);
      }
    };

    var hideAlert = function() {
      $scope.shows--;
      if ($scope.shows > 0) {
        $timeout(hideAlert, 1500);
      } else {
        $scope.alerts = [];
        $scope.timeoutPending = false;
      }
    };

    var pushAlert = function(alert) {
      if (_.findIndex($scope.alerts, function(item) {
          return (item.type == alert.type && item.msg == alert.msg);
        }) < 0) {
        $scope.alerts.push(alert);
      }
    };

    $scope.catchEnter = function(keyEvent) {
      if (keyEvent.which === 13) {
        keyEvent.preventDefault();
        if(window.cordova && cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.close();
        }
        keyEvent.target.blur();
        $scope.onLogin();
      }
    };

    $scope.onLogin = function() {

      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>',
      });

      $scope.login.email = $scope.$storage.email;
      $scope.login.rememberMe = $scope.$storage.rememberMe;

      accountAuthService.login($scope.login).then(function() {

        $state.go('app.startup.splash', {}, {});

        // SessionService2.onStartup().then(function() {
        //   $ionicLoading.hide();
        // }, function() {
        //   $ionicLoading.hide();
        // });
      }, function(res) {
        $ionicLoading.hide();
        if(res.status === 403){
          var confirmClosePopup = $ionicPopup.confirm({
            title: "Korner",
            template: "<div class='text-center'>Your account has not been verified, would you like us to send you a new verification email?</div>",
            cancelText: contentCircleSetup.NO,
            okText: contentCircleSetup.YES
          }).then(
          function(res) {
            if(res) {
              $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>',
              });
              accountAuthService.resendVerificationEmail($scope.login.email).then(
                function() {
                  $ionicLoading.hide();
                  $log.debug('[account.login.controller] SUCCESS');
                  $ionicPopup.alert({
                    title: "Korner",
                    template: "<div class='text-center'>An Account Verification email has been sent to<br><b>" + $scope.login.email + "</b></div>"
                  });
                },
                function(res) {
                  $ionicLoading.hide();
                  pushAlert({
                    type: "warning",
                    msg: res.data.message
                  });
                  showAlert();
                }
              );

            }
          });

        } else {
          pushAlert({
            type: "warning",
            msg: res.data.message
          });
          showAlert();
        }
      });

    };

    $scope.onHideAlert = function() {
      $scope.showAlert = false;
    };


    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }
})();
