(function() {
  'use strict';

  angular.module('app.wizard.fob')
    .controller('fobSetupController.manualSetupChoiceModalController',
    fobSetupControllerManualSetupChoiceModalController);

  /* @ngInject */
  function fobSetupControllerManualSetupChoiceModalController(
    $scope,
    $state,
    WizardModel,
    $ionicModal,
    uiLoadingService,
    contentFobSetup,
    FobCollection,
    $log
  ) {
    $scope.wizard.pageCode = '201';
    $scope.wizard.fobSetup.ksMacAddress = $scope.wizard.wizardModel
      .fobSetup.ksMacAddress; //This should come from config file

    $scope.wizard.fobSetup.showMacAddressSetup = function() {
      $log.debug("[fobSetupControllerPage1] SHOWING MAC ADDRESS FOB SETUP POPUP");

      $ionicModal.fromTemplateUrl('app/views/manual-setup-macaddress.html', {
          scope: $scope,
        })
        .then(function(modal) {
          $scope.modal2 = modal;
          modal.show();
        });
    };

    $scope.wizard.fobSetup.showQRCodeSetup = function() {
      $log.debug("[fobSetupControllerPage1] SHOWING QR CODE FOB SETUP POPUP");

      $ionicModal.fromTemplateUrl('app/views/manual-setup-qrcode.html', {
          scope: $scope,
        })
        .then(function(modal) {
          $scope.modal2 = modal;
          modal.show();
        });
    };

    $scope.wizard.fobSetup.findFobfobByMacAddress = function() {
      uiLoadingService.show(contentFobSetup.REGISTERING_FOB, "wizardToast");

      FobCollection.findUnregisteredFobByEUI64($scope.wizard.fobSetup.fullMacAddress)
        .then(function(fob) {
          $scope.wizard.fobSetup.setFobFound(fob);
          uiLoadingService.hide();
          $scope.wizard.fobSetup.closeModal2();
          $scope.wizard.fobSetup.closeModal();
        }, function() {
          uiLoadingService.showHideDelay(contentFobSetup.FOB_SEARCH_FAILED, "wizardToast", false, 5000);
        });

    };

    $scope.wizard.fobSetup.closeModal2 = function() {
      $log.debug('$closeModal2()');
      $scope.modal2.hide();

      $log.debug("[manualSetupChoiceModalController] FOB MANUAL SETUP CHOICE CLOSED");

    };

    $scope.$on('$destroy', function() {
      $log.debug("[manualSetupChoiceModalController] DESTROYED");
      if ($scope.modal !== undefined) {
        $scope.modal.remove();
      }
    });
  }
})();
