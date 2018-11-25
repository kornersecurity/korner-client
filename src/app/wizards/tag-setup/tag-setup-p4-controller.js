(function() {
  'use strict';
  angular.module('app.wizard.tag')
  .controller('tagSetupControllerPage4', tagSetupControllerPage4);

  /* @ngInject */
  function tagSetupControllerPage4(
    $rootScope,
    $scope,
    $state,
    TagSetupService,
    FobService2,
    $window,
    $log,
    wizardType
  ) {
    var eventHandlerRemovers = [];

    $scope.$on('$destroy', destroyController);


    function destroyController(){
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[tagSetupControllerPage4] DESTROYING');
    }

    $scope.wizard.tagSetup.p4 = {};
    $scope.wizard.tagSetup.p4.includeSource = ($scope.wizard.tagSetup.selectedSetupType
        .toLowerCase() === 'window') ? 'app/views/window-steps.html' :
      'app/views/door-steps.html';

    $scope.wizard.pageCode = '403';

    if(FobService2.fob.isFirmwareUpdating() === false &&
       FobService2.fob.isDisarmed() === true) {
         TagSetupService.startActivation();
    }



    // add by dan to handle closing the wizard
    function onCloseWizard() {
      TagSetupService.stopActivation();

      TagSetupService.reset();

      setTimeout(function() {
        FobService2.tagSetupCancel();
      }, 1000);
    }

    $scope.$on('wizardEvent::closeWizard', onCloseWizard);
    $window.onbeforeunload = $scope.wizard.tagSetup.stopTagSetup;
    eventHandlerRemovers.push($rootScope.$on('AppEvent:Restart', $scope.wizard.tagSetup.stopTagSetup));
    if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
      eventHandlerRemovers.push($rootScope.$on('AppEvent:Pause', TagSetupService.stopActivation));
    } else {
      eventHandlerRemovers.push($rootScope.$on('AppEvent:Pause', $scope.wizard.tagSetup.stopTagSetup));
    }

  }
})();
