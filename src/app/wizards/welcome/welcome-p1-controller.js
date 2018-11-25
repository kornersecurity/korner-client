(function() {
  'use strict';
  angular.module('app.wizard')
  .controller('welcomeControllerPage1', welcomeControllerPage1);

  /* @ngInject */
  function welcomeControllerPage1(
    $scope,
    $state,
    $log
  ) {
    // $log.debug('P1 CONTROLLER');
    $scope.wizard.welcomeSetup = {};

    function onClose() {
      // Trick to make sure the user is logged out
      $scope.wizard.canExitWizard = false;
    }

    (function() {
      // $scope.wizard.welcomeSetup.showVideo = true;
      $scope.wizard.canExitWizard = true;
      $scope.$on('wizardEvent::WizardClose', onClose);
      $scope.wizard.pageCode = '100';
      // $log.debug('[welcome-p1-controller] SKIPPING WIZARD');
      // $scope.wizard.skipWizard();
    })();
  }
})();
