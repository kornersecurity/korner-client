(function() {
  'use strict';

  angular
    .module('app.core')
    .service('KornerStateHelpers', kornerStateHelpers);

  /* @ngInject */
  function kornerStateHelpers(fobStateConst, tagStateConst) {

    // list of exported public methods
    return {
      isFobStateUnknown: isFobStateUnknown,
      isFobStateDisarmed: isFobStateDisarmed,
      isFobStateArmed: isFobStateArmed,
      isFobStateArmPending: isFobStateArmPending,
      isFobStateTriggered: isFobStateTriggered,
      isFobStateTriggeredAlarming: isFobStateTriggeredAlarming,
      isFobStateTriggeredSilent: isFobStateTriggeredSilent,
      isFobStatePairing: isFobStatePairing,
      isFobStateFirmwareUpdating: isFobStateFirmwareUpdating,
      isFobStateFirmwareUpdateCritical: isFobStateFirmwareUpdateCritical,
      isFobStateFirmwareUpdate: isFobStateFirmwareUpdate,
      hasFobStateFirmwareUpgradeFailed: hasFobStateFirmwareUpgradeFailed,
      hasFobStateFirmwareUpgradePending: hasFobStateFirmwareUpgradePending,
      isFobStateChimeEnabled: isFobStateChimeEnabled,
      isFobStateBuzzerEnabled: isFobStateBuzzerEnabled,
      hasFobStateTroubleWithLocalNet: hasFobStateTroubleWithLocalNet,
      hasFobStateTroubleWithServerConnection: hasFobStateTroubleWithServerConnection,
      hasFobStateTroubleWithRadioConnect: hasFobStateTroubleWithRadioConnect,
      isFobStateDisconnected: isFobStateDisconnected,
      isFobStateConnected: isFobStateConnected,
      isFobStateMissing: isFobStateMissing,
      isFobStateArmDelayEnabled: isFobStateArmDelayEnabled,


      isTagStateUnknown: isTagStateUnknown,
      isTagStateOpen: isTagStateOpen,
      isTagStateClosed: isTagStateClosed,
      isTagStateMoving: isTagStateMoving,
      isTagStateStill: isTagStateStill,
      isTagStateTampered: isTagStateTampered,
      isTagStateLowBattery: isTagStateLowBattery,
      isTagStateSupervisionReports: isTagStateSupervisionReports,
      isTagStateRestoreReports: isTagStateRestoreReports,
      isTagStateRadioTrouble: isTagStateRadioTrouble,
      isTagStateAC: isTagStateAC,
      isTagStateTest: isTagStateTest,
      isTagStateNoUpgrade: isTagStateNoUpgrade,
      isTagStateLostNetwork: isTagStateLostNetwork,
      isTagStateNoOpenClose: isTagStateNoOpenClose,
      isTagStateMagneticDistortion: isTagStateMagneticDistortion,
      isTagStateExcessiveVibration: isTagStateExcessiveVibration,
      istagStateInitializing: istagStateInitializing,
      isTagStateReset: isTagStateReset,
      isTagStateMissing: isTagStateMissing,
      isTagStateBypassed: isTagStateBypassed,
      isTagStateWaitingForUpgradeOK: isTagStateWaitingForUpgradeOK,
      isTagStateHealthy: isTagStateHealthy,
      isTagStateActive: isTagStateActive,
      isTagStateOpenMoving: isTagStateOpenMoving,
      userRelevantTagState: userRelevantTagState,
      isTagsIssueStateIdentical: isTagsIssueStateIdentical,
      isTagsMovementStateIdentical: isTagsMovementStateIdentical
    };



    function isFobStateUnknown(state) {
      return (state === fobStateConst.unknown);
    }

    function isFobStateDisarmed(state) {
      return (state & fobStateConst.disarmed) === fobStateConst.disarmed;
    }

    function isFobStateArmed(state) {
      return (state & fobStateConst.armed) === fobStateConst.armed;
    }

    function isFobStateArmPending(state) {
      return (state & fobStateConst.armPending) === fobStateConst.armPending;
    }

    function isFobStateTriggered(state) {
      return (state & fobStateConst.triggeredAlarm) === fobStateConst.triggeredAlarm || (state & fobStateConst.triggeredSilent) === fobStateConst.triggeredSilent;
    }

    function isFobStateTriggeredAlarming(state) {
      return (state & fobStateConst.triggeredAlarm) === fobStateConst.triggeredAlarm;
    }

    function isFobStateTriggeredSilent(state) {
      return (state & fobStateConst.triggeredSilent) === fobStateConst.triggeredSilent;
    }

    function isFobStatePairing(state) {
      return (state & fobStateConst.pairing) === fobStateConst.pairing;
    }

    function isFobStateFirmwareUpdating(state) {
      return (state & fobStateConst.firmwareUpdateCritical) === fobStateConst.firmwareUpdateCritical || (state & fobStateConst.firmwareUpdate) === fobStateConst.firmwareUpdate;
    }

    function isFobStateFirmwareUpdateCritical(state) {
      return (state & fobStateConst.firmwareUpdateCritical) === fobStateConst.firmwareUpdateCritical;
    }

    function isFobStateFirmwareUpdate(state) {
      return (state & fobStateConst.firmwareUpdate) === fobStateConst.firmwareUpdate;
    }

    function hasFobStateFirmwareUpgradeFailed(state) {
      return (state & fobStateConst.upgradeFailed) === fobStateConst.upgradeFailed;
    }

    function hasFobStateFirmwareUpgradePending(state) {
      return (state & fobStateConst.upgradePending) === fobStateConst.upgradePending;
    }

    function isFobStateChimeEnabled(state) {
      return (state & fobStateConst.chimeEnabled) === fobStateConst.chimeEnabled;
    }

    function isFobStateBuzzerEnabled(state) {
      return (state & fobStateConst.buzzerEnabled) === fobStateConst.buzzerEnabled;
    }

    function hasFobStateTroubleWithLocalNet(state) {
      return (state & fobStateConst.troubleLocalNet) === fobStateConst.troubleLocalNet;
    }

    function hasFobStateTroubleWithServerConnection(state) {
      return (state & fobStateConst.troubleServerConn) === fobStateConst.troubleServerConn;
    }

    function hasFobStateTroubleWithRadioConnect(state) {
      return (state & fobStateConst.troubleRadioNet) === fobStateConst.troubleRadioNet;
    }

    function isFobStateDisconnected(state) {
      return (state & fobStateConst.disconnected) === fobStateConst.disconnected;
    }

    function isFobStateConnected(state) {
      return (state & fobStateConst.connected) === fobStateConst.connected;
    }

    function isFobStateMissing(state) {
      return (state & fobStateConst.missing) === fobStateConst.missing;
    }

    function isFobStateArmDelayEnabled(state) {
      return (state & fobStateConst.armDelayEnabled) === fobStateConst.armDelayEnabled;
    }









    function isTagStateUnknown(state) {
      return (state === tagStateConst.tagStateUnknown);
    }

    function isTagStateOpen(state) {
      return (state & tagStateConst.tagStateOpen) === tagStateConst.tagStateOpen && !isTagStateNoOpenClose(state);
    }

    function isTagStateClosed(state) {
      return (state & tagStateConst.tagStateOpen) !== tagStateConst.tagStateOpen && !isTagStateNoOpenClose(state);
    }

    function isTagStateMoving(state) {
      return (state & tagStateConst.tagStateMoving) === tagStateConst.tagStateMoving;
      // return (state & tagStateConst.tagStateMoving) === tagStateConst.tagStateMoving && isTagStateNoOpenClose(state);
    }

    function isTagStateStill(state) {
      return (state & tagStateConst.tagStateMoving) !== tagStateConst.tagStateMoving;
      // return (state & tagStateConst.tagStateMoving) !== tagStateConst.tagStateMoving && isTagStateNoOpenClose(state);
    }

    function isTagStateTampered(state) {
      return (state & tagStateConst.tagStateTampered) === tagStateConst.tagStateTampered;
    }

    function isTagStateLowBattery(state) {
      return (state & tagStateConst.tagStateLowBattery) === tagStateConst.tagStateLowBattery;
    }

    function isTagStateSupervisionReports(state) {
      return (state & tagStateConst.tagStateSupervisionReports) === tagStateConst.tagStateSupervisionReports;
    }

    function isTagStateRestoreReports(state) {
      return (state & tagStateConst.tagStateRestoreReports) === tagStateConst.tagStateRestoreReports;
    }

    function isTagStateRadioTrouble(state) {
      return (state & tagStateConst.tagStateRadioTrouble) === tagStateConst.tagStateRadioTrouble;
    }

    function isTagStateAC(state) {
      return (state & tagStateConst.tagStateAC) === tagStateConst.tagStateAC;
    }

    function isTagStateTest(state) {
      return (state & tagStateConst.tagStateTest) === tagStateConst.tagStateTest;
    }

    function isTagStateNoUpgrade(state) {
      return (state & tagStateConst.tagStateNoUpgrade) === tagStateConst.tagStateNoUpgrade;
    }

    function isTagStateLostNetwork(state) {
      return (state & tagStateConst.tagStateLostNetwork) === tagStateConst.tagStateLostNetwork;
    }

    function isTagStateNoOpenClose(state) {
      return (state & tagStateConst.tagStateNoOpenClose) === tagStateConst.tagStateNoOpenClose;
    }

    function isTagStateMagneticDistortion(state) {
      return (state & tagStateConst.tagStateMagneticDistortion) === tagStateConst.tagStateMagneticDistortion;
    }

    function isTagStateExcessiveVibration(state) {
      return (state & tagStateConst.tagStateExcessiveVibration) === tagStateConst.tagStateExcessiveVibration;
    }

    function istagStateInitializing(state) {
      return (state & tagStateConst.tagStateInitializing) === tagStateConst.tagStateInitializing;
    }

    function isTagStateReset(state) {
      return (state & tagStateConst.tagStateReset) === tagStateConst.tagStateReset;
    }

    function isTagStateMissing(state) {
      return (state & tagStateConst.tagStateMissing) === tagStateConst.tagStateMissing;
    }

    function isTagStateBypassed(state) {
      return (state & tagStateConst.tagStateBypassed) === tagStateConst.tagStateBypassed;
    }

    function isTagStateWaitingForUpgradeOK(state) {
      return (state & tagStateConst.tagStateWaitingForUpgradeOK) === tagStateConst.tagStateWaitingForUpgradeOK;
    }

    function isTagStateHealthy(state) {
      return (!istagStateInitializing(state) && !isTagStateExcessiveVibration(state) &&
        !isTagStateMagneticDistortion(state) && !isTagStateRadioTrouble(state) &&
        !isTagStateLowBattery(state) && !isTagStateTampered(state) && !isTagStateMissing(state) &&
        state !== 0);
    }

    function isTagStateActive(state) {
      return (!isTagStateMissing(state) && !isTagStateUnknown(state));
    }

    function isTagStateOpenMoving(state) {
      return isTagStateOpen(state) || isTagStateMoving(state);
    }

    function userRelevantTagState(state) {
      return state & (tagStateConst.tagStateOpen | tagStateConst.tagStateMoving |
        tagStateConst.tagStateTampered | tagStateConst.tagStateLowBattery |
        tagStateConst.tagStateRadioTrouble | tagStateConst.tagStateMagneticDistortion |
        tagStateConst.tagStateExcessiveVibration | tagStateConst.tagStateInitializing |
        tagStateConst.tagStateMissing | tagStateConst.tagStateBypassed);
    }

    function isTagsIssueStateIdentical(tag1State, tag2State) {

      return (tag1State & (tagStateConst.tagStateTampered | tagStateConst.tagStateLowBattery |
        tagStateConst.tagStateRadioTrouble | tagStateConst.tagStateMagneticDistortion |
        tagStateConst.tagStateExcessiveVibration | tagStateConst.tagStateInitializing |
        tagStateConst.tagStateMissing)) == (tag2State & (tagStateConst.tagStateTampered | tagStateConst.tagStateLowBattery |
        tagStateConst.tagStateRadioTrouble | tagStateConst.tagStateMagneticDistortion |
        tagStateConst.tagStateExcessiveVibration | tagStateConst.tagStateInitializing |
        tagStateConst.tagStateMissing));

    }

    function isTagsMovementStateIdentical(tag1State, tag2State) {

      return (tag1State & (tagStateConst.tagStateOpen | tagStateConst.tagStateMoving)) ==
        (tag2State & (tagStateConst.tagStateOpen | tagStateConst.tagStateMoving));

    }
  }

})();
