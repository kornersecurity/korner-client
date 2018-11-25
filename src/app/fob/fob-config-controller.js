(function() {
  'use strict';

  angular.module('app.fob.setup')
    .controller('fobConfigurationController', fobConfigurationController);


  /* @ngInject */
  function fobConfigurationController(
    $rootScope,
    $scope,
    $state,
    $ionicActionSheet,
    contentFobSetup,
    contentProfile,
    pictureService,
    ProfileService,
    uiLoadingService,
    $log,
    FobService2
  ) {
    if(window.cordova && cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.close();
    }

    var eventHandlerRemovers = [];

    $scope.fobConfiguration.updateFobConfiguration = function(callback) {
      uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "kornerFobConfiguration");
      $scope.fobConfiguration.selectedFob.arm_delay         = parseInt($scope.fobConfiguration.editableFob.arm_delay);
      $scope.fobConfiguration.selectedFob.doorchime_enabled = $scope.fobConfiguration.editableFob.doorchime_enabled;
      $scope.fobConfiguration.selectedFob.buzzer_enabled    = $scope.fobConfiguration.editableFob.buzzer_enabled;

      $scope.fobConfiguration.selectedFob.updateFobSettings().then(
        function(res) {
          // everything was save
          uiLoadingService.showHideDelay(
            contentFobSetup.LOCATION_UPDATED_SUCCESSFUL, "kornerFobConfiguration", true, 1500,
            function() {
              $scope.fobConfiguration.fobSettingsChanged = false;
              if(callback) {
                callback();
              }
            }
          );
        },
        function(err) {
          uiLoadingService.showHideDelay(contentFobSetup.LOCATION_UPDATED_FAILED, "kornerFobConfiguration", false);
        }
      );
    };

    $scope.fobConfiguration.cancelFobSettingChanges = function(){
      $scope.fobConfiguration.editableFob = angular.copy(FobService2.fob);
      $scope.fobConfiguration.fobSettingsChanged = false;
    };

    $scope.fobConfiguration.checkFobSettings = function() {
      $log.debug('[fob-setup-p2-controller] FOB SETTINGS CHANGED');
      if(parseInt($scope.fobConfiguration.editableFob.arm_delay) !== $scope.fobConfiguration.selectedFob.arm_delay ||
         $scope.fobConfiguration.editableFob.doorchime_enabled !== $scope.fobConfiguration.selectedFob.doorchime_enabled ||
         $scope.fobConfiguration.editableFob.buzzer_enabled !== $scope.fobConfiguration.selectedFob.buzzer_enabled){

        $scope.fobConfiguration.fobSettingsChanged = true;
      }

      $log.debug('[fob-setup-p2-controller] FOB BUZZER ENABLED: '+$scope.fobConfiguration.editableFob.buzzer_enabled);
      if($scope.fobConfiguration.editableFob.buzzer_enabled === 0){
        $scope.fobConfiguration.editableFob.doorchime_enabled = 0;
      }
      $log.debug('[fob-setup-p2-controller] FOB DOORCHIME ENABLED: '+$scope.fobConfiguration.editableFob.doorchime_enabled);

    };


    function destroyController() {
      // $log.debug('[fobConfigurationController] P2 CONTROLLER DESTROYED');
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[fobConfigurationController] DESTROYING');
    }


    (function() {
      $scope.fobConfiguration.editableFob = angular.copy(FobService2.fob);

      $log.debug('[fob-setup-controller] LOADING FOB ADDRESS FOR FOB: ' +
        $scope.fobConfiguration.editableFob.fob_id);

      $scope.fobConfiguration.fobSettingsChanged = false;

      $scope.$on('$destroy', destroyController);
    })();


  }
})();
