(function() {
  'use strict';

  angular.module('app.wizard')
    .controller('wizardManagerController', wizardManagerController);

  /* @ngInject */
  function wizardManagerController(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    wizardType,
    $ionicScrollDelegate,
    WizardModel,
    WizardService,
    contentCircleSetup,
    $ionicModal,
    accountAuthService,
    FobCollection,
    $log,
    FobService2,
    $mdToast,
    $mdDialog,
    // TagSetupService,
    KornerStateHelpers,
    clientUpdateEventConst,
    contentSetupWizards,
    uiLoadingService
  ) {

    $scope.wizard = {};
    $scope.wizardType = wizardType;
    
    var wizardManagerData;
    var eventHandlerRemovers = [];

    if(accountAuthService.isLoggedIn() === false)
    {
      $state.go('app.startup.splash', {}, {});
    }

    // $ionicScrollDelegate.scrollTop(animate)/* When View Content Loaded */
    $scope.$on('$viewContentLoaded', function() {

      $log.debug('[wizard-manager-controller] SHOULD SCROLL TO TOP');
      // Scroll to Top
      // Set ture for animation which isn't needed in my case
      $ionicScrollDelegate.scrollTop(false);

    });

    function destroyController(){
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      if($scope.wizard.stopListeningForFobStateChange){
        $scope.wizard.stopListeningForFobStateChange();
        $scope.wizard.stopListeningForFobStateChange = null;
      }

      $log.debug('[wizard-manager-controller] DESTROYING');
    }

    function wizardCompleted(forceClose) {
      // $log.debug('[wizard-manager-controller] WIZARD COMPLETED - FORCE CLOSE: '+forceClose);
      $scope.$broadcast('wizardEvent::closeWizard', {});

      FobCollection.getCount()
        .then(function(fobCount) {
          if($scope.wizard.stopListeningForFobStateChange){
            $scope.wizard.stopListeningForFobStateChange();
            $scope.wizard.stopListeningForFobStateChange = null;
          }

          if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
            $log.debug('[wizard-manager-controller] WELCOME WIZARD COMPLETED');

            // && $scope.wizard.wizardManagerData.allWizardsCompleted === true
            if ($scope.wizard.wizardManagerData.allWizardsCompleted === true ||
                $scope.wizard.wizardManagerData.isWizardCompletedByType(wizardType.FOB_SETUP)) {
              closeModal();
              // location.href = location.origin;
              $state.go('app.startup.splash', {}, {});
            } else if(forceClose) {
              closeModal();
              if(fobCount === 1) {
                FobCollection.activateSingleFob();
                $state.go('app.home.tabs.dashboard', {}, {});
              } else {
                $state.go('app.home.select', {}, {});
              }
            // } else if ($scope.wizard.wizardManagerData.currentWizard.type === wizardType.TAG_SETUP ||
            } else if($scope.wizard.wizardManagerData.currentWizard.type === wizardType.CIRCLE_SETUP) {
              wizardManagerData.setCurrentWizardPage(1);
              changeState();
            } else {
              closeModal();
              if(fobCount === 1) {
                FobCollection.activateSingleFob();
                $state.go('app.home.tabs.dashboard', {}, {});
              } else {
                $state.go('app.home.select', {}, {});
              }
            }
          } else {
            if(forceClose){
              closeModal();
              $state.go('app.home.tabs.config', {}, {});
            }else if($scope.wizard.wizardManagerData.currentWizard.type === wizardType.TAG_SETUP ||
               $scope.wizard.wizardManagerData.currentWizard.type === wizardType.CIRCLE_SETUP)
            {
              wizardManagerData.setCurrentWizardPage(1);
              changeState();
            } else {
              closeModal();
              $state.go('app.home.tabs.config', {}, {});
            }
          }
      });
    }

    function wizardClose(closeSummary) {

      $scope.$broadcast('wizardEvent::WizardClose', {});
      $log.debug('[wizard-manager-controller] WIZARD TYPE:         '+
        $scope.wizard.wizardManagerData.wizardType);
      $log.debug('[wizard-manager-controller] CURRENT WIZARD TYPE: '+
        $scope.wizard.wizardManagerData.currentWizard.type);

      if(closeSummary && $scope.modal) {
        if($scope.$$phase) {
          $scope.$apply(function(){
            $scope.modal.hide();
          });
        } else {
          $scope.modal.hide();
        }
        $log.debug('[wizard-manager-controller] CLOSING SUMMARY');
      }

      wizardCompleted(true);
    }

    function closeModal() {
      $log.debug('[wizard-manager-controller] CLOSING MODAL');
      // $rootScope.profileModal.hide();
      // $mdToast.cancel();
      $mdDialog.hide();
    }

    function disableNextButton() {
      $scope.wizard.nextButtonDisabled = true;
    }

    function enableNextButton() {
      $scope.wizard.nextButtonDisabled = false;
    }

    function hideNextButton() {
      $scope.wizard.nextButtonDisplayed = false;
    }

    function showNextButton() {
      $scope.wizard.nextButtonDisplayed = true;
    }

    function disablePreviousButton() {
      $scope.wizard.prevButtonDisabled = true;
    }

    function enablePreviousButton() {
      $scope.wizard.prevButtonDisabled = false;
    }

    function disableDoneButton() {
      $scope.wizard.doneButtonDisabled = true;
    }

    function enableDoneButton() {
      $scope.wizard.doneButtonDisabled = false;
    }

    // function showExitButton() {
    //   $scope.wizard.showExitButton = true;
    // }

    function resetButtons() {
      $scope.wizard.prevButtonDisabled = false;
      $scope.wizard.nextButtonDisabled = false;
    }

    function showSummary() {

      // $scope.wizard.modalTitle = 'Home Setup Summary';
      // $scope.wizard.showModal = true;
      // $scope.wizard.showingSummary = true;
      $scope.wizard.stateBeforeModal = $state.current;
      // $state.go('wizard-manager.wizard-summary', {}, {});
      closeSummary();
    }

    function closeSummary() {
      $log.debug('[wizard-manager-controller] CLOSING SUMMARY');
      // $scope.modal.hide();
      // $scope.wizard.showModal = false;
      // $scope.wizard.showingSummary = false;
      $state.go($scope.wizard.stateBeforeModal, {}, {});
      changeState();
      // $scope.$broadcast('wizardEvent::summaryPageClosed', {});
    }

    function doneClicked() {
      $scope.$broadcast('wizardEvent::doneClicked', {});
    }


    function goToNextPage() {
      resetButtons();
      $scope.wizard.showExitButton = false;
      $log.debug('[wizard-manager-controller] GO TO NEXT PAGE ',
        wizardManagerData.currentWizard.currentPage,
        wizardManagerData.currentWizard.pages.length);

      if (wizardManagerData.currentWizard.currentPage === wizardManagerData.currentWizard.pages.length) {
        $log.debug('[wizard-manager-controller] LAST PAGE');
        if($scope.wizard.wizardManagerData.wizardType !== wizardType.WELCOME &&
           ($scope.wizard.wizardManagerData.currentWizard.type === wizardType.TAG_SETUP ||
           $scope.wizard.wizardManagerData.currentWizard.type === wizardType.CIRCLE_SETUP ||
           $scope.wizard.wizardManagerData.currentWizard.type === wizardType.EXTENDER_SETUP)) {
          wizardManagerData.setCurrentWizardPage(1);
          if($state.is('wizard-manager.wizard-summary')) {
            closeSummary();
          } else {
            changeState();
          }
        } else if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME &&
          $scope.wizard.wizardManagerData.currentWizard.type === wizardType.FOB_SETUP) {
          if ($scope.wizard.wizardManagerData.currentWizard.completed) {
            setNextWizardAndShowSummary();
          } else {
            $scope.$broadcast('wizardEvent::showNextPage', {});
          }
        } else if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
          setNextWizardAndShowSummary();
        }
      } else if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME &&
        ($scope.wizard.wizardManagerData.currentWizard.type === wizardType.TAG_SETUP ||
          $scope.wizard.wizardManagerData.currentWizard.type === wizardType.CIRCLE_SETUP ||
          $scope.wizard.wizardManagerData.currentWizard.type === wizardType.EXTENDER_SETUP) &&
        wizardManagerData.currentWizard.currentPage === 1) {
        setNextWizardAndShowSummary();
      } else {
        $scope.$broadcast('wizardEvent::showNextPage', {});
      }
    }

    function skipNextPage() {
      resetButtons();
      $scope.wizard.showExitButton = false;
      $log.debug('[wizard-manager-controller] SKIP NEXT PAGE');

      if (wizardManagerData.currentWizard.currentPage === wizardManagerData.currentWizard.pages.length) {
        if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME &&
          $scope.wizard.wizardManagerData.currentWizard.type === wizardType.TAG_SETUP) {
          wizardManagerData.setCurrentWizardPage(1);
          changeState();
        } else {
          setNextWizardAndShowSummary();
        }
      } else if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME &&
        $scope.wizard.wizardManagerData.currentWizard.type === wizardType.TAG_SETUP &&
        wizardManagerData.currentWizard.currentPage === 1) {
        setNextWizardAndShowSummary();
      } else {
        // $scope.wizard.wizardManagerData.currentWizard.currentPage++;
        $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
        $scope.$broadcast('wizardEvent::showNextPage', {});
      }
    }

    function skipWizard() {
      resetButtons();
      $scope.wizard.showExitButton = false;
      $log.debug('[wizard-manager-controller] SKIP WIZARD');

      if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
        if($scope.wizard.wizardManagerData.currentWizard.type === wizardType.CIRCLE_SETUP) {
          wizardCompleted(true);
        } else {
          setNextWizardAndShowSummary();
        }
      }
    }

    function setNextWizardAndShowSummary() {
      wizardManagerData.setNextWizard();
      wizardManagerData.setCurrentWizardPage(1);
      var currentWizard = $scope.wizard.wizardManagerData.currentWizard;
      $log.debug('[wizard-manager-controller] NEXT STATE: ' + 'wizard-manager.' + currentWizard.stateName +
        '.p' +
        currentWizard.currentPage);
      // changeState();
      showSummary();
    }

    function goToPreviousPage() {
      resetButtons();
      $scope.$broadcast('wizardEvent::showPreviousPage', {});

      if ($scope.wizard.wizardManagerData.currentWizard.type === wizardType.TAG_SETUP &&
          FobService2.fob.tags.getCount() === 0 &&
          $scope.wizard.wizardManagerData.currentWizard.currentPage === 2) {
        if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
          $scope.wizard.canExitWizard = false;
          $scope.wizard.showExitButton = false;
        } else {
          $scope.wizard.canExitWizard = true;
          $scope.wizard.showExitButton = true;
        }
      }

      if (wizardManagerData.currentWizard.currentPage === 1 && wizardManagerData.wizardType === wizardType.WELCOME) {
        showSummary();
        // wizardManagerData.setPreviousWizard();
        // wizardManagerData.setCurrentWizardPage(wizardManagerData.currentWizard.pages);
        // changeState();
      }
      // else
      // {
      //   $scope.$broadcast('wizardEvent::showPreviousPage', {});
      // }
      $log.debug('[wizard-manager-controller] GO TO PREVIOUS PAGE');
    }


    function changeState() {
      setTimeout(function() {
        if($ionicScrollDelegate === null || $ionicScrollDelegate === undefined) {
          $ionicScrollDelegate.scrollTop(false);
        }
      }, 200);

      var currentWizard = $scope.wizard.wizardManagerData.currentWizard;
      $log.debug('[wizard-manager-controller] CHANGING STATE TO: ' + 'wizard-manager.' + currentWizard.stateName +
        '.p' + currentWizard.currentPage);

      $state.go(currentWizard.pages[currentWizard.currentPage - 1]);
      // $state.go('app.wizard-manager.'+currentWizard.stateName+'.p'+currentWizard.currentPage);
    }

    function startWizard() {
      if (wizardManagerData.wizardType === wizardType.WELCOME) {
        FobCollection.deactiveActiveFob();
        // showSummary();
        $state.go('wizard-manager.' + wizardManagerData.currentWizard.stateName + '.p1');

      } else {
        // if (wizardManagerData.wizardType === wizardType.FOB_SETUP ||
        //    (wizardManagerData.wizardType === wizardType.TAG_SETUP &&
        //     FobService2.fob.tags.getCount() === 0)) {
        //   // $scope.wizard.wizardManagerData.currentWizard.currentPage = 2;
        //   $state.go('wizard-manager.' + wizardManagerData.currentWizard.stateName + '.p2');
        // } else {
        //   $state.go('wizard-manager.' + wizardManagerData.currentWizard.stateName + '.p1');
        // }
        $state.go('wizard-manager.' + wizardManagerData.currentWizard.stateName + '.p1');
      }
      // $log.debug("CURRENT WIZARD: "+wizardManagerData.currentWizard);
    }

    function getScrollHeight(height) {
      var scrollHeight = window.innerHeight - height;
      return scrollHeight + 'px';
    }


    function onFobStateChange(event, fobId, state) {

      if (FobService2.fob === undefined || FobService2.fob === null || fobId !== FobService2.fob.fob_id) {
        return;
      }
      $log.debug('[wizard-manager-controller] FOB STATUS UPDATED: ' + state);
      // $log.debug('[tagSetupService] FOB STATE: ' + KornerMsgHelpers.getDescriptionForFobState(state));

      if ($scope.wizard.wizardManagerData.currentWizard.type === wizardType.TAG_SETUP ||
          $scope.wizard.wizardManagerData.currentWizard.type === wizardType.EXTENDER_SETUP ||
          $scope.wizard.wizardManagerData.currentWizard.type === wizardType.WELCOME) {

        if (KornerStateHelpers.isFobStateConnected(state) === false) {
          uiLoadingService.show(contentSetupWizards.FOB_MISSING, "wizardToast");
        } else if (KornerStateHelpers.isFobStateFirmwareUpdating(state) === true) {
          uiLoadingService.show(contentSetupWizards.FOB_FIRMWARE_UPDATING, "wizardToast");
        } else {
          uiLoadingService.hide();
        }
      }
    }


    (function() {
      wizardManagerData = WizardService;
      WizardService.reset();
      $log.debug('[wizard-manager-controller] WIZARD TYPE: '+$stateParams.wizardType);
      // var wizardTypeInt = parseInt(selectedWizardType);
      var wizardTypeInt = parseInt($stateParams.wizardType);

      wizardManagerData.initWizardsList(wizardTypeInt);

      if (wizardManagerData.wizardType === wizardType.WELCOME &&
        FobCollection.getUnsafeCount() === 0) {
        $scope.wizard.canExitWizard = false;
      } else {
        $scope.wizard.canExitWizard = true;
      }

      $scope.wizard.stopListeningForFobStateChange = $rootScope.$on(clientUpdateEventConst.FOB_STATE_CHANGE, onFobStateChange);

      // API
      $scope.wizard.wizardManagerData = wizardManagerData;
      $scope.wizard.wizardModel = new WizardModel();
      $scope.wizard.goToPreviousPage = goToPreviousPage;
      $scope.wizard.goToNextPage = goToNextPage;
      $scope.wizard.skipNextPage = skipNextPage;
      $scope.wizard.skipWizard = skipWizard;
      $scope.wizard.doneClicked = doneClicked;
      $scope.wizard.wizardClose = wizardClose;
      $scope.wizard.wizardCompleted = wizardCompleted;
      $scope.wizard.closeSummary = closeSummary;
      $scope.wizard.changeState = changeState;
      $scope.wizard.disableNextButton = disableNextButton;
      $scope.wizard.enableNextButton = enableNextButton;
      $scope.wizard.disablePreviousButton = disablePreviousButton;
      $scope.wizard.enablePreviousButton = enablePreviousButton;
      $scope.wizard.disableDoneButton = disableDoneButton;
      $scope.wizard.enableDoneButton = enableDoneButton;
      $scope.wizard.getScrollHeight = getScrollHeight;

      $scope.wizard.nextButtonDisabled = false;
      $scope.wizard.prevButtonDisabled = false;
      $scope.wizard.showExitButton = false;
      $scope.wizard.modalTitle = '';
      $scope.wizard.showModal = false;
      $scope.wizard.nextButtonDisplayed = true;

      startWizard();
      $log.debug('[wizard-manager-controller] STARTED');
      $log.debug('[wizard-manager-controller] CURRENT STATE: '+$state.current.name);

      $scope.$on('$destroy', destroyController);

      // TagSetupService.init($scope.wizard.wizardModel);

    })();
  }
})();
