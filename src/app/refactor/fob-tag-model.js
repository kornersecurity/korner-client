(function() {
  'use strict';


  /*jshint validthis: true */

  angular
    .module('app.core')
    .factory('FobTagModel', fobTagModel)

  .constant('tagStateConst', {
    tagStateUnknown: 0x0,
    tagStateOpen: 0x1,
    tagStateMoving: 0x2,
    tagStateTampered: 0x4,
    tagStateLowBattery: 0x8,
    tagStateSupervisionReports: 0x10,
    tagStateRestoreReports: 0x20,
    tagStateRadioTrouble: 0x40,
    tagStateAC: 0x80,
    tagStateTest: 0x100,
    tagStateNoUpgrade: 0x200,
    tagStateLostNetwork: 0x400,
    tagStateNoOpenClose: 0x800,
    tagStateMagneticDistortion: 0x1000,
    tagStateExcessiveVibration: 0x2000,
    tagStateInitializing: 0x4000,
    tagStateReset: 0x8000,
    tagStateMissing: 0x10000,
    tagStateBypassed: 0x20000,
    tagStateWaitingForUpgradeOK: 0x10000000
  })

  .constant('tagPortalEnvironmentConst', {
    BIT_NONE: 0x0,
    BIT_BLINDS: 0x1,
    BIT_HORIZONTAL_BLINDS: 0x2,
    BIT_SCREEN: 0x4
  });

  /* @ngInject */
  function fobTagModel($q, $log, KornerMsgHelpers, Restangular, KornerStateHelpers, gettext, tagPortalEnvironmentConst) {

    function FobTagModel(tag) {
      angular.extend(this, tag);

      this._initializedDeferred = $q.defer();
      this.isByPassed = false;
      this.isMissing = false;
      this.tagIssuesText = "";
      this.tagStatusText = "";
      this.hasIssue = false;
      this.tagFullName = tag.tag_name;
    }

    FobTagModel.prototype = {
      onInitialize: onInitialize,
      hasInitialized: hasInitialized,

      // public methods
      processTagStatusMsg: processTagStatusMsg,
      store: store,
      setTagFullName: setTagFullName,
      setDefaultTagName: setDefaultTagName,
      refreshState: refreshState,

      // private methods
      _generateTagName: _generateTagName,
      _updateTagInternalState: _updateTagInternalState,
      tagPortalHasScreen: tagPortalHasScreen,
      tagPortalHasBlinds: tagPortalHasBlinds,
      tagPortalHasHorizontalBlinds: tagPortalHasHorizontalBlinds,
      setPortalEnvironmentBlindsBit: setPortalEnvironmentBlindsBit,
      setPortalEnvironmentHorizontalBlindsBit: setPortalEnvironmentHorizontalBlindsBit,
      setPortalEnvironmentScreenBit: setPortalEnvironmentScreenBit
    };

    return FobTagModel;


    // initializer
    function onInitialize() {

      this._updateTagInternalState();
      this.tagFullName = this.tag_name;

      this._initializedDeferred.resolve();
      return this._initializedDeferred.promise;
    }

    function hasInitialized() {
      return this._initializedDeferred;
    }

    function processTagStatusMsg(msg) {
      this.tag_state = msg.Payload.State;
      this._updateTagInternalState();
    }


    function store() {
      var defer = $q.defer();
      var self = this;

      var attributes = {
        "tag_name": self.tag_name,
        "portal_type_id": self.portal_type_id,
        "portal_mechanism_id": self.portal_mechanism_id,
        "portal_environment_mask": self.portal_environment_mask
      };
      $log.debug('[fob-tag-model] PUT PORTAL TYPE ID:  ' + attributes.portal_type_id);
      $log.debug('[fob-tag-model] PUT PPORTAL MECH ID: ' + attributes.portal_mechanism_id);
      $log.debug('[fob-tag-model] PUT PORTAL ENV MASK: ' + attributes.portal_environment_mask);
      Restangular.one('fobs', self.fob_id).one('tags', self.tag_id).customPUT(attributes)
        .then(function() {
          self.onInitialize();
          defer.resolve();
        }, function(error) {
          defer.reject(error);
        });

      return defer.promise;

    }

    function refreshState() {
      var defer = $q.defer();
      var self = this;
      var promises = [];

      Restangular.one('fobs', self.fob_id).one('tags', self.tag_id).get()
        .then(function(res) {
          self.tag_state = res.tag_state;
          self._updateTagInternalState();
          // $log.debug('TAG STATE: '+self.tag_state);

          $q.all(promises).then(function() {
            defer.resolve();
          });

          defer.resolve();
        }, function(error) {
          defer.reject(error);
        });

      return defer.promise;
    }

    function setDefaultTagName() {
      if (this.tag_name.toLowerCase().indexOf('window') > -1 || this.tag_name.toLowerCase().indexOf('door') > -1) {
        this.tagFullName = this.tag_name;
      } else {
        var portalTypeName = KornerMsgHelpers.getPortalTypeDescription(this.portal_type_id);
        var portalMechanismName = KornerMsgHelpers.getPortalMechanismDescription(this.portal_mechanism_id);
        portalMechanismName += (portalMechanismName === "") ? "" : " ";
        this.tag_name = portalMechanismName + portalTypeName;
        this.tagFullName = this.tag_name;
      }
    }

    function setTagFullName() {
      // this._generateTagName();
      this.tagFullName = this.tag_name;
    }


    // private functions
    function _updateTagInternalState() {
      this.tagIssuesText = KornerMsgHelpers.getTagStateIssueDescriptions(this.tag_state);
      this.isBypassed = KornerStateHelpers.isTagStateBypassed(this.tag_state);
      this.isMissing = KornerStateHelpers.isTagStateMissing(this.tag_state);
      this.hasIssue = false;

      if (!this.isBypassed) {
        this.tagStatusText = KornerMsgHelpers.getTagStatusDescriptions(this.tag_state);

        if (!KornerStateHelpers.isTagStateHealthy(this.tag_state) || KornerStateHelpers.isTagStateOpenMoving(this.tag_state)) {
          this.hasIssue = true;
        }
      } else {
        this.tagStatusText = gettext('by-passed');
      }
    }

    function _generateTagName() {

      if (this.tag_name.toLowerCase().indexOf('window') > -1 || this.tag_name.toLowerCase().indexOf('door') > -1) {
        this.tagFullName = this.tag_name;
      } else {
        var portalTypeName = KornerMsgHelpers.getPortalTypeDescription(this.portal_type_id);
        var portalMechanismName = KornerMsgHelpers.getPortalMechanismDescription(this.portal_mechanism_id);
        portalMechanismName += (portalMechanismName === "") ? "" : " ";
        this.tagFullName = this.tag_name + " " + portalMechanismName + portalTypeName;
      }
      // $log.debug('[fob-tag-model] FULL TAG NAME: '+this.tagFullName+' ('+this.portal_mechanism_id+')');
    }


    function tagPortalHasScreen(state) {
      return (state & tagPortalEnvironmentConst.BIT_SCREEN) === tagPortalEnvironmentConst.BIT_SCREEN;
    }

    function tagPortalHasBlinds(state) {
      return (state & tagPortalEnvironmentConst.BIT_BLINDS) === tagPortalEnvironmentConst.BIT_BLINDS;
    }

    function tagPortalHasHorizontalBlinds(state) {
      return (state & tagPortalEnvironmentConst.BIT_HORIZONTAL_BLINDS) === tagPortalEnvironmentConst.BIT_HORIZONTAL_BLINDS;
    }

    function setPortalEnvironmentHorizontalBlindsBit(hasHorizontalBlinds) {
      if (hasHorizontalBlinds === true) {
        this.portal_environment_mask |= tagPortalEnvironmentConst.BIT_HORIZONTAL_BLINDS;
        $log.debug('[fob-tag-model] PORTAL ENVIRONMENT MASK - HORIZONTAL BLINDS: '+this.portal_environment_mask);
      }else {
        this.portal_environment_mask &= ~tagPortalEnvironmentConst.BIT_HORIZONTAL_BLINDS;
        $log.debug('[fob-tag-model] PORTAL ENVIRONMENT MASK - NO HORIZONTAL BLINDS: '+this.portal_environment_mask);
      }
    }

    function setPortalEnvironmentBlindsBit(hasBlinds) {
      if (hasBlinds === true) {
        this.portal_environment_mask |= tagPortalEnvironmentConst.BIT_BLINDS;
        $log.debug('[fob-tag-model] PORTAL ENVIRONMENT MASK - BLINDS: '+this.portal_environment_mask);
      }else {
        this.portal_environment_mask &= ~tagPortalEnvironmentConst.BIT_BLINDS;
        $log.debug('[fob-tag-model] PORTAL ENVIRONMENT MASK - NO BLINDS: '+this.portal_environment_mask);
      }
    }

    function setPortalEnvironmentScreenBit(hasScreen) {
      if (hasScreen === true) {
        this.portal_environment_mask |= tagPortalEnvironmentConst.BIT_SCREEN;
        $log.debug('[fob-tag-model] PORTAL ENVIRONMENT MASK - SCREEN: '+this.portal_environment_mask);
      }else {
        this.portal_environment_mask &= ~tagPortalEnvironmentConst.BIT_SCREEN;
        $log.debug('[fob-tag-model] PORTAL ENVIRONMENT MASK - NO SCREEN: '+this.portal_environment_mask);
      }
    }

  }

})();
