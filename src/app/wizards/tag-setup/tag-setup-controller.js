(function() {
  'use strict';
  angular.module('app.wizard.fob')
    .controller('tagSetupController', tagSetupController);

  /* @ngInject */
  function tagSetupController(
    $scope,
    $state,
    FobService2,
    $log,
    wizardType,
    TagSetupService,
    contentTagSetup,
    lookupService
  ) {

    $scope.wizard.tagSetup = {};
    $scope.wizard.tagSetup.tags = [];

    $scope.wizard.tagSetup.nextPage = function() {
      // $log.debug('[fob-setup-controller] SHOW NEXT PAGE');

      if ($scope.wizard.wizardManagerData.currentWizard.currentPage < 9) {
        $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
        $scope.wizard.changeState();
      }
    };


    $scope.wizard.tagSetup.previousPage = function() {
      // $log.debug('[fob-setup-controller] SHOW PREVIOUS PAGE');

      if ($scope.wizard.wizardManagerData.currentWizard.currentPage > 1) {
        $scope.wizard.wizardManagerData.decreaseCurrentWizardPage();
        $scope.wizard.changeState();
      }
    };

    $scope.wizard.tagSetup.resetNewTagProps = function() {
      for (var t in $scope.wizard.tagSetup.setupTypes) {
        $scope.wizard.tagSetup.setupTypes[t].checked = false;
      }
      $scope.wizard.tagSetup.selectedSetupType = null;
      $scope.wizard.tagSetup.portalTypeId = null;

      $scope.wizard.tagSetup.openingMechanism = null;
      $scope.wizard.tagSetup.hasScreen = false;
      $scope.wizard.tagSetup.hasBlinds = false;
      $scope.wizard.tagSetup.horizontalBlinds = false;
      $scope.wizard.tagSetup.noCharacteristics = true;
    };


    $scope.wizard.tagSetup.stopTagSetup = function(closeWizard) {
     TagSetupService.stopActivation();
     FobService2.tagSetupCancel();
     $log.debug('[tagSetupController] CLOSING WINDOW');
     if(closeWizard) {
       $scope.wizard.wizardClose();
     }
    };

    (function() {

      var tagsCount = FobService2.fob.tags.getCount();

      if (tagsCount === 0) {
        $scope.wizard.tagSetup.tags = [];
        $scope.wizard.tagSetup.canGoBack = false;
          $scope.wizard.tagSetup.nextPage();
        if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
          $scope.wizard.canExitWizard = false;
          $scope.wizard.showExitButton = false;
        } else {
          $scope.wizard.canExitWizard = true;
          $scope.wizard.showExitButton = true;
        }
      } else {
        $scope.wizard.tagSetup.tags = FobService2.fob.tags.getTagsArray();
        $scope.wizard.tagSetup.canGoBack = true;
      }

      $scope.$on('wizardEvent::showNextPage', $scope.wizard.tagSetup.nextPage);
      $scope.$on('wizardEvent::showPreviousPage', $scope.wizard.tagSetup.previousPage);
      $scope.$on('$destroy', TagSetupService.reset);

      TagSetupService.init($scope.wizard.wizardModel);

      $scope.wizard.tagSetup.setupTypes = [{
        type: 'Window',
        title: contentTagSetup.SETUP_TYPE_WINDOW,
        desc: contentTagSetup.SETUP_TYPE_WINDOW_DESC,
        checked: false,
        img_src: "app/img/wizard-tag-window-selection.png"
      }, {
        type: 'Door',
        title: contentTagSetup.SETUP_TYPE_DOOR,
        desc: contentTagSetup.SETUP_TYPE_DOOR_DESC,
        checked: false,
        img_src: "app/img/wizard-tag-door-selection.png"
      }];


      lookupService.getPortalTypeLookup (function(portalTypeMap) {
        for (var s in $scope.wizard.tagSetup.setupTypes) {
          for (var p in portalTypeMap) {
            if ($scope.wizard.tagSetup.setupTypes[s].type.toLowerCase() === portalTypeMap[p].toLowerCase()){
              $scope.wizard.tagSetup.setupTypes[s].id = p;
              $log.debug('[tagSetupControllerPage2] PORTAL: ', $scope.wizard.tagSetup.setupTypes[s].id, $scope.wizard.tagSetup.setupTypes[s].type);
            }
          }
        }
      });

    })();
  }
})();
