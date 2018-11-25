(function() {
    'use strict';
    angular.module('app.wizard.extender')
    .controller('extenderSetupControllerPage2', extenderSetupControllerPage2);

    /* @ngInject */
    function extenderSetupControllerPage2(
      $scope,
      $state
    ) {
      $scope.wizard.extenderSetup.p2 = {};

      (function() {
        $scope.wizard.pageCode = '311';
        $scope.wizard.enableNextButton();
        if ($scope.wizard.extenderSetup.canGoBack === false) {
          // $scope.wizard.disablePreviousButton();
          $scope.wizard.canExitWizard = true;
        }
      })();
    }
})();
