(function() {
  'use strict';
  angular.module('app.wizard.tag')
  .controller('tagSetupControllerPage5', tagSetupControllerPage5);

  /* @ngInject */
  function tagSetupControllerPage5(
    $rootScope,
    $scope,
    $state,
    FobService2,
    $window,
    TagSetupService,
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

      $log.debug('[tagSetupControllerPage5] DESTROYING');
    }

    $scope.wizard.tagSetup.p5 = {};
    $scope.wizard.tagSetup.p5.includeSource = ($scope.wizard.tagSetup.selectedSetupType
        .toLowerCase() === 'window') ? 'app/views/window-step1.html' :
      'app/views/door-step1.html';

    $scope.wizard.pageCode = '404';

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
      eventHandlerRemovers.push($rootScope.$on('AppEvent:Pause', function(){
        TagSetupService.stopActivation();
      }));
    } else {
      eventHandlerRemovers.push($rootScope.$on('AppEvent:Pause', $scope.wizard.tagSetup.stopTagSetup));
    }
  }
})();
