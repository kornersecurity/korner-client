(function() {
  'use strict';

  angular.module('app.wizard.extender')
    .controller('extenderSetupControllerPage4', extenderSetupControllerPage4);

  /* @ngInject */
  function extenderSetupControllerPage4(
    $rootScope,
    $scope,
    $state,
    ExtenderSetupService,
    FobService2,
    contentExtenderSetup,
    $ionicPopup,
    $log,
    wizardType
  ) {
    $scope.wizard.extenderSetup.p4 = {};

    function showContinuePopUp() {

      // close out tag setup - added by dan.
      FobService2.extenderSetupComplete();

      $log.debug('[extender-setup-p84-controller] SHOWING CONTINUE POPUP');
      var continuePopUp = $ionicPopup.confirm({
        title: contentExtenderSetup.ADD_ANOTHER_TITLE,
        cancelText: contentExtenderSetup.ADD_ANOTHER_NO,
        okText: contentExtenderSetup.ADD_ANOTHER_YES
      });

      continuePopUp.then(function(res) {

        $scope.wizard.enablePreviousButton();
        $scope.wizard.extenderSetup.resetNewExtenderProps();
        ExtenderSetupService.reset();
        if (res) {
          $scope.wizard.wizardManagerData.setCurrentWizardPage(2);
          $scope.wizard.changeState();
        } else {
          $scope.wizard.goToNextPage();
          // $scope.wizard.wizardCompleted(false);
          // $log.debug('You are not sure');
        }
      });
    }


    function onDoneClicked() {
      ExtenderSetupService.reset();
      $scope.wizard.extenderSetup.resetNewExtenderProps();
      $scope.wizard.goToNextPage();
    }

    (function() {
      $scope.wizard.extenderSetup.hasTags = (FobService2.fob.tags.getCount() >  0 )? true : false;

      $scope.wizard.pageCode = '315';
      $scope.$on('wizardEvent::doneClicked', onDoneClicked);

      if($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
        showContinuePopUp();
      }

    })();
  }
})();
