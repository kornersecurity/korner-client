(function() {
  'use strict';

  angular.module('app.wizard.extender')
    .controller('extenderSetupControllerPage1', extenderSetupControllerPage1);

  /* @ngInject */
  function extenderSetupControllerPage1(
    $scope,
    $state,
    WizardModel,
    FobService2,
    $ionicModal,
    $ionicPopup,
    $ionicListDelegate,
    contentExtenderSetup,
    wizardType,
    uiLoadingService,
    $log,
    requiredFirmwareConst
  ) {
    // $log.debug('P1 CONTROLLER');
    $scope.wizard.extenderSetup.p1 = {};

    $scope.wizard.extenderSetup.p1.deactivateExtender = function(extender) {
      $log.debug('$deactivateExtender()');

      var confirmRemovePopup = $ionicPopup.confirm({
        title: contentExtenderSetup.REMOVE_EXTENDER_TITLE,
        template: contentExtenderSetup.REMOVE_EXTENDER_QUESTION,
        cancelText: contentExtenderSetup.NO,
        okText: contentExtenderSetup.YES
      });

      confirmRemovePopup.then(function(res) {

        if (res) {
          uiLoadingService.show(contentExtenderSetup.REMOVING_EXTENDER, "wizardToast");
          extender.deactivate().then(
          // extenderService.deactivateExtender(extender.fob_id, extender.extender_id,
            function(theExtender) {
              $log.debug('[extenderSetupControllerPage1] EXTENDER REMOVED SUCCESSFULLY');
              uiLoadingService.showHideDelay(contentExtenderSetup.EXTENDER_REMOVED_SUCCESS, "wizardToast", true);
            },
            function(error) {
              $log.debug('[extenderSetupControllerPage1] TAG REMOVE ERROR: ' +
                error);
              uiLoadingService.showHideDelay(contentExtenderSetup.EXTENDER_REMOVED_FAIL, "wizardToast", false);
            }
          );
        }
      });
    };

    $scope.wizard.extenderSetup.p1.getHtmlSource = function() {
      if ($scope.wizard.extenderSetup.p1.showChoice === true) {
        $log.debug('[extender-setup-p1-controller] SHOWING CHOICE');
        return 'app/views/add-extender-choice.html';
      } else {
        $log.debug('[extender-setup-p1-controller] SHOWING EXTENDER LIST');
        return 'app/views/extenders-list.html';
      }
    };

    $scope.wizard.extenderSetup.closeModal = function() {
      $log.debug('$closeModal()');
      $scope.modal.hide();
      $scope.wizard.extenderSetup.selectedExtender = null;

      $log.debug("[extender-setup-p1-controller] CLOSE EDIT TAG NAME MODAL");

    };

    $scope.wizard.extenderSetup.p1.editExtender = function(extender) {
      $scope.wizard.extenderSetup.selectedExtender = extender;
      $ionicListDelegate.closeOptionButtons();
      $ionicModal.fromTemplateUrl('app/views/edit-extender-name.html', {
          scope: $scope,
          animation: 'slide-in-up',
        })
        .then(function(modal) {
          $scope.modal = modal;
          modal.show();

          $log.debug("SHOWING EDIT TAG NAME POPUP");

        });
    };

    function showReqFirmwareForExtenderSetupPopup() {
      var continuePopUp = $ionicPopup.alert({
        title: contentExtenderSetup.FIRMWARE_UPDATE_REQUIRED_TITLE,
        template: contentExtenderSetup.FIRMWARE_UPDATE_REQUIRED_DESC
      });

      continuePopUp.then(function(res) {
        $scope.wizard.wizardManagerData.setWizardCompleted(
          $scope.wizard.wizardManagerData.currentWizard.type, true);

        $scope.wizard.skipWizard();
      });
    }

    $scope.wizard.extenderSetup.startExtenderSetup = function() {
      $scope.wizard.extenderSetup.nextPage();

      if(FobService2.fob.canAddExtender() === false){
        showReqFirmwareForExtenderSetupPopup();
      }

    };

    $scope.wizard.extenderSetup.skipExtenderSetup = function() {
      $scope.wizard.wizardManagerData.setWizardCompleted(
        $scope.wizard.wizardManagerData.currentWizard.type, true);

      $scope.wizard.skipWizard();
    };

    function init(){
      $scope.wizard.disableNextButton();

      $scope.wizard.extenderSetup.p1.showChoice = false;
      if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME &&
          FobService2.fob.extenders.getCount() === 0) {

          $scope.wizard.extenderSetup.p1.showChoice = true;
          $scope.wizard.pageCode = '310';

      } else {
        $scope.wizard.canExitWizard = true;
        $scope.wizard.pageCode = '300';
      }
    }

    (function() {
      $log.debug('[extenderSetupControllerPage1] INSTANTIATED');
      // $scope.wizard.extenderSetup.extenders =
      $scope.wizard.extenderSetup.extender = null;
      init();

    })();
  }
})();
