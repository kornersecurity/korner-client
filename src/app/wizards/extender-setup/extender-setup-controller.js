(function() {
  'use strict';

  angular.module('app.wizard.extender')
    .controller('extenderSetupController', extenderSetupController);

  /* @ngInject */
  function extenderSetupController(
    $scope,
    $state,
    FobService2,
    $timeout,
    wizardType,
    $log,
    ExtenderSetupService,
    lookupService,
    contentTagSetup
  ) {

    $scope.wizard.extenderSetup = {};

    $scope.wizard.extenderSetup.nextPage = function() {
      $log.debug('[extender-setup-controller] SHOW NEXT PAGE');

      if ($scope.wizard.wizardManagerData.currentWizard.currentPage < 4) {
        $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
        $scope.wizard.changeState();
      }
    };


    $scope.wizard.extenderSetup.previousPage = function() {
      // $log.debug('[extender-setup-controller] SHOW PREVIOUS PAGE');

      if ($scope.wizard.wizardManagerData.currentWizard.currentPage > 1) {
        $scope.wizard.wizardManagerData.decreaseCurrentWizardPage();
        $scope.wizard.changeState();
      }
    };

    $scope.toggleHelp = function() {
      $scope.$broadcast('toggleHelp');
    };

    $scope.getScrollHeight = function(height) {
      var scrollHeight = window.innerHeight - height;
      return scrollHeight + 'px';
    };

    $scope.wizard.extenderSetup.closeWizard = function(templateName) {
      $log.debug('[extender-setup-controller] CLOSING WIZARD');
      $scope.wizard.extenderSetup.searchingExtender = false;
      $timeout.cancel($scope.wizard.extenderSetup.findExtenderTimer);
    };

    $scope.wizard.extenderSetup.resetNewExtenderProps = function() {
      $scope.wizard.extenderSetup.extender = null;
    };

    $scope.wizard.extenderSetup.stopExtenderSetup = function(closeWizard) {
     ExtenderSetupService.stopActivation();
     FobService2.extenderSetupCancel();
     $log.debug('[extenderSetupController] CLOSING WINDOW');
     if(closeWizard) {
       $scope.wizard.wizardClose();
     }
    };



    $scope.wizard.extenderSetup.setupTypes = [{
      type: 'Window',
      title: contentTagSetup.SETUP_TYPE_WINDOW,
      desc: contentTagSetup.SETUP_TYPE_WINDOW_DESC,
      checked: false,
      img_src: "app/img/wizard-tag-window-selection.png"
    }, {
      type: 'Door',
      title: contentTagSetup.SETUP_TYPE_DOOR,
      desc: contentTagSetup.SETUP_TYPE_DOOR_DESC,
      checked: false,
      img_src: "app/img/wizard-tag-door-selection.png"
    }];

    lookupService.getPortalTypeLookup (function(portalTypeMap) {
      for (var s in $scope.wizard.extenderSetup.setupTypes) {
        for (var p in portalTypeMap) {
          if ($scope.wizard.extenderSetup.setupTypes[s].type.toLowerCase() === portalTypeMap[p].toLowerCase()){
            $scope.wizard.extenderSetup.setupTypes[s].type_id = p;
            $log.debug('[extenderSetupControllerPage3] PORTAL: ', $scope.wizard.extenderSetup.setupTypes[s].type_id, $scope.wizard.extenderSetup.setupTypes[s].type);
          }
        }
      }
    });



    (function() {
      $log.debug('[extenderSetupController] INSTANTIATED');

      // $log.debug('[extenderSetupController] EXTENDERS: '+FobService2.fob.extenders.extenders);
      $log.debug('[extenderSetupController] EXTENDERS: '+FobService2.fob.extenders.getCount());
      $scope.wizard.extenderSetup.extenderCount = FobService2.fob.extenders.getCount();

      if ($scope.wizard.extenderSetup.extenderCount === 0) {
        $scope.wizard.extenderSetup.extenders = {};
        $scope.wizard.extenderSetup.extenderKeys = [];
        $scope.wizard.extenderSetup.canGoBack = false;
        if ($scope.wizard.wizardManagerData.wizardType !== wizardType.WELCOME) {
          $scope.wizard.extenderSetup.nextPage();
          $scope.wizard.canExitWizard = true;
          $scope.wizard.showExitButton = true;
        }
      } else {
        $scope.wizard.extenderSetup.extenders = FobService2.fob.extenders.extenders;
        // This is done to make ngRepeat work (ngRepeat does not work on maps)
        $scope.wizard.extenderSetup.extenderKeys = FobService2.fob.extenders.getExtenderKeys();
        $log.debug('[extenderSetupController] EXTENDERS: '+$scope.wizard.extenderSetup.extenders);
        // $log.debug('[extenderSetupController] EXTENDERS: '+$scope.wizard.extenderSetup.extenders.getCount());
        $scope.wizard.extenderSetup.canGoBack = true;
      }

      ExtenderSetupService.init($scope.wizard.wizardModel);

      $scope.$on('wizardEvent::closeWizard', $scope.wizard.extenderSetup.closeWizard);
      $scope.$on(
        'wizardEvent::showNextPage', $scope.wizard.extenderSetup.nextPage);
      $scope.$on(
        'wizardEvent::showPreviousPage', $scope.wizard.extenderSetup.previousPage);

    })();
  }
})();
