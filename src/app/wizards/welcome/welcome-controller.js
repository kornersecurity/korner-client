(function () {
  'use strict';

  angular.module('app.wizard')
    .controller('welcomeController', welcomeController);

  /* @ngInject */
  function welcomeController(
    $scope,
    $state,
    userService,
    wizardType,
    FobCollection,
    $log
  ) {


    function nextPage() {
      $log.debug('[welcome-controller] SHOW NEXT PAGE');

      if ($scope.wizard.wizardManagerData.currentWizard.currentPage < 2) {
        $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
        $scope.wizard.changeState();
      }
    }


    function previousPage() {
      $log.debug('[welcome-controller] SHOW PREVIOUS PAGE');

      if ($scope.wizard.wizardManagerData.currentWizard.currentPage > 1) {
        $scope.wizard.wizardManagerData.decreaseCurrentWizardPage();
        $scope.wizard.changeState();
      }
    }

    (function () {

      FobCollection.getCount()
        .then(function (fobCount) {

          if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME &&
            fobCount > 0) {
            $log.debug('[welcome-controller] SKIPPING WIZARD');
            $scope.wizard.skipWizard();
          } else {
            $scope.$on('wizardEvent::showNextPage', nextPage);
            $scope.$on('wizardEvent::showPreviousPage', previousPage);
          }
        }, function () {
          // seb please review
          // unable to count - enable pages???
          $scope.$on('wizardEvent::showNextPage', nextPage);
          $scope.$on('wizardEvent::showPreviousPage', previousPage);
        });


    })();
  }
})();
