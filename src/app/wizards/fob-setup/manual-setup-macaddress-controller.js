(function() {
  'use strict';

  angular.module('app.wizard.fob')
    .controller('fobSetupController.manualSetupMacAddressModalController',
    fobSetupControllerManualSetupMacAddressModalController);

  /* @ngInject */
  function fobSetupControllerManualSetupMacAddressModalController(
    $scope,
    $state,
    WizardModel,
    $log,
    uiLoadingService,
    FobCollection,
    contentFobSetup
  ) {
    // $log.debug('[fobSetupController.manualSetupMacAddressModalController] INSTANTIATED');
    (function() {
      $scope.wizard.pageCode = '203';
      $scope.wizard.fobSetup.ksMacAddress1 = $scope.wizard.wizardModel
        .fobSetup.ksMacAddress1; //This should come from config file
      $scope.wizard.fobSetup.ksMacAddress2 = $scope.wizard.wizardModel
        .fobSetup.ksMacAddress2; //This should come from config file
      $scope.wizard.fobSetup.macAddress = 'XX:XX:XX'; //XX:XX:XX';
      $scope.wizard.fobSetup.fullMacAddress = $scope.wizard.fobSetup.ksMacAddress1 +
        $scope.wizard.fobSetup.macAddress + $scope.wizard.fobSetup.ksMacAddress2;
      $scope.wizard.fobSetup.validMacAddress = false;
    })();

    $scope.wizard.fobSetup.insertDigit = function(digit) {
      $scope.wizard.fobSetup.macAddress = $scope.wizard.fobSetup.macAddress.replace(
        'X', digit);
      $scope.wizard.fobSetup.fullMacAddress = $scope.wizard.fobSetup.ksMacAddress1 +
        $scope.wizard.fobSetup.macAddress + $scope.wizard.fobSetup.ksMacAddress2;

      checkStatus();
    };

    $scope.wizard.fobSetup.removeDigit = function() {
      $scope.wizard.fobSetup.macAddress.replace(/\d(\D*)$|[A-F](\D*)$/, 'X');
      $scope.wizard.fobSetup.fullMacAddress = $scope.wizard.fobSetup.ksMacAddress1 +
        $scope.wizard.fobSetup.macAddress + $scope.wizard.fobSetup.ksMacAddress2;
      // \d(\D*)$
      // [A-F](\D*)$

      for (var x = $scope.wizard.fobSetup.macAddress.length - 1; x >= 0; x--) {
        if ($scope.wizard.fobSetup.macAddress[x] === ':' || $scope.wizard.fobSetup
          .macAddress[x] === 'X') {
          continue;
        } else {
          $scope.wizard.fobSetup.macAddress = $scope.wizard.fobSetup.macAddress.substr(
            0, x) + 'X' + $scope.wizard.fobSetup.macAddress.substr(x + 1);
          break;
        }
      }

      checkStatus();

    };

    function checkStatus() {
      if ($scope.wizard.fobSetup.macAddress.indexOf('X') > -1) {
        $scope.wizard.fobSetup.validMacAddress = false;
      } else {
        $scope.wizard.fobSetup.validMacAddress = true;
      }

      $log.debug('MAC ADDRESS VALID: ' + $scope.wizard.fobSetup.validMacAddress);
    }

    function showAlertPopup(title, description) {
      $log.debug("[manualSetupMacAddressModalController] ALERT POPUP: " +
        title, description);
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: description
      });

      alertPopup.then(function(res) {
        // There is nothing to do...
      });
    }
    $scope.wizard.fobSetup.findFobfobByMacAddress = function() {
      uiLoadingService.show(contentFobSetup.REGISTERING_FOB, "wizardToast");

      FobCollection.findUnregisteredFobByEUI64($scope.wizard.fobSetup.fullMacAddress)
        .then(function(fob) {
          $scope.wizard.fobSetup.setFobFound(fob);
          uiLoadingService.hide();
          $scope.wizard.fobSetup.closeModal();
        }, function() {
          uiLoadingService.showHideDelay(contentFobSetup.FOB_SEARCH_FAILED, "wizardToast", false, 5000);
        });

    };

    $scope.$on('$destroy', function() {
      $log.debug("[manualSetupMacAddressModalController] DESTROYED");
      if ($scope.modal !== undefined) {
        $scope.modal.remove();
      }
    });

  }
})();
