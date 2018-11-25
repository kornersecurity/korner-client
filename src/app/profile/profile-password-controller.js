(function() {
'use strict';

angular.module('app.profile')
.controller('profilePasswordController', profilePasswordController);

/* @ngInject */
function profilePasswordController(
  $rootScope,
  $scope,
  $timeout,
  $state,
  $ionicLoading,
  $ionicPopup,
  ProfileService,
  $log,
  $stateParams
) {

  $scope.showSpinner = false;
  $scope.change_password = {};


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


  $scope.changePassowrd = function(valid) {
    $ionicLoading.show({
      template: "Please Wait..."
    });

    var parentScope = this;
    if (valid) {


      ProfileService.changeProfilePassowrd($scope.change_password).then(
        function() {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: "Password Change Successful",
            template: "<div class='text-center'>Your password has been updated successfully.</div>"
          });

          $scope.change_password = {
            old_password: '',
            new_password: '',
            confirm_password: ''
          };

          $scope.changePasswordForm.$setPristine();
          // $state.go('app.account.login', {}, {});
        },
        function(err) {
          $ionicLoading.hide();
          // $ionicPopup.alert({
          //   title: "Korner",
          //   template: data.message
          // });

          $log.debug("[profile-password-controller] ERROR: "+err.data.message);

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
