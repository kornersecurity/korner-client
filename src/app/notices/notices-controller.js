(function() {
  'use strict';

  angular.module('app.notice')
    .controller('noticesController', noticesController);


  /* @ngInject */
  function noticesController(
    $scope,
    $mdDialog,
    noticeService,
    contentNotices,
    $interval,
    uiLoadingService,
    $log
  ) {
    // $log.debug('P1 CONTROLLER');
    $scope.noticeScreen = {};
    $scope.noticeScreen.loadingNotices = true;

    $scope.noticeScreen.closeModal = function() {
      $log.debug('[notices-controller] CLOSING MODAL');
      // $rootScope.profileModal.hide();
      $mdDialog.hide();
    };

    (function() {
      $interval(function(){
        uiLoadingService.show(contentNotices.LOADING, "kornerNotices");
        // $scope.$on('wizardEvent::showNextPage', nextPage);
        $log.debug('[notices-controller] LOADING NOTICES: ' + $scope.noticeScreen.loadingNotices);
        noticeService.getNotices(function(notices) {
          $scope.noticeScreen.notices = notices;
          $scope.noticeScreen.loadingNotices = false;
          uiLoadingService.hide();
          $log.debug('[notices-controller] INVITATIONS LOADED: ' + notices.length, $scope.noticeScreen.loadingNotices);
        });
      }, 200, 1);
    })();
  }
})();
