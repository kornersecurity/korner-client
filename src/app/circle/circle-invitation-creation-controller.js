(function() {
  'use strict';

  angular.module('app.circle')
    .controller('circleInvitationCreationController', circleInvitationCreationController);

  /* @ngInject */
  function circleInvitationCreationController(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    circleService,
    uiLoadingService,
    $log,
    $timeout,
    $window
  ) {

    $scope.showSpinner = false;
    $scope.token = $stateParams.token;
    $scope.registration = {};
    $scope.alerts = [];

    uiLoadingService.show('', "kornerProfile");
    // retrieve information about the user
    circleService.getAccountInfo($scope.token,
      function(res) {
        $scope.registration = res;
        uiLoadingService.hide();
      },
      function(res) {
        $state.go('app.circle.invitation-problem', {}, {});
        uiLoadingService.hide();
      }
    );

    $scope.showTerms = function() {
      $log.debug('[account-registration-controller] SHOWING TERMS IN NEW WINDOW');
      $window.open('http://www.kornersafe.com/privacy', '_system');
    };

    $scope.onCompleteSignup = function(valid) {
      $log.debug('[circle-invitation-creation] COMPLETING SIGNUP');
      uiLoadingService.show('Creating account...', "kornerProfile");
      var parentScope = this;
      if (valid) {
        circleService.updateAccount($scope.registration, $scope.token,
          function() {
            uiLoadingService.hide();
            $state.go('app.circle.member-creation-successful', {}, {});
          },
          function(err) {
            $log.debug(err);
            if (err.data === null) {
              err.data = {
                message: "Problem with service, please try again"
              };
            }
            uiLoadingService.hide();
            $scope.alerts = [{
              type: "warning",
              msg: err.data.message
            }];
            $timeout(function() {
              $scope.alerts = [];
            }, 3500);
          }
        );
      }
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

  }
})();
