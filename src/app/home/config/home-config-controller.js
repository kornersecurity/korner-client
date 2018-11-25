(function() {
  'use strict';

  angular.module('app.home')
    .controller('homeConfigController', homeConfigController);

  /* @ngInject */
  function homeConfigController(
    $scope,
    FobService2,
    wizardType,
    $mdDialog,
    $mdSidenav,
    $mdMedia,
    $log,
    $state,
    requiredFirmwareConst,
    $ionicPopup,
    contentExtenderSetup
  ) {
    $scope.fob = FobService2.fob;

    // Forces home image reload
    FobService2.fob._generateImageUrl();

    $scope.wizardType = wizardType;

    $scope.config = {};
    $scope.home.showChatMessageButton = false;

    $log.debug('[homeConfigController] INITIALIZED');


    $scope.showFobProfile = function() {
      $mdDialog.show({
        templateUrl:'app/views/fob-profile.html',
        controller: 'fobProfileController'
      });
      if($mdMedia('sm') || $mdMedia('md')) {
        $mdSidenav('left').close();
      }
    };

    $scope.config.checkFirmware = function() {

      if(FobService2.fob.canAddExtender() === false){
        var continuePopUp = $ionicPopup.alert({
          title: contentExtenderSetup.FIRMWARE_UPDATE_REQUIRED_TITLE,
          template: contentExtenderSetup.FIRMWARE_UPDATE_REQUIRED_DESC
        });
      } else {
        $scope.showSetupScreen({wizardType:wizardType.EXTENDER_SETUP});
      }
      // continuePopUp.then(function(res) {
      //   startWizard();
      // });
    };
  }

})();
