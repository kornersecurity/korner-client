(function() {
  'use strict';

  angular.module('app.wizard.service').constant('TagSetupSerivceEvent', {
    TAG_FOUND: 0,
    FOB_MISSING: 1,
    PAIRING_TIME_EXCEEDED: 2,
    ACTIVATING_TAG: 3
  });

  /*jshint validthis: true */
  angular.module('app.wizard.service')
    .factory('TagSetupService', tagSetupService);

  /* @ngInject */
  function tagSetupService(
    $rootScope,
    clientUpdateEventConst,
    $timeout,
    FobService2,
    KornerStateHelpers,
    KornerMsgHelpers,
    $log
  ) {
    var self = this;
    var _currentTag;
    var _stopListeningForTagPairing;
    var _stopListeningForFobStateChange;
    var _stopListeningForExtenderPairing;
    var _tagPairingRetryTimes;
    var _tagPairingTimeout;
    var _fobMissing;
    var _fobUpdating;
    var _activatingTag;
    var _canRetry;
    var _tagFound;
    var _currentRetries;
    var _activateTagTimer;
    var _initialized = false;
    var _extenderPaired = false;
    $log.debug('[tagSetupService] INSTANTIATED');

    return {
      init: init,
      // setCurrentTag: setCurrentTag,
      getCurrentTag: getCurrentTag,
      startActivation: startActivation,
      stopActivation: stopActivation,
      fobMissing: _fobMissing,
      canRetry: _canRetry,
      activatingTag: _activatingTag,
      tagFound: _tagFound,
      reset: reset
    };

    function getCurrentTag() {
      // return angular.copy(_currentTag);
      return _currentTag;
    }

    function reset() {
      if (_stopListeningForFobStateChange !== null) {
        _stopListeningForFobStateChange();
      }

      if (_stopListeningForTagPairing) {
        _stopListeningForTagPairing();
      }
      if (_stopListeningForExtenderPairing) {
        _stopListeningForExtenderPairing();
      }

      if(_activatingTag === true) {
        FobService2.stopPairing();
      }

      _currentTag = null;
      _stopListeningForTagPairing = null;
      _stopListeningForFobStateChange = null;
      _stopListeningForExtenderPairing = null;
      _fobMissing = false;
      _fobUpdating = false;
      _activatingTag = false;
      _canRetry = true;
      _tagFound = false;
      _activateTagTimer = null;
      _initialized = false;
      _extenderPaired = false;
    }

    function startActivation() {
      if (_tagFound) {
        $rootScope.$emit('TagSetupSerivceEvent', generateResponseObject());
        return;
      }
      if (_activatingTag) {
        $rootScope.$emit('TagSetupSerivceEvent', generateResponseObject());
        return;
      }

      _stopListeningForTagPairing = $rootScope.$on(clientUpdateEventConst.TAG_PAIRED, onTagPaired);
      _stopListeningForExtenderPairing = $rootScope.$on(clientUpdateEventConst.EXTENDER_PAIRED, onExtenderPaired);

      if (_stopListeningForFobStateChange === null) {
      $log.debug('[tagSetupService] STARTING ACTIVATION');
        _stopListeningForFobStateChange = $rootScope.$on(clientUpdateEventConst.FOB_STATE_CHANGE, onFobStateChange);
      }

      if (_currentRetries >= _tagPairingRetryTimes) {
        $rootScope.$emit('TagSetupSerivceEvent', generateResponseObject());
        return;
      }
      $log.debug('[tagSetupService] STARTING ACTIVATION');

      _activateTagTimer = $timeout(onTagPairingTimeout, _tagPairingTimeout);
      _currentRetries++;
      _activatingTag = true;

      FobService2.startPairing();
    }

    function generateResponseObject() {
      return {
        fobUpdating: _fobUpdating,
        fobMissing: _fobMissing,
        activatingTag: _activatingTag,
        canRetry: _canRetry,
        tagFound: _tagFound,
        extenderPaired: _extenderPaired
      };
    }

    function onTagPairingTimeout() {
      stopActivation();
      $rootScope.$emit('TagSetupSerivceEvent', generateResponseObject());
    }


    function onTagPaired(event, fobId, tagId, tagEui64) {
      // $log.debug('[tagSetupService] TAG PAIRED: ' + FobService2.fob.tags.tags[tagId]);

      if (!FobService2.fob.tags.tags[tagId]) {
        return;
      }

      if (_tagFound === true) {
        return;
      }
      if (_stopListeningForFobStateChange) {
        _stopListeningForFobStateChange();
        _stopListeningForFobStateChange = null;
      }

      stopActivation();

      // tags = FobService2.fob.tags.getTagsArray();
      _currentTag = FobService2.fob.tags.tags[tagId];

      $log.debug('[tagSetupService] TAG PAIRED');
      $log.debug(_currentTag);


      _canRetry = false;
      _tagFound = true;

      // updateTagType();

      $rootScope.$emit('TagSetupSerivceEvent', generateResponseObject());
    }

    function onExtenderPaired(event, fobId, tagId, tagEui64) {
      // $log.debug('[tagSetupService] TAG PAIRED: ' + FobService2.fob.tags.tags[tagId]);

      stopActivation();

      $log.debug('[tagSetupService] EXTENDER PAIRED');
      $log.debug(_currentTag);


      _canRetry = true;
      _tagFound = false;
      _extenderPaired = true;
      $rootScope.$emit('TagSetupSerivceEvent', generateResponseObject());
      _extenderPaired = false;
    }


    function onFobStateChange(event, fobId, state) {

      if (fobId !== FobService2.fob.fob_id || _tagFound === true) {
        return;
      }

      console.log('[tagSetupService] FOB STATUS UPDATED: ' + state);
      // $log.debug('[tagSetupService] FOB STATE: ' + KornerMsgHelpers.getDescriptionForFobState(state));

      if (KornerStateHelpers.isFobStateConnected(state) === false) {
        stopActivation();
        _activatingTag = false;
        _fobMissing = true;

        $log.debug('[tagSetupService] FOB STATUS CHANGE - TEST 1');
        $rootScope.$emit('TagSetupSerivceEvent', generateResponseObject());
        return;
      }

      if ((KornerStateHelpers.isFobStateArmPending(state) === true ||
          KornerStateHelpers.isFobStateArmed(state) === true) &&
          _activatingTag === true) {

        $log.debug('[tagSetupService] FOB STATUS CHANGE - TEST 2');
        stopActivation();
        _activatingTag = false;
        // _fobMissing = true;

        $rootScope.$emit('TagSetupSerivceEvent', generateResponseObject());
        return;
      }

      if (KornerStateHelpers.isFobStateDisarmed(state) === true &&
          _fobMissing === true) {

        $log.debug('[tagSetupService] FOB STATUS CHANGE - TEST 3');
        _fobMissing = false;
        if (_activatingTag === false) {
          startActivation();
          $rootScope.$emit('TagSetupSerivceEvent', generateResponseObject());
        }
        return;
      }


      if (KornerStateHelpers.isFobStateDisarmed(state) === true &&
          _fobMissing === false && _activatingTag === true) {

        $log.debug('[tagSetupService] FOB STATUS CHANGE - TEST 4');
        stopActivation();

        $rootScope.$emit('TagSetupSerivceEvent', generateResponseObject());
        return;
      }
    }

    function stopActivation() {

      if (FobService2.fob.isPairing() === true){
        FobService2.stopPairing();
      }

      // $scope.$apply(function() {
      _activatingTag = false;
      $timeout.cancel(_activateTagTimer);
      _activateTagTimer = null;

      $log.debug('[tagSetupService] STOPPING TAG ACTIVATION');
      if (_currentRetries < _tagPairingRetryTimes) {
        _canRetry = true;
      } else {
        _canRetry = false;
      }
      // $log.debug('[tagSetupService] CURRENT RETRIES: ' + _currentRetries);
      // $log.debug('[tagSetupService] MAX RETRIES:     ' + _tagPairingRetryTimes);
      // $log.debug('[tagSetupService] CAN RETRY:       ' + _canRetry);
      // $log.debug('[tagSetupService] ACTIVATING TAG:  ' + _activatingTag);

      /*
       * Commenting out to stop timming issue
      if (_stopListeningForTagPairing) {
        _stopListeningForTagPairing();
        _stopListeningForTagPairing = null;
      }
      */

      // setTimeout(function() {
      //   FobService2.tagSetupCancel();
      // }, 1000);
      // });
      // if(_stopListeningForFobStateChange) {
      //   _stopListeningForFobStateChange();
      //   _stopListeningForFobStateChange = null;
      // }
    }

    function init(wizardModel) {
      $log.debug('[tagSetupService] INITIALIZING...');
      if (_initialized || FobService2.fob === undefined || FobService2.fob === null) {
        return;
      }
      _tagPairingRetryTimes = wizardModel.tagSetup.tagPairingRetryTimes;
      _tagPairingTimeout = wizardModel.tagSetup.tagPairingTimeout;
      _stopListeningForFobStateChange = $rootScope.$on(clientUpdateEventConst.FOB_STATE_CHANGE, onFobStateChange);

      $log.debug('[tagSetupService] MAX RETRIES: ' + _tagPairingRetryTimes);

      _fobMissing = false;

      if (_currentTag) {
        _activatingTag = false;
        _canRetry = false;
        _tagFound = true;
      } else {
        _currentRetries = 0;
        _activatingTag = false;
        _canRetry = false;
        _tagFound = false;

        // $log.debug('[tagSetupService] FOB STATE: ' + FobService2.fob.fob_state);
        // $log.debug('[tagSetupService] isConnected: ' + FobService2.fob.isConnected());

        if (FobService2.fob.isConnected()) {
          _fobMissing = false;
          // startActivation();
        } else {
          _fobMissing = true;
        }
      }
      _initialized = true;
    }


  }
})();
