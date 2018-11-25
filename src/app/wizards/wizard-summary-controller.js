(function() {
  'use strict';
  angular.module('app.wizard')
  .controller('wizardSummaryController', wizardSummaryController);

  /* @ngInject */
  function wizardSummaryController(
    $scope,
    $state,
    $stateParams,
    wizardType,
    $ionicScrollDelegate,
    $ionicPopup,
    contentCircleSetup,
    $log
  ) {
    $scope.$on('$destroy', function()
    {
      $log.debug("[wizard-summary-controller] DESTROYED");
      if ($scope.modal !== undefined)
      {
        $scope.modal.remove();
      }
    });

    function onDoneClicked() {
      $log.debug("[wizard-summary-controller] DONE CLICKED");
      if($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME &&
         $scope.wizard.wizardManagerData.allWizardsCompleted === true)
      {
        $scope.wizard.wizardClose(true);
      }
    }
    (function(){
      $scope.wizard.pageCode = '101';

      $scope.wizardType = wizardType;

      $scope.$on('wizardEvent::doneClicked', onDoneClicked);
    })();
  }
})();
