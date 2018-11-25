angular.module('app.account')
  .controller('account.forgot.password.controller', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$state',
    '$ionicLoading',
    '$ionicPopup',
    'accountService',
    '$log',
    function (
      $rootScope,
      $scope,
      $timeout,
      $state,
      $ionicLoading,
      $ionicPopup,
      accountService,
      $log
    ) {

      $scope.reset = {
        // email: "test@kornersafe.com"
      };

      // Alerts - needs to moved to command JS File

      $scope.alerts = [];


      var showAlert = function () {
        $timeout(hideAlert, 5000);
      };

      var hideAlert = function () {
        $scope.alerts.pop();
        if ($scope.alerts.length > 0) {
          $timeout(hideAlert, 1500);
        }
      };


      $scope.onReset = function () {
        $log.debug('[account.forgot.password.controller] RESETTING PASSWORD');
        $scope.alerts = [];
        $ionicLoading.show({
          template: "Please wait..."
        });

        var parentScope = this;
        accountService.forgotPassword($scope.reset,
          function () {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: "Korner",
              template: "<div class='text-center'>A Password Reset email has been sent to<br><b>" + $scope.reset.email + "</b></div>"
            });
            $state.go('app.account.login', {}, {});
          },
          function (error) {
            // var message = "";
            // switch (status) {
            //   case 401:
            //     message = "<div class='text-center'>No account found for email<br><b>" + $scope.reset.email + "</b><br>Please try again.</div>";
            //     break;
            //   default:
            //     message = "<div class='text-center'>Temporary service issue.<br>Please try again.</div>";
            //     break;
            // }
            $ionicLoading.hide();
            // $ionicPopup.alert({
            //   title: "Korner",
            //   template: message
            // });

            if (error.status === 401) {
              $scope.alerts.push({
                type: "warning",
                msg: "No account found for email " + $scope.reset.email + ". Please try again."
              });
            } else if (error.status !== 500 && error.status !== 503 && error.status !== 0) {
              $scope.alerts.push({
                type: "warning",
                msg: data.message
              });
              showAlert();
            } else {
              $scope.alerts.push({
                type: "warning",
                msg: "Problem with service, please try again."
              });
              console.log(data);
              showAlert();
            }
          }
        );

      };


      $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
      };


    }
  ]);
