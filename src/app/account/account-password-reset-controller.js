  (function() {
  'use strict';

  angular.module('app.account')
  .controller('account.password.reset.controller', passwordResetController);

  /* @ngInject */
  function passwordResetController(
    $rootScope,
    $scope,
    $timeout,
    $state,
    $ionicLoading,
    $ionicPopup,
    accountService,
    $log,
    $stateParams
  ) {

    $scope.showSpinner = false;
    $scope.reset_password = {
      //password: '',
      //confirmPassword: ''
      token: $stateParams.resetToken
    };
    $scope.passwordValidationStrongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");


    // Alerts - needs to moved to command JS File

    $scope.alerts = [];


    var showAlert = function() {
      $timeout(hideAlert, 3500);
    };

    var hideAlert = function() {
      $scope.alerts.pop();
      if ($scope.alerts.length > 0) {
        $timeout(hideAlert, 1500);
      }
    };


    $scope.onReset = function(valid) {
      $ionicLoading.show({
        template: "Please Wait..."
      });

      var parentScope = this;
      if (valid) {
        accountService.resetPassword($scope.reset_password,
          function() {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: "Password Reset Successful",
              template: "<div class='text-center'>Your password has been reset successfully.</div>"
            });
            $state.go('app.account.login', {}, {});
          },
          function(err) {
            $ionicLoading.hide();
            // $ionicPopup.alert({
            //   title: "Korner",
            //   template: data.message
            // });

            $log.debug("ERROR: "+err.data.message);

            $scope.alerts.push({
              type: "warning",
              msg: err.data.message
            });

            showAlert();
          }
        );
      }
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

  }
})();
