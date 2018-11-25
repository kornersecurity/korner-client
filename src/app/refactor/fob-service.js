(function() {
  'use strict';

  angular
    .module('app.core')
    .service('FobService2', fobService);

  /* @ngInject */
  function fobService($rootScope, FobModel, connection, clientProtocolService, fobCmdMessageConst, $log, Restangular, serverMessageConst) {
    /*jshint validthis: true */
    var self = this;
    var fob = null;

    init();

    // list of exported public methods
    return {
      onActivateFob: onActivateFob,
      onDeactivate: onDeactivate,

      isConnected: isConnected,
      isArmed: isArmed,
      isDisarmed: isDisarmed,
      isTriggered: isTriggered,
      isSounding: isSounding,
      isMissing: isMissing,
      isArmPending: isArmPending,

      startPairing: startPairing,
      stopPairing: stopPairing,
      arm: arm,
      disarm: disarm,
      silence: silence,
      updateFirmware: updateFirmware,

      tagSetupStart: tagSetupStart,
      tagSetupComplete: tagSetupComplete,
      tagSetupCancel: tagSetupCancel,

      extenderSetupStart: extenderSetupStart,
      extenderSetupComplete: extenderSetupComplete,
      extenderSetupCancel: extenderSetupCancel,


    };

    // initializer
    function init() {}


    function onActivateFob(fob) {

      if (!this.fob || (this.fob != fob && this.fob.fob_id && this.fob.fob_id != fob.fob_id)) {
        this.fob = fob;
        this.fobUser = this.fob.users.getUserByAccountID($rootScope.user.account_id);
      }
    }

    function onDeactivate() {
      this.fob = null;
      this.fobUser = null;
    }


    function isConnected() {
      return this.fob.isConnected();
    }

    function isArmed() {
      return this.fob.isArmed();
    }

    function isDisarmed() {
      return this.fob.isDisarmed();
    }

    function isTriggered() {
      return this.fob.isTriggered();
    }

    function isSounding() {
      return this.fob.isSounding();
    }

    function isMissing() {
      return this.fob.isMissing();
    }

    function isArmPending() {
      return this.fob.isArmPending();
    }

    function startPairing() {
      $log.debug('[FobService2] sending START PAIRING ' + this.fob.fob_id);
      connection.sendMessage(clientProtocolService.buildOutgoingFobMessage(fobCmdMessageConst.START_PAIRING,
        this.fob));
    }

    function stopPairing() {
      $log.debug('[FobService2] sending STOP PAIRING ' + this.fob.fob_id);
      connection.sendMessage(clientProtocolService.buildOutgoingFobMessage(fobCmdMessageConst.STOP_PAIRING,
        this.fob));
    }

    function arm() {
      $log.debug('[FobService2] sending ARM FOB ' + this.fob.fob_id);
      connection.sendMessage(clientProtocolService.buildOutgoingFobMessage(fobCmdMessageConst.ARM_FOB, this.fob));
    }

    function disarm() {
      $log.debug('[FobService2] sending DISARM FOB ' + this.fob.fob_id);
      connection.sendMessage(clientProtocolService.buildOutgoingFobMessage(fobCmdMessageConst.DISARM_FOB,
        this.fob));
    }

    function silence() {
      $log.debug('[FobService2] sending SILENCE FOB ' + this.fob.fob_id);
      connection.sendMessage(clientProtocolService.buildOutgoingFobMessage(fobCmdMessageConst.SILENCE_FOB,
        this.fob));
    }

    function updateFirmware() {
      $log.debug('[FobService2] sending UPDATE FOB FIRMWARE ' + this.fob.fob_id);
      connection.sendMessage(clientProtocolService.buildOutgoingFobMessage(fobCmdMessageConst.UPDATE_FOB_FIRMWARE,
        this.fob));
    }

    function tagSetupStart() {
      $log.debug('[FobService2] sending TAG SETUP STARTED ' + this.fob.fob_id);
      connection.sendMessage(clientProtocolService.buildOutgoingSetupMessage(serverMessageConst.TagSetupStarted,
        this.fob));
    }

    function tagSetupComplete() {
      $log.debug('[FobService2] sending TAG SETUP COMPLETE ' + this.fob.fob_id);
      connection.sendMessage(clientProtocolService.buildOutgoingSetupMessage(serverMessageConst.TagSetupCompleted,
        this.fob));

    }

    function tagSetupCancel() {
      $log.debug('[FobService2] sending TAG SETUP CANCELLED ' + this.fob.fob_id);
      connection.sendMessage(clientProtocolService.buildOutgoingSetupMessage(serverMessageConst.TagSetupCancelled,
        this.fob));

    }

    function extenderSetupStart() {
      $log.debug('[FobService2] sending EXTENDER SETUP STARTED ' + this.fob.fob_id);
      connection.sendMessage(clientProtocolService.buildOutgoingSetupMessage(serverMessageConst.ExtenderSetupStarted,
        this.fob));
    }

    function extenderSetupComplete() {
      $log.debug('[FobService2] sending EXTENDER SETUP COMPLETE ' + this.fob.fob_id);
      connection.sendMessage(clientProtocolService.buildOutgoingSetupMessage(serverMessageConst.ExtenderSetupCompleted,
        this.fob));

    }

    function extenderSetupCancel() {
      $log.debug('[FobService2] sending EXTENDER SETUP CANCELLED ' + this.fob.fob_id);
      connection.sendMessage(clientProtocolService.buildOutgoingSetupMessage(serverMessageConst.ExtenderSetupCancelled,
        this.fob));

    }

  }

})();
