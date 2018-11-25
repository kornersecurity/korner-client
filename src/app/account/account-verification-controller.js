(function() {
  'use strict';

  angular.module('app.account')
  .controller('account.verification.controller', verificationController);

  /* @ngInject */
  function verificationController(
    $rootScope,
    $scope,
    $timeout,
    $state,
    $ionicLoading,
    $ionicPopup,
    accountService
  ) {

    $scope.showSpinner = false;

    $scope.alerts = [];
    $scope.request_code = {}; // data for form

    var showAlert = function() {
      $timeout(hideAlert, 3500);
    };

    var hideAlert = function() {
      $scope.alerts.pop();
      if ($scope.alerts.length > 0) {
        $timeout(hideAlert, 1500);
      }
    };

    $scope.requestVerificationCode = function(valid) {

      //TODO IMPLEMENT ACCOUNT VERFICATION CODE REQUEST
      $ionicLoading.show({
        template: "Please Wait..."
      });

      var parentScope = this;
      if (valid) {
        accountService.registration($scope.registration,
          function() {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: "Registration Successful",
              template: "<div class='text-center'>An Account Verification email has been sent to<br><b>" + $scope.registration.email + "</b></div>"
            });
            $state.go('app.account.login', {}, {});
          },
          function(data, status, headers, config) {
            $ionicLoading.hide();
            // $ionicPopup.alert({
            //   title: "Korner",
            //   template: data.message
            // });

            $scope.alerts.push({
              type: "warning",
              msg: data.message
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
