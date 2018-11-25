(function() {
  'use strict';

  angular.module('app.wizard.fob')
    .controller('fobSetupController.manualSetupQRCodeModalController',
    fobSetupControllerManualSetupQRCodeModalController);

  /* @ngInject */
  function fobSetupControllerManualSetupQRCodeModalController(
    $scope,
    $state,
    WizardModel,
    $cordovaBarcodeScanner,
    $log
  ) {
    (function() {
      $scope.wizard.pageCode = '202';
      $scope.wizard.fobSetup.ksMacAddress1 = $scope.wizard.wizardModel
        .fobSetup.ksMacAddress1; //This should come from config file
      $scope.wizard.fobSetup.ksMacAddress2 = $scope.wizard.wizardModel
        .fobSetup.ksMacAddress2; //This should come from config file
      $scope.wizard.fobSetup.macAddress = 'XX:XX:XX';
      $scope.wizard.fobSetup.fullMacAddress = $scope.wizard.fobSetup.ksMacAddress1 + $scope.wizard.fobSetup.macAddress +
        $scope.wizard.fobSetup.ksMacAddress2;
      $scope.wizard.fobSetup.validMacAddress = false;
      $scope.wizard.fobSetup.invalidScan = false;
    })();

    $scope.wizard.fobSetup.scanCode = function() {
      $scope.wizard.fobSetup.invalidScan = false;
      $log.debug('[manualSetupQRCodeModalController] SCANNING QR CODE');
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        // alert(imageData.text);
        $log.debug("Barcode Format -> " + imageData.format);
        $log.debug("Cancelled -> " + imageData.cancelled);
        $log.debug("CODE -> " + imageData.text);

        if (imageData.text !== undefined && imageData.text.split(':').length === 6) {
          if (imageData.text.split(':')[0] == '26') {
            $scope.wizard.fobSetup.validMacAddress = true;
            $scope.wizard.fobSetup.macAddress      = imageData.text;
            $scope.wizard.fobSetup.fullMacAddress  = $scope.wizard.fobSetup.ksMacAddress1+$scope.wizard.fobSetup.macAddress+$scope.wizard.fobSetup.ksMacAddress2;
          }
        } else {
          $scope.wizard.fobSetup.invalidScan = true;
        }
      }, function(error) {
        $log.debug("[manualSetupQRCodeModalController] BAR CODE SCAN ERROR: " + error);
      });
    };

    $scope.$on('$destroy', function() {
      $log.debug("[manualSetupQRCodeModalController] DESTROYED");
      if ($scope.modal2 !== undefined) {
        $scope.modal2.remove();
      }
    });

  }
})();
