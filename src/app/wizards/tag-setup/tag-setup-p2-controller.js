(function() {
  'use strict';
  angular.module('app.wizard.tag')
  .controller('tagSetupControllerPage2', tagSetupControllerPage2);

  /* @ngInject */
  function tagSetupControllerPage2(
    $scope,
    $state,
    $log
  ) {
    // $log.debug('[fobSetupControllerPage2] P2 CONTROLLER');

    $scope.wizard.tagSetup.setupTypeChanged = function(setupType) {
      $log.debug("[tag-setup-p2-controller] SELECTED SETUP TYPE: " + setupType
        .type);
      var selectedSetupType = setupType.type;
      var selectedSetupChecked = setupType.checked;

      for (var t in $scope.wizard.tagSetup.setupTypes) {
        $scope.wizard.tagSetup.setupTypes[t].checked = false;
      }

      setupType.checked = selectedSetupChecked;

      $log.debug("[tag-setup-p2-controller] SELECTED SETUP CHECKED: " +
        selectedSetupChecked, setupType.id);

      if (selectedSetupChecked) {
        $scope.wizard.enableNextButton();
        $scope.wizard.tagSetup.selectedSetupType = selectedSetupType;
        $scope.wizard.tagSetup.portalTypeId = setupType.id;

        $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
        $scope.wizard.changeState();
      } else {
        $scope.wizard.disableNextButton();
      }
    };

    (function(){
      $scope.wizard.pageCode = '401';
      $scope.wizard.disableNextButton();



      if ($scope.wizard.tagSetup.canGoBack === false) {
        $scope.wizard.disablePreviousButton();
      }

      $scope.wizard.showExitButton = false;

    })();
  }
})();
