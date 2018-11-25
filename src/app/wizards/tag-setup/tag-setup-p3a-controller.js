(function() {
  'use strict';
  angular.module('app.wizard.tag')
  .controller('tagSetupControllerPage3a', tagSetupControllerPage3a);

  /* @ngInject */
  function tagSetupControllerPage3a(
    $scope,
    $state,
    contentFobSetup,
    $log
  ) {
    $scope.wizard.tagSetup.p3a = {};

    $scope.wizard.tagSetup.p3a.characteristicsChanged = function() {
      // $log.debug("[tag-setup-p3-controller] HAS BLINDS: " + $scope.wizard.tagSetup.hasBlinds);
      // $log.debug("[tag-setup-p3-controller] HAS SCREEN: " + $scope.wizard.tagSetup.hasScreen);

      $scope.wizard.enableNextButton();
    };
    $scope.wizard.tagSetup.p3a.toggleHasBlinds = function() {
      $scope.wizard.tagSetup.hasBlinds = $scope.wizard.tagSetup.hasBlindsChecked;
      // $log.debug("[tag-setup-p3-controller] HAS BLINDS: " + $scope.wizard.tagSetup.hasBlinds);
      $scope.wizard.enableNextButton();
    };

    $scope.wizard.tagSetup.p3a.toggleHasScreen = function() {
      $scope.wizard.tagSetup.hasScreen = $scope.wizard.tagSetup.hasScreenChecked;
      // $log.debug("[tag-setup-p3-controller] HAS SCREEN: " + $scope.wizard.tagSetup.hasScreen);
      $scope.wizard.enableNextButton();
    };

    $scope.wizard.tagSetup.p3a.noPortalCharacteristics = function() {
      $scope.wizard.tagSetup.hasScreen = false;
      $scope.wizard.tagSetup.hasBlinds = false;
      $scope.wizard.tagSetup.noCharacteristics = true;

      $scope.wizard.enableNextButton();
      $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
      $scope.wizard.changeState();
    };

    (function() {

      $scope.wizard.pageCode = '402a';
      // $log.debug("[tag-setup-p3-controller] SELECTED MECHANISM: " +
      // $scope.wizard.tagSetup.openingMechanism);

      $scope.wizard.tagSetup.p3a.includeSource = ($scope.wizard.tagSetup.selectedSetupType
          .toLowerCase() === 'window') ? 'app/views/window-characteristics.html' :
        'app/views/door-characteristics.html';

      $scope.wizard.disableNextButton();
      $scope.wizard.tagSetup.hasScreen = false;
      $scope.wizard.tagSetup.hasBlinds = false;
      $scope.wizard.tagSetup.noCharacteristics = false;
    })();
  }
})();
