(function() {
  'use strict';

  angular.module('app.credits')
    .controller('creditsController', creditsController);


  /* @ngInject */
  function creditsController(
    $scope,
    $mdDialog,
    $interval,
    uiLoadingService,
    creditsService,
    $log
  ) {
    // $log.debug('P1 CONTROLLER');
    $scope.creditsScreen = {};
    $scope.creditsScreen.loadingCredits = true;

    $scope.creditsScreen.closeModal = function() {
      $log.debug('[credits-controller] CLOSING MODAL');
      // $rootScope.profileModal.hide();
      $mdDialog.hide();
    };

    (function() {
      $interval(function(){
        //uiLoadingService.show(contentCredits.LOADING, "kornerCredits");
        // $scope.$on('wizardEvent::showNextPage', nextPage);
        $log.debug('[credits-controller] LOADING CREDITS: ' + $scope.creditsScreen.loadingCredits);
        creditsService.getActivity(function(credits) {
          //$scope.noticeScreen.notices = notices;
          //$scope.noticeScreen.loadingNotices = false;
          //uiLoadingService.hide();
          $log.debug('[notices-controller] CREDITS LOADED: ' + credits.length, $scope.creditsScreen.loadingCredits);
        });
      }, 200, 1);
    })();
  }
})();
