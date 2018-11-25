(function() {
  'use strict';

  angular.module('app.wizard.fob')
    .controller('fobSetupControllerPage1', fobSetupControllerPage1);

  /* @ngInject */
  function fobSetupControllerPage1(
    $scope,
    $state,
    $timeout,
    WizardModel,
    $ionicModal,
    $ionicListDelegate,
    FobCollection,
    $log
  ) {
    $log.debug('[fobSetupControllerPage1] P1 CONTROLLER');
    $scope.wizard.fobSetup.fobSetupInitialzed = false;

    $scope.wizard.fobSetup.showManualSetup = function() {
      $log.debug("[fobSetupControllerPage1] SHOWING MANUAL FOB SETUP POPUP");
      stopSearch();

      $ionicModal.fromTemplateUrl('app/views/manual-setup-macaddress.html', {
          scope: $scope,
          animation: 'slide-in-up',
        })
        .then(function(modal) {
          $scope.modal = modal;
          modal.show();
        });
    };

    $scope.wizard.fobSetup.findUnregisteredFob = function() {
      $scope.wizard.fobSetup.currentRetryLoops++;
      $scope.wizard.fobSetup.searchingFob = true;
      $scope.wizard.fobSetup.findUnregisteredFobTimer = $timeout($scope.wizard.fobSetup.findUnregisteredFob,
        $scope.wizard.wizardModel.fobSetup.fobSearchRetryDelay);

      if ($scope.wizard.fobSetup.currentRetryTimes > $scope.wizard.fobSetup.fobSearchRetryTimes) {
        $scope.wizard.fobSetup.canRetry = false;
        stopSearch();
      } else if ($scope.wizard.fobSetup.currentRetryLoops >= $scope.wizard.fobSetup.fobSearchRetryLoops) {
        stopSearch();
      } else {
        FobCollection.findUnregisteredFobByIPAddress()
          .then(function(fob) {
            if (fob) {
              $scope.wizard.fobSetup.setFobFound(fob);
            } else if ($scope.wizard.fobSetup.currentRetryLoops < $scope.wizard.fobSetup.fobSearchRetryLoops) {
              $log.debug("INTENT TO FIND FOB " + $scope.wizard.fobSetup.currentRetryLoops);
              stopSearch();
            } else {
              $log.debug("STOPPED SEARCHING");
              $scope.wizard.fobSetup.searchingFob = false;
            }
          }, function(status) {

          });
      }

    };

    $scope.wizard.fobSetup.setFobFound = function(fob) {
      stopSearch();
      $scope.wizard.fobSetup.selectedFob = fob;
      $scope.wizard.fobSetup.selectedFob.buzzer_enabled = 1;
      $scope.wizard.fobSetup.selectedFob.doorchime_enabled = 0;
      $scope.wizard.fobSetup.fobFound = true;
      $scope.wizard.fobSetup.selectedFob.isNewFob = true;
      $scope.wizard.fobSetup.canRetry = false;
      $scope.wizard.fobSetup.searchingFob = false;
      $scope.wizard.enableNextButton();
      $timeout($scope.nextPage, 2500);
      // $scope.nextPage();
      $log.debug("FOB FOUND" + $scope.wizard.fobSetup.fobFound);
    };

    function stopSearch() {
      $log.debug("STOPPED SEARCHING");
      $scope.wizard.fobSetup.fobFound = false;
      $scope.wizard.fobSetup.searchingFob = false;
      $timeout.cancel($scope.wizard.fobSetup.findUnregisteredFobTimer);
    }

    $scope.wizard.fobSetup.retryAutoSetup = function() {
      // $scope.$apply(function()
      // {
      $scope.wizard.fobSetup.currentRetryTimes++;
      $scope.wizard.fobSetup.currentRetryLoops = 0;
      $scope.wizard.fobSetup.searchingFob = true;
      // });

      if ($scope.wizard.fobSetup.currentRetryTimes === $scope.wizard.fobSetup.fobSearchRetryTimes) {
        $scope.wizard.fobSetup.canRetry = false;
      }
      $scope.wizard.fobSetup.findUnregisteredFob();
    };

    $scope.wizard.fobSetup.closeModal = function() {
      $log.debug('$closeModal()');
      $scope.modal.hide();

      $log.debug("[fobSetupControllerPage1] FOB MANUAL SETUP CHOICE CLOSED");

    };

    function initController() {
      if ($scope.wizard.fobSetup.initialized === true) {
        return;
      }

      $log.debug('[fobSetupControllerPage1] P1 CONTROLLER INITIALIZED');
      $scope.wizard.fobSetup.currentRetryLoops = 0;
      $scope.wizard.fobSetup.currentRetryTimes = ($scope.wizard.fobSetup.currentRetryTimes === undefined) ? 1 :
        $scope.wizard.fobSetup.currentRetryTimes;
      $scope.wizard.fobSetup.searchingFob = true;
      $scope.wizard.fobSetup.canRetry = true;
      $scope.wizard.fobSetup.fobFound = false;
      $scope.wizard.fobSetup.fobSearchRetryLoops = $scope.wizard.wizardModel.fobSetup.fobSearchRetryLoops;
      $scope.wizard.fobSetup.fobSearchRetryTimes = $scope.wizard.wizardModel.fobSetup.fobSearchRetryTimes;

      if ($scope.wizard.fobSetup.currentRetryTimes >= $scope.wizard.fobSetup.fobSearchRetryTimes) {
        $scope.wizard.fobSetup.canRetry = false;
        $scope.wizard.fobSetup.searchingFob = false;
      } else {
        // $scope.wizard.fobSetup.findUnregisteredFob();
      }
      $scope.wizard.disableNextButton();


      $scope.wizard.fobSetup.findUnregisteredFob();

      $scope.wizard.fobSetup.initialized = true;
    }

    function destroyController() {
      if ($scope.wizard.fobSetup) {
        stopSearch();
      }
      $log.debug('[fobSetupControllerPage1] P1 CONTROLLER DESTROYED');
    }

    (function() {
      $scope.wizard.pageCode = '200';

      if ($scope.wizard.fobSetup.fobSetupInitialzed === false) {
        initController();
      }
      $scope.$on('wizardEvent::initialize', initController);
      $scope.$on('wizardEvent::summaryPageClosed', initController);

      $scope.$on('wizardEvent::closeWizard', stopSearch);
      $scope.$on('wizardEvent::showNextPage', stopSearch);
      $scope.$on('wizardEvent::showPreviousPage', stopSearch);


      $scope.$on('$destroy', destroyController);


    })();
  }
})();
