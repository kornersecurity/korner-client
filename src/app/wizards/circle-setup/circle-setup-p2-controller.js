(function() {
  'use strict';
  angular.module('app.wizard.circle')
  .controller('circleSetupControllerPage2', circleSetupControllerPage2);

  /* @ngInject */
  function circleSetupControllerPage2(
    $scope,
    $state,
    fobUserStatusConst,
    $log
  ) {
    // $log.debug('P1 CONTROLLER');

    (function() {
      $scope.wizard.pageCode = '506';
      // HACK to show exit button
      $scope.wizard.wizardManagerData.currentPage = 1;
      $scope.wizard.canExitWizard = true;
      // END HACK

      $scope.$on('wizardEvent::showNextPage', function(){
      $scope.wizard.wizardManagerData.currentPage++;
      });
      $scope.fobUserStatusConst = fobUserStatusConst;
      if ($scope.wizard.circleSetup.canGoBack === false) {
        $scope.wizard.disablePreviousButton();
      }
    })();
  }
})();
