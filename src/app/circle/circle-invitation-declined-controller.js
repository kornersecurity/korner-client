(function() {
  'use strict';

  angular.module('app.circle')
  .controller('circleInvitationDeclinedController', circleInvitationDeclinedController);

  /* @ngInject */
  function circleInvitationDeclinedController(
    $rootScope,
    $scope,
    $http,
    $timeout,
    $state,
    $stateParams,
    circleService,
    uiLoadingService
  ) {


    $scope.reason = "";
    $scope.token = $stateParams.token;
    $scope.alerts = [];



    $scope.onDecline = function() {
      uiLoadingService.show('', "kornerProfile");
      var parentScope = this;
      circleService.decline($scope.reason, $scope.token,
        function() {
          $state.go('app.startup.splash', {}, {});
          uiLoadingService.hide();
        },
        function(err) {
          uiLoadingService.hide();
          if(err.data === null){
            err.data = {message: "Problem with service, please try again"};
          }
          $scope.alerts = [{
            type: "warning",
            msg: err.data.message
          }];

          $timeout(function(){ $scope.alerts = []; }, 3500);
        });
    };


  }
})();
