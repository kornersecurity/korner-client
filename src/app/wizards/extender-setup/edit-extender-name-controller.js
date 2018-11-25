(function() {
  'use strict';
  angular.module('app.wizard.extender')
  .controller('editExtenderNameModalController', editExtenderNameModalController);

  /* @ngInject */
  function editExtenderNameModalController(
    $scope,
    $state,
    FobService2,
    fobUserStatusConst,
    $ionicPopup,
    contentExtenderSetup,
    uiLoadingService,
    $log
  )
  {
    if(window.cordova && cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.close();
    }
    $scope.wizard.extenderSetup.editExtenderName = $scope.wizard.extenderSetup.selectedExtender.extender_name;

    $log.debug('[editExtenderNameModalController] EUI64:'+$scope.wizard.extenderSetup.selectedExtender.eui64);

    $scope.wizard.extenderSetup.updateExtenderName = function()
    {
      $log.debug('$editName()');
      if($scope.wizard.extenderSetup.editExtenderName === '') {
        showAlertPopup(contentExtenderSetup.BLANK_NAME_ALERT_TITLE, contentExtenderSetup.BLANK_NAME_ALERT_MESSAGE);
        return;
      }

      uiLoadingService.show(contentExtenderSetup.UPDATING_EXTENDER_NAME, "wizardToast");

      $scope.wizard.extenderSetup.selectedExtender.extender_name = $scope.wizard.extenderSetup.editExtenderName;
      $scope.wizard.extenderSetup.selectedExtender.store().then(
        function(theExtender) {
          uiLoadingService.showHideDelay(contentExtenderSetup.EXTENDER_NAME_UPDATE_SUCCESS, "wizardToast", true);
          $scope.wizard.extenderSetup.closeModal();

          $log.debug('[editExtenderNameModalController] EXTENDER NAME SUCCESSFULLY UPDATED');
        },
        function(error) {
          $log.debug('[editExtenderNameModalController] EXTENDER NAME UPDATE ERROR: ' +
            error);
          uiLoadingService.showHideDelay(contentExtenderSetup.EXTENDER_NAME_UPDATE_FAIL, "wizardToast", false);
          $scope.wizard.extenderSetup.closeModal();
        }
      );

    };


    function showAlertPopup(title, description)
    {
      $log.debug("[editExtenderNameModalController] ALERT POPUP: " + title, description);
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: description
      });

      alertPopup.then(function(res)
      {
        // There is nothing to do...
      });
    }

    $scope.$on('$destroy', function()
    {
      $log.debug('$destroy()');
      if ($scope.modal !== undefined)
      {
        $scope.modal.remove();
      }
    });

  }
})();
