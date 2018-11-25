(function() {
  'use strict';
  angular.module('app.wizard.tag')
    .controller('tagSetupControllerPage3', tagSetupControllerPage3);

    /* @ngInject */
    function tagSetupControllerPage3(
    $scope,
    $state,
    WizardModel,
    $log
  ) {
    $scope.wizard.tagSetup.p3 = {};

    $scope.wizard.tagSetup.p3.validateData = function() {
      if ($scope.wizard.tagSetup.openingMechanism !== undefined && $scope.wizard.tagSetup.openingMechanism !== null) {
        $scope.wizard.enableNextButton();
        $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
        $scope.wizard.changeState();
      } else {
        $scope.wizard.disableNextButton();
      }
    };

    $scope.wizard.tagSetup.p3.openingMechanismChanged = function(mechanism) {
      // $log.debug("[tag-setup-p3-controller] SELECTED MECHANISM: " +
      // mechanism.id);

      var mechanismId = mechanism.id;
      var mechanismChecked = mechanism.checked;

      for (var m in $scope.wizard.tagSetup.p3.openingMechanisms) {
        $scope.wizard.tagSetup.p3.openingMechanisms[m].checked = false;
      }

      mechanism.checked = mechanismChecked;

      // $log.debug("[tag-setup-p3-controller] SELECTED MECHANISM CHECKED: " +
      // mechanismChecked);

      if (mechanismChecked) {
        $scope.wizard.tagSetup.openingMechanism = mechanism;
        $scope.wizard.tagSetup.portalMechanismId = mechanism.id;
      }
      else {
        $scope.wizard.tagSetup.openingMechanism = null;
        $scope.wizard.tagSetup.portalMechanismId = null;
      }

      $scope.wizard.tagSetup.p3.validateData();
    };

    (function() {

        $scope.wizard.pageCode = '402';
      // $log.debug("[tag-setup-p3-controller] SELECTED MECHANISM: " +
      // $scope.wizard.tagSetup.openingMechanism);

      $scope.wizard.tagSetup.p3.includeSource = ($scope.wizard.tagSetup.selectedSetupType
          .toLowerCase() === 'window') ? 'app/views/window-type.html' :
        'app/views/door-type.html';

      $scope.wizard.canExitWizard = false;
      $scope.wizard.showExitButton = false;
      $scope.wizard.enablePreviousButton();
      // $log.debug("[tag-setup-p3-controller] SELECTED MECHANISM: " +

      $scope.wizard.tagSetup.p3.openingMechanisms = $scope.wizard.wizardModel.tagSetup.getOpeningMechanisms($scope.wizard.tagSetup.selectedSetupType);

      for (var m in $scope.wizard.tagSetup.p3.openingMechanisms) {
        $scope.wizard.tagSetup.p3.openingMechanisms[m].checked = false;
      }
      // $scope.wizard.tagSetup.hasScreen |= false;
      // $scope.wizard.tagSetup.hasBlinds |= false;
      // $scope.wizard.tagSetup.horizontalBlinds |= false;

      // if ($scope.wizard.tagSetup.openingMechanism === null) {
        $scope.wizard.disableNextButton();
      // }
    })();
  }
})();
