(function() {
  'use strict';

  angular.module('app.fob.setup')
    .controller('fobProfileController', fobProfileController);


  /* @ngInject */
  function fobProfileController(
    $rootScope,
    $scope,
    $state,
    ProfileService,
    uiLoadingService,
    $mdDialog,
    FobCollection,
    $log,
    FobService2,
    $ionicPopup,
    contentFobSetup,
    contentTagSetup
  ) {

    $scope.fobConfiguration = {};


    $scope.fobConfiguration.closeModal = function() {
      $log.debug('[fobProfileController] CLOSING MODAL');

      if(window.cordova && cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.close();
      }

      $log.debug('[fobProfileController] SCHEDULE CHANGED: '+$scope.fobConfiguration.selectedScheduleChanged);
      $log.debug('[fobProfileController] PROFILE CHANGED:  '+($scope.fobConfiguration.fobProfileChanged && $scope.fobConfiguration.profileValid));
      $log.debug('[fobProfileController] SETTINGS CHANGED: '+$scope.fobConfiguration.fobSettingsChanged);

      if($scope.fobConfiguration.selectedScheduleChanged){
        var confirmSchedulePopup = $ionicPopup.confirm({
          title: contentFobSetup.ALARM_SETUP_TITLE,
          template: contentFobSetup.SAVE_ALARM_MESSAGE,
          cancelText: contentTagSetup.NO,
          okText: contentTagSetup.YES
        });

        confirmSchedulePopup.then(function(res) {

          if (res) {
            uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "kornerFobConfiguration");
            $scope.fobConfiguration.saveSchedule(function(){
              $mdDialog.hide();
            });
          } else {
            $scope.fobConfiguration.cancelArmingScheduleChanges();
            $mdDialog.hide();
          }
        });
      } else if($scope.fobConfiguration.fobProfileChanged && $scope.fobConfiguration.profileValid){
        var confirmFobProfilePopup = $ionicPopup.confirm({
          title: contentFobSetup.ALARM_SETUP_TITLE,
          template: contentFobSetup.SAVE_ALARM_MESSAGE,
          cancelText: contentTagSetup.NO,
          okText: contentTagSetup.YES
        });

        confirmFobProfilePopup.then(function(res) {

          if (res) {
            uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "kornerFobConfiguration");
            $scope.fobConfiguration.saveProfile(function(){
              $mdDialog.hide();
            });
          } else {
            $scope.fobConfiguration.cancelProfileChanges();
            $mdDialog.hide();
          }
        });
      } else if($scope.fobConfiguration.fobSettingsChanged){
        var confirmFobSettingsPopup = $ionicPopup.confirm({
          title: contentFobSetup.ALARM_SETUP_TITLE,
          template: contentFobSetup.SAVE_ALARM_MESSAGE,
          cancelText: contentTagSetup.NO,
          okText: contentTagSetup.YES
        });

        confirmFobSettingsPopup.then(function(res) {

          if (res) {
            uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "kornerFobConfiguration");
            $scope.fobConfiguration.updateFobConfiguration(function(){
              $mdDialog.hide();
            });
          } else {
            $scope.fobConfiguration.cancelFobSettingChanges();
            $mdDialog.hide();
          }
        });
      } else {
        $mdDialog.hide();
      }
      // $rootScope.profileModal.hide();
    };

    function destroyController() {
      $scope.fobConfiguration= null;
      $log.debug('[fobProfileController] CONTROLLER DESTROYED');
    }

    (function() {

      $scope.fobConfiguration.selectedFob = FobService2.fob;//angular.copy(FobService2.fob);
      $scope.fobConfiguration.fobSetupInitialzed = false;

      $log.debug('[fobProfileController] SELECTED FOB: ', $scope.fobConfiguration.selectedFob);

      $scope.$on('$destroy', destroyController);

      $scope.selectedIndex = 0;
      $scope.isSavingChanges = false;

      $scope.$watch('selectedIndex', function(current, old){
        if(old === 0 && $scope.fobConfiguration.fobSettingsChanged && !$scope.isSavingChanges){
          $scope.selectedIndex = 0;
          var confirmSettingsPopup = $ionicPopup.confirm({
            title: contentFobSetup.ALARM_SETUP_TITLE,
            template: contentFobSetup.SAVE_ALARM_MESSAGE,
            cancelText: contentTagSetup.NO,
            okText: contentTagSetup.YES
          });

          confirmSettingsPopup.then(function(res) {

            if (res) {
              uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "kornerFobConfiguration");
              $scope.fobConfiguration.updateFobConfiguration(function(){
                $scope.selectedIndex = current;
              });
              $scope.isSavingChanges = true;
            } else {
              $scope.fobConfiguration.cancelFobSettingChanges();
              $scope.selectedIndex = current;
            }
          });
        } else if(old === 0 && $scope.fobConfiguration.fobSettingsChanged && $scope.isSavingChanges){
          $scope.isSavingChanges = false;
        }

        if(old === 1 && $scope.fobConfiguration.fobProfileChanged && $scope.fobConfiguration.profileValid && !$scope.isSavingChanges){
          $scope.selectedIndex = 1;
          var confirmProfilePopup = $ionicPopup.confirm({
            title: contentFobSetup.ALARM_SETUP_TITLE,
            template: contentFobSetup.SAVE_ALARM_MESSAGE,
            cancelText: contentTagSetup.NO,
            okText: contentTagSetup.YES
          });

          confirmProfilePopup.then(function(res) {

            if (res) {
              uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "kornerFobConfiguration");
              $scope.fobConfiguration.saveProfile(function(){
                $scope.selectedIndex = current;
              });
              $scope.isSavingChanges = true;
            } else {
              $scope.fobConfiguration.cancelProfileChanges();
              $scope.selectedIndex = current;
            }
          });
        } else if(old === 1 && $scope.fobConfiguration.fobProfileChanged && $scope.isSavingChanges){
          $scope.isSavingChanges = false;
        }

        if(old === 2 && $scope.fobConfiguration.selectedScheduleChanged && !$scope.isSavingChanges){
          $scope.selectedIndex = 2;
          var confirmSchedulePopup = $ionicPopup.confirm({
            title: contentFobSetup.ALARM_SETUP_TITLE,
            template: contentFobSetup.SAVE_ALARM_MESSAGE,
            cancelText: contentTagSetup.NO,
            okText: contentTagSetup.YES
          });

          confirmSchedulePopup.then(function(res) {

            if (res) {
              uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "kornerFobConfiguration");
              $scope.fobConfiguration.saveSchedule(function(){
                $scope.selectedIndex = current;
              });
              $scope.isSavingChanges = true;
            } else {
              $scope.fobConfiguration.cancelArmingScheduleChanges();
              $scope.selectedIndex = current;
            }
          });
        } else if(old === 2 && $scope.fobConfiguration.selectedScheduleChanged && $scope.isSavingChanges){
          $scope.isSavingChanges = false;
        }
        $log.debug('[fobProfileController] SELECTED INDEX: ' + current, old);
      });
    })();
  }
})();
