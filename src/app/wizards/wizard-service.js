(function() {
  'use strict';

  /*jshint validthis: true */
  angular.module('app.wizard.service')
    .service('WizardService', wizardService);

  /* @ngInject */
  function wizardService(
    wizardType,
    contentSetupWizards,
    contentFobSetup,
    contentExtenderSetup,
    contentTagSetup,
    contentCircleSetup,
    $log,
    KornerStateHelpers,
    tagStateConst
  ) {
    /*jshint validthis: true */
    var self = this;
    var currentWizardIndex = 0;
    var currentWizard = null;
    var currentPage = 1;
    var totalPages = 0;
    var wizards = [];
    var allWizardsCompleted = false;

    init();

    // list of exported public methods
    return {
      reset: reset,
      addWizard: addWizard,
      setWizards: setWizards,
      setCurrentWizard: setCurrentWizard,
      _getWizardByType: _getWizardByType,
      _setWizardsForSummary: _setWizardsForSummary,
      getCloseWizardTextByWizardType: getCloseWizardTextByWizardType,
      setWizardCompleted: setWizardCompleted,
      setPreviousWizard: setPreviousWizard,
      setNextWizard: setNextWizard,
      showNextPage: showNextPage,
      setCurrentWizardPage: setCurrentWizardPage,
      increaseCurrentWizardPage: increaseCurrentWizardPage,
      decreaseCurrentWizardPage: decreaseCurrentWizardPage,
      initWizardsList: initWizardsList,
      calculateTotalPages: calculateTotalPages,
      getTagSetupValidationStepByType: getTagSetupValidationStepByType,
      isWizardCompletedByType:isWizardCompletedByType // weird function name :)
    };

    // initializer
    function init() {}


    function reset() {
      this.currentWizardIndex = 0;
      this.currentWizard = null;
      this.currentPage = 1;
      this.totalPages = 0;
      this.wizards = [];
      this.allWizardsCompleted = false;
    }

    function addWizard(type) {
      this.wizards.push(_getWizardByType(type));
      this.totalPages += this.wizards[this.wizards.length - 1].pages.length;
    }

    function setWizards(selectedWizards) {
      this.wizards = selectedWizards;
    }

    function setCurrentWizard(wizard) {
      this.currentWizard = wizard;
    }

    function _getWizardByType(type) {
      var wizard;
      switch (type) {
        case wizardType.FOB_SETUP:
          wizard = {
            title: contentSetupWizards.TITLE_FOB,
            description: "Steps you through the process of connecting the Sitck to Korner Server",
            pages: ['wizard-manager.fob-setup.p1', 'wizard-manager.fob-setup.p2'],
            stateName: 'fob-setup',
            totalItemsSetup: '',
            completed: false
          };
          break;
        case wizardType.EXTENDER_SETUP:
          wizard = {
            title: contentSetupWizards.TITLE_EXTENDER,
            description: "Steps you through the setting up an extender",
            pages: ['wizard-manager.extender-setup.p1',
              'wizard-manager.extender-setup.p2',
              'wizard-manager.extender-setup.p3',
              'wizard-manager.extender-setup.p4'
            ],
            stateName: 'extender-setup',
            totalItemsSetup: 0,
            completed: false
          };
          break;
        case wizardType.TAG_SETUP:
          wizard = {
            title: contentSetupWizards.TITLE_TAG,
            description: "Steps you through the attaching tags to your windows and doors",
            pages: ['wizard-manager.tag-setup.p1',
              'wizard-manager.tag-setup.p2',
              'wizard-manager.tag-setup.p3',
              'wizard-manager.tag-setup.p3a',
              'wizard-manager.tag-setup.p4',
              'wizard-manager.tag-setup.p5',
              'wizard-manager.tag-setup.p6',
              'wizard-manager.tag-setup.p7',
              'wizard-manager.tag-setup.p8'
            ],
            stateName: 'tag-setup',
            totalItemsSetup: 0,
            completed: false
          };
          break;
        case wizardType.CIRCLE_SETUP:
          wizard = {
            title: contentSetupWizards.TITLE_CIRCLE,
            description: "Steps you through the process of creating your security circle to protect your home",
            pages: ['wizard-manager.circle-setup.p1',
              'wizard-manager.circle-setup.p2',
              'wizard-manager.circle-setup.p3'
            ],
            stateName: 'circle-setup',
            totalItemsSetup: 0,
            completed: false
          };
          break;
        case wizardType.WELCOME:
          wizard = {
            title: contentSetupWizards.TITLE_WELCOME,
            description: "Walk you through the process of setting up a Korner Sitck",
            pages: ['wizard-manager.circle-setup.p1'],
            stateName: 'welcome',
            completed: true
          };
          break;
      }

      wizard.type = type;
      wizard.currentPage = 1;

      return wizard;
    }

    function isWizardCompletedByType(type) {
      for (var w in this.wizards) {
        if (this.wizards[w].type === type) {
          return this.wizards[w].completed;
        }
      }
    }

    function _setWizardsForSummary(wizards) {
      var summaryWizards = [];
      for (var i = 0; i < wizards.length; i++) {
        if (wizards[i].type !== wizardType.WELCOME) {
          summaryWizards.push(wizards[i]);
        }
      }

      return summaryWizards;
    }

    function getCloseWizardTextByWizardType(type) {
      var closeWizardText;
      switch (type) {
        case wizardType.FOB_SETUP:
          closeWizardText = {
            title: contentFobSetup.CLOSE_WIZARD_TITLE,
            template: contentFobSetup.CLOSE_WIZARD_MESSAGE
          };
          break;
        case wizardType.EXTENDER_SETUP:
          closeWizardText = {
            title: contentExtenderSetup.CLOSE_WIZARD_TITLE,
            template: contentExtenderSetup.CLOSE_WIZARD_MESSAGE
          };
          break;
        case wizardType.TAG_SETUP:
          closeWizardText = {
            title: contentTagSetup.CLOSE_WIZARD_TITLE,
            template: contentTagSetup.CLOSE_WIZARD_MESSAGE
          };
          break;
        case wizardType.CIRCLE_SETUP:
          closeWizardText = {
            title: contentCircleSetup.CLOSE_WIZARD_TITLE,
            template: contentCircleSetup.CLOSE_WIZARD_MESSAGE
          };
          break;
        case wizardType.WELCOME:
          closeWizardText = {
            title: contentSetupWizards.CLOSE_WIZARD_TITLE,
            template: contentSetupWizards.CLOSE_WIZARD_MESSAGE
          };
          break;
      }
      return closeWizardText;
    }


    function setWizardCompleted(type, skipped) {
      $log.debug("[wizard-model] SETTING WIZARD AS COMPLETED: " + type);

      skipped = skipped || false;
      this.allWizardsCompleted = true;

      for (var w in this.wizards) {
        if (this.wizards[w].type === type) {
          this.wizards[w].completed = true;
          $log.debug("[wizard-model] WIZARD COMPLETED: " + this.wizards[w].type);
          switch (type) {
            case wizardType.EXTENDER_SETUP:
            case wizardType.TAG_SETUP:
            case wizardType.CIRCLE_SETUP:
              if (!skipped) {
                this.wizards[w].totalItemsSetup++;
              }
              break;
          }
        }
        $log.debug("[wizard-model] WIZARD COMPLETED: ", this.wizards[w].type, this.wizards[w].completed);
        if (this.wizards[w].completed === false) {
          this.allWizardsCompleted = false;
        }
      }
      $log.debug("[wizard-model] ALL WIZARDS COMPLETED: " + this.allWizardsCompleted);
    }

    function setPreviousWizard() {
      // $log.debug('[wizard-model] SETTING PREVIOUS WIZARD');
      if (this.wizards.length > 1 && this.currentWizardIndex > 0) {
        this.currentWizardIndex--;
        this.currentWizard = this.wizards[this.currentWizardIndex];
        this.currentPage--;
      }
    }

    function setNextWizard() {
      // $log.debug('[wizard-model] SETTING NEXT WIZARD');
      if (this.currentWizardIndex < this.wizards.length - 1) {
        this.currentWizardIndex++;
        this.currentWizard = this.wizards[this.currentWizardIndex];
        this.currentPage++;
      }
    }

    function showNextPage() {
      $rootScope.$broadcast('WizardService::showNextPage', author);
    }

    function setCurrentWizardPage(page) {
      // $log.debug('[wizard-model] SETTING WIZARD PAGE TO: '+page);
      var pageDif = page - this.currentWizard.currentPage;
      this.currentWizard.currentPage = page;
      this.currentPage += pageDif;
      // $log.debug('[wizard-model] CURRENT PAGE: '+this.currentPage, pageDif);
    }

    function increaseCurrentWizardPage() {
      this.currentWizard.currentPage++;
      this.currentPage++;
      // $log.debug('[wizard-model] MNGR WIZARD CURRENT PAGE: '+this.currentPage);
      if (this.currentPage == this.totalPages) {
        // $log.debug('[wizard-model] WIZARD COMPELTED');
      }
    }

    function decreaseCurrentWizardPage() {
      this.currentWizard.currentPage--;
      this.currentPage--;
      // $log.debug('[wizard-model] MNGR WIZARD CURRENT PAGE: '+this.currentPage);
    }

    function initWizardsList(type) {
      this.wizards = [];
      this.currentWizardIndex = 0;
      this.wizardType = type;
      this.currentPage = 1;

      switch (type) {
        case wizardType.FOB_SETUP:
          this.wizards.push(_getWizardByType(wizardType.FOB_SETUP));
          break;

        case wizardType.EXTENDER_SETUP:
          this.wizards.push(_getWizardByType(wizardType.EXTENDER_SETUP));
          break;

        case wizardType.TAG_SETUP:
          this.wizards.push(_getWizardByType(wizardType.TAG_SETUP));
          break;

        case wizardType.CIRCLE_SETUP:
          this.wizards.push(_getWizardByType(wizardType.CIRCLE_SETUP));
          break;

        case wizardType.WELCOME:
          this.wizards.push(_getWizardByType(wizardType.WELCOME));
          this.wizards.push(_getWizardByType(wizardType.FOB_SETUP));
          this.wizards.push(_getWizardByType(wizardType.EXTENDER_SETUP));
          this.wizards.push(_getWizardByType(wizardType.TAG_SETUP));
          this.wizards.push(_getWizardByType(wizardType.CIRCLE_SETUP));
          break;

        case wizardType.HARDWARE:
          this.wizards.push(_getWizardByType(wizardType.FOB_SETUP));
          this.wizards.push(_getWizardByType(wizardType.EXTENDER_SETUP));
          this.wizards.push(_getWizardByType(wizardType.TAG_SETUP));
          break;
      }

      this.currentWizard = this.wizards[this.currentWizardIndex];
      // $log.debug('[wizard-service] CURRENT WIZARD: ' + this.currentWizard);
      this.calculateTotalPages();
      this.currentWizard.currentPage = 1;
      this.wizardsForSummary = _setWizardsForSummary(this.wizards);
      // $log.debug("TOTAL WIZARDS: "+ this.wizards.length);
    }

    function calculateTotalPages() {
      this.totalPages = 0;
      for (var w in this.wizards) {
        // $log.debug("WIZARD PAGES: "+ this.wizards[w].pages);
        this.totalPages += this.wizards[w].pages.length;
      }
      // $log.debug("TOTAL PAGES: "+ this.totalPages);
    }

    function getTagSetupValidationStepByType(type) {
      if (type === 'initializingPortal') {
        return {
          type: 'initializingPortal',
          title: contentTagSetup.STEP_INITIALIZING_PORTAL_TITLE,
          description: contentTagSetup.STEP_INITIALIZING_PORTAL_DESC,
          requiredState: KornerStateHelpers.isTagStateTampered,
          requiredState2: KornerStateHelpers.istagStateInitializing,
          negateState: true,
          negateState2: true,
          completed: false,
          failed: false,
          started: false,
          timedOut: false,
          uiStyle: 'pop',
          stepIndex: -1
        };
      }
      if (type === 'analyzingPortal') {
        return {
          type: 'analyzingPortal',
          title: contentTagSetup.STEP_ANALYZING_PORTAL_TITLE,
          description: contentTagSetup.STEP_ANALYZING_PORTAL_DESC,
          requiredState: KornerStateHelpers.isTagStateMoving,
          negateState: true,
          completed: false,
          failed: false,
          started: false,
          timedOut: false,
          reqTime: 5000,
          uiStyle: 'do not show',
          stepIndex: -1
        };
      }
      if (type === 'doorOpenPortal') {
        return {
          type: 'doorOpenPortal',
          title: contentTagSetup.STEP_DOOR_OPEN_PORTAL_TITLE,
          description: contentTagSetup.STEP_DOOR_OPEN_PORTAL_DESC,
          requiredState: KornerStateHelpers.isTagStateMoving,
          negateState: false,
          completed: false,
          failed: false,
          started: false,
          timedOut: false,
          uiStyle: 'page',
          stepIndex: 1
        };
      }

      if (type === 'doorClosePortal') {
        return {
          type: 'doorClosePortal',
          title: contentTagSetup.STEP_DOOR_CLOSE_PORTAL_TITLE,
          description: contentTagSetup.STEP_DOOR_CLOSE_PORTAL_DESC,
          requiredState: KornerStateHelpers.isTagStateMoving,
          negateState: false,
          completed: false,
          failed: false,
          started: false,
          timedOut: false,
          uiStyle: 'page',
          stepIndex: 2
        };
      }

      if (type === 'windowOpenPortal') {
        return {
          type: 'windowOpenPortal',
          title: contentTagSetup.STEP_WINDOW_OPEN_PORTAL_TITLE,
          description: contentTagSetup.STEP_WINDOW_OPEN_PORTAL_DESC,
          requiredState: KornerStateHelpers.isTagStateMoving,
          negateState: false,
          completed: false,
          failed: false,
          started: false,
          timedOut: false,
          uiStyle: 'page',
          stepIndex: 1
        };
      }

      if (type === 'windowClosePortal') {
        return {
          type: 'windowClosePortal',
          title: contentTagSetup.STEP_WINDOW_CLOSE_PORTAL_TITLE,
          description: contentTagSetup.STEP_WINDOW_CLOSE_PORTAL_DESC,
          requiredState: KornerStateHelpers.isTagStateMoving,
          negateState: false,
          completed: false,
          failed: false,
          started: false,
          timedOut: false,
          uiStyle: 'page',
          stepIndex: 2
        };
      }
    }

    // this.tagSetupValidationStepsBy
  }
})();

(function() {
  'use strict';
  App.constant('wizardType', {
    FOB_SETUP: 0,
    EXTENDER_SETUP: 1,
    TAG_SETUP: 2,
    CIRCLE_SETUP: 3,
    WELCOME: 4,
    HARDWARE: 5
  });
})();
