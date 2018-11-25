(function() {
  'use strict';


  /*jshint validthis: true */

  angular
    .module('app.core')
    .factory('FobUserModel', fobUserModel);


  /* @ngInject */
  function fobUserModel(
    FobUserFeatureMaskConst,
    fobUserStatusConst,
    fobUserTypeConst,
    $q,
    $log,
    ServerService2,
    Restangular) {

    function FobUserModel(fobUser) {
      angular.extend(this, fobUser);
      this.imageUrl = "";
      this._initializedDeferred = $q.defer();
    }



    FobUserModel.prototype = {
      onInitialize: onInitialize,
      hasInitialized: hasInitialized,

      // public methods
      isOwner: isOwner,

      hasConfigFeature: hasConfigFeature,
      hasArmDisarmFeature: hasArmDisarmFeature,
      hasChatFeature: hasChatFeature,
      hasActivityBasicFeature: hasActivityBasicFeature,
      hasActivityAdvancedFeature: hasActivityAdvancedFeature,
      hasIntrusionFeature: hasIntrusionFeature,
      hasHouseholdMemberFeature: hasHouseholdMemberFeature,
      hasImmediateIntrusionNotificationFeature: hasImmediateIntrusionNotificationFeature,

      chatName: chatName,
      fullName: fullName,
      resendInvitation: resendInvitation,
      store: store,

      toggleIntrusionFeatureBit : toggleIntrusionFeatureBit,
      toggleArmDisarmFeatureBit : toggleArmDisarmFeatureBit,
      toggleActivityFeatureBit : toggleActivityFeatureBit,
      toggleHouseholdMemberFeatureBit : toggleHouseholdMemberFeatureBit,
      toggleImmediateIntrusionNotificationFeatureBit : toggleImmediateIntrusionNotificationFeatureBit,

      updateFeatureMaskSettings: updateFeatureMaskSettings,

      // private methods
      _isFeatureMaskBitSetForFobUser: _isFeatureMaskBitSetForFobUser,
      _generateImageUrl: _generateImageUrl
    };

    return FobUserModel;


    // initializer
    function onInitialize() {

      this._generateImageUrl();

      this._initializedDeferred.resolve();
      return this._initializedDeferred.promise;
    }

    function hasInitialized() {
      return this._initializedDeferred;
    }


    function isOwner() {
      return (this.fob_user_type_id === fobUserTypeConst.TYPE_OWNER);
    }

    function hasConfigFeature() {
      return this._isFeatureMaskBitSetForFobUser(FobUserFeatureMaskConst.BIT_CONFIG_SYSTEM);
    }

    function hasArmDisarmFeature() {
      return this._isFeatureMaskBitSetForFobUser(FobUserFeatureMaskConst.BIT_SECURITY_ARMDISARM);
    }

    function hasChatFeature() {
      return this._isFeatureMaskBitSetForFobUser(FobUserFeatureMaskConst.BIT_CHAT_BASIC);
    }

    function hasActivityBasicFeature() {
      return this._isFeatureMaskBitSetForFobUser(FobUserFeatureMaskConst.BIT_ACTIVITY_BASIC);
    }

    function hasActivityAdvancedFeature() {
      return this._isFeatureMaskBitSetForFobUser(FobUserFeatureMaskConst.BIT_ACTIVITY_ADVANCED);
    }

    function hasIntrusionFeature() {
      return this._isFeatureMaskBitSetForFobUser(FobUserFeatureMaskConst.BIT_INTRUSION);
    }

    function hasHouseholdMemberFeature() {
      return this._isFeatureMaskBitSetForFobUser(FobUserFeatureMaskConst.BIT_HOUSEHOLD_MEMBER);
    }

    function hasImmediateIntrusionNotificationFeature() {
      return this._isFeatureMaskBitSetForFobUser(FobUserFeatureMaskConst.BIT_IMMEDIATE_INTRUSION_NOTIFICATION);
    }

    function chatName() {
      return (this.nick_name.length > 0) ? this.nick_name : this.first_name;
    }

    function fullName() {
      return this.first_name + ' ' + this.last_name;
    }

    function resendInvitation() {
      var defer = $q.defer();
      // $log.debug('[fob-user-model] RESENDING INVIATION: ' + 'fobs/' + this.fob_id + '/users/' + this.fob_user_id + '/invite');
      Restangular.one('fobs/' + this.fob_id + '/users/' + this.fob_user_id + '/resend').put().then(
        function() {
          defer.resolve();
        },
        function(error) {
          defer.reject(error);
        }
      );
      return defer.promise;
    }

    function store() {
      var defer = $q.defer();
      var self = this;

      // HOME_FEATURE MASK -


      var attributes = {
        "first_name": self.first_name,
        "last_name": self.last_name,
        "email": self.email,
        "fob_user_id": self.fob_user_id,
        "fob_user_status_id": self.fob_user_status_id
      };


      Restangular.one('fobs', self.fob_id).one('user', self.fob_user_id).customPUT(attributes)
        .then(function() {
          defer.resolve();
        }, function(error) {
          defer.reject(error);
        });

      return defer.promise;

    }


    function updateFeatureMaskSettings() {
      var self = this;
      var defer = $q.defer();

      var settingsMessage = {
        home_feature_mask: this.home_feature_mask
      };
      Restangular.one('fobs', self.fob_id).one('users', self.fob_user_id).one('feature-mask').customPUT(settingsMessage).then(
        function(theMessages) {
          defer.resolve();
        },
        function(response) {
          defer.reject(response);
        });

      return defer.promise;
    }

    function toggleIntrusionFeatureBit() {
      if (this.hasIntrusionFeature()) {
        this.home_feature_mask &= ~FobUserFeatureMaskConst.BIT_INTRUSION;
      }else {
        this.home_feature_mask |= FobUserFeatureMaskConst.BIT_INTRUSION;
      }
    }

    function toggleArmDisarmFeatureBit() {
      if (this.hasArmDisarmFeature()) {
        this.home_feature_mask &= ~FobUserFeatureMaskConst.BIT_SECURITY_ARMDISARM;
      }else {
        this.home_feature_mask |= FobUserFeatureMaskConst.BIT_SECURITY_ARMDISARM;
      }
    }

    function toggleActivityFeatureBit() {
      if (this.hasActivityBasicFeature()) {
        this.home_feature_mask &= ~FobUserFeatureMaskConst.BIT_ACTIVITY_BASIC;
      }else {
        this.home_feature_mask |= FobUserFeatureMaskConst.BIT_ACTIVITY_BASIC;
      }
    }

    function toggleHouseholdMemberFeatureBit() {
      if (this.hasHouseholdMemberFeature()) {
        this.home_feature_mask &= ~FobUserFeatureMaskConst.BIT_HOUSEHOLD_MEMBER;
      }else {
        this.home_feature_mask |= FobUserFeatureMaskConst.BIT_HOUSEHOLD_MEMBER;
      }
    }

    function toggleImmediateIntrusionNotificationFeatureBit() {
      if (this.hasImmediateIntrusionNotificationFeature()) {
        this.home_feature_mask &= ~FobUserFeatureMaskConst.BIT_IMMEDIATE_INTRUSION_NOTIFICATION;
      }else {
        this.home_feature_mask |= FobUserFeatureMaskConst.BIT_IMMEDIATE_INTRUSION_NOTIFICATION;
      }
    }

    //
    // function updateIntrusionFeatureMaskBit(featureMask, hasBit) {
    //   if (hasBit) {
    //     this.home_feature_mask |= FobUserFeatureMaskConst.BIT_INTRUSION;
    //   } else {
    //     this.home_feature_mask &= ~FobUserFeatureMaskConst.BIT_INTRUSION;
    //   }
    // }


    // private functions

    function _isFeatureMaskBitSetForFobUser(checkBit) {
      // $log.debug('[fob-user-model] HOME FEATURE MASK: '+ this.home_feature_mask);
      // $log.debug('[fob-user-model] CHECK BIT: '+ checkBit);
      // $log.debug('[fob-user-model] (this.home_feature_mask & checkBit) === checkBit: '+ ((this.home_feature_mask & checkBit) === checkBit));
      return ((this.home_feature_mask & checkBit) === checkBit);
    }

    function _generateImageUrl() {
      this.imageUrl = ServerService2.getFobImageURLForS3NameWithSize(this.image_url, 'ts');
      $log.debug("fobUserID:" + this.fob_user_id + " url:" + this.imageUrl);
    }



  }

})();
