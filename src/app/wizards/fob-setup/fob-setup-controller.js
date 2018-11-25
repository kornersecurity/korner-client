(function() {
  'use strict';

  angular.module('app.wizard.fob')
    .controller('fobSetupController', fobSetupController);

  /* @ngInject */
  function fobSetupController(
    $scope,
    $state,
    FobService2,
    $timeout,
    wizardType,
    $log
  ) {

    $scope.wizard.fobSetup = {};

    $scope.nextPage = function() {
      $log.debug('[fob-setup-controller] SHOW NEXT PAGE');

      if ($scope.wizard.wizardManagerData.currentWizard.currentPage < 2) {
        $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
        $scope.wizard.changeState();
      }
    };


    $scope.previousPage = function() {
      $log.debug('[fob-setup-controller] SHOW PREVIOUS PAGE');

      if ($scope.wizard.wizardManagerData.currentWizard.currentPage > 1) {
        $scope.wizard.wizardManagerData.decreaseCurrentWizardPage();
        $scope.wizard.changeState();
      }
    };

    $scope.toggleHelp = function() {
      $scope.$broadcast('toggleHelp');
    };

    $scope.getScrollHeight = function(height) {
      var scrollHeight = window.innerHeight - height;
      return scrollHeight + 'px';
    };

    // MODAL STUFF
    $scope.dismiss = function() {
      $scope.$dismiss();
    };

    $scope.closeWizard = function(templateName) {
      $log.debug('[fob-setup-controller] CLOSING WIZARD');
      $scope.wizard.fobSetup.searchingFob = false;
      $timeout.cancel($scope.wizard.fobSetup.findUnregisteredFobTimer);
    };

    function destroyController() {
      $scope.wizard.fobSetup = null;
      $log.debug('[fobSetupController] CONTROLLER DESTROYED');
    }

    (function() {
      $scope.wizard.fobSetup.selectedFob = FobService2.fob;
      $scope.wizard.fobSetup.fobSetupInitialzed = false;

      $log.debug('[fob-setup-controller] SELECTED FOB: ' + $scope.wizard.fobSetup.selectedFob);

      if ($scope.wizard.fobSetup.selectedFob) {
        $scope.wizard.fobSetup.canGoBack = false; //used to allow user to go back to page 1
        $scope.nextPage();
      } else {
        $scope.wizard.fobSetup.canGoBack = true;

        $scope.$broadcast('wizardEvent::initialize', {});
        $scope.wizard.fobSetup.fobSetupInitialzed = true;
      }

      // if($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
      //   $scope.wizard.wizardManagerData.currentWizard.pages.length = 3;
      // }

      $scope.$on('wizardEvent::closeWizard', $scope.closeWizard);
      $scope.$on('wizardEvent::showNextPage', $scope.nextPage);
      $scope.$on('wizardEvent::showPreviousPage', $scope.previousPage);

      $scope.$on('$destroy', destroyController);
    })();
  }
})();
