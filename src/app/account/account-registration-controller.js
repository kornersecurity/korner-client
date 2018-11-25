angular.module('app.account')
  .controller('account.registration.controller', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$state',
    '$ionicLoading',
    '$ionicPopup',
    'accountService',
    '$log',
    '$window',
    function (
      $rootScope,
      $scope,
      $timeout,
      $state,
      $ionicLoading,
      $ionicPopup,
      accountService,
      $log,
      $window
    ) {

      $scope.showSpinner = false;
      $scope.registration = {
        //first_name: "matt",
        //last_name: "Smith",
        //email: 'matt.smith@kornersafe.com',
        //password: 'Password',
        //confirmPassword: 'Password',
        //accept: true
      };


      // Alerts - needs to moved to command JS File

      $scope.alerts = [];
      $scope.passwordValidationStrongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");


      var showAlert = function () {
        $timeout(hideAlert, 3500);
      };

      var hideAlert = function () {
        $scope.alerts.pop();
        if ($scope.alerts.length > 0) {
          $timeout(hideAlert, 1500);
        }
      };

      $scope.showTerms = function () {
        $log.debug('[account-registration-controller] SHOWING TERMS IN NEW WINDOW');
        $window.open('http://www.kornersafe.com/privacy', '_system');
      };

      $scope.onRegistration = function (valid) {
        $ionicLoading.show({
          template: "Please Wait..."
        });

        var parentScope = this;
        if (valid) {
          accountService.registration($scope.registration,
            function () {
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: "Registration Successful",
                template: "<div class='text-center'>An Account Verification email has been sent to<br><b>" + $scope.registration.email + "</b></div>"
              });
              $state.go('app.account.login', {}, {});
            },
            function (err) {
              $ionicLoading.hide();
              // $ionicPopup.alert({
              //   title: "Korner",
              //   template: data.message
              // });
              // $log.debug('[account-registration-controller] ERROR: '+err);

              $scope.alerts.push({
                type: "warning",
                msg: err.data.message
              });

              showAlert();
            }
          );
        }
      };

      $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
      };

    }
  ]);
