(function() {
  'use strict';

  /*jshint validthis: true */

  angular
    .module('app.core')
    .factory('FobModel', fobModel)

  .constant('fobStateConst', {
    unknown: 0x0,
    disarmed: 0x1,
    armed: 0x2,
    triggeredAlarm: 0x4,
    triggeredSilent: 0x8,
    pairing: 0x10,
    firmwareUpdateCritical: 0x20,
    firmwareUpdate: 0x40,
    armPending: 0x80,
    upgradeFailed: 0x1000,
    upgradePending: 0x2000,
    chimeEnabled: 0x4000,
    buzzerEnabled: 0x8000,
    troubleLocalNet: 0x10000,
    troubleServerConn: 0x20000,
    troubleRadioNet: 0x40000,
    disconnected: 0x80000,
    connected: 0x100000,
    missing: 0x200000,
    armDelayEnabled: 0x400000,
  });


  /* @ngInject */
  function fobModel($rootScope, $q, $log, FobUserCollection, FobTagCollection,
    FobExtenderCollection, KornerMsgHelpers, NotificationService, gettext,
    FobMessageCollection, FobActivityCollection, ServerService2,
    FobAddressModel, FobIntrusionModel, server, clientUpdateEventConst,
    Restangular, fobMessageTypeConst, KornerStateHelpers, Upload,
    requiredFirmwareConst) {

    function FobModel(fobData) {
      if (fobData) {
        angular.extend(this, fobData);
        this.statusDescription = 'unknown';
        this.isInitialized = false;
        this.isUpdatingFirmware = false;
        this.isAccountOwner = false;
        this.statusSeverity = '';
        this._refreshActivityQueryPending = false;
        this.client_data = JSON.parse(fobData.client_data);
        this.server_data = JSON.parse(fobData.server_data);
        if(this.client_data.version === null) {
          this.client_data.version = 1;
        }

        if(this.server_data.dailySecuritySchedule === undefined) {
          this.server_data.dailySecuritySchedule = {
            "enabled": true,
            "pushNotify": true,
            "emailNotify": false,
            "withIssues": true,
            "schedule": [],
          };
        }

        // Private Data

        this.users = new FobUserCollection(this.fob_id);
        this.tags = new FobTagCollection(this.fob_id);
        this.extenders = new FobExtenderCollection(this.fob_id);
        this.messages = new FobMessageCollection(this.fob_id);
        this.activities = new FobActivityCollection(this);
        this.address = new FobAddressModel(this.fob_id);

        this._initializedDeferred = $q.defer();

        // TODO REMOVE REMOVE REMOVE when dan finishes the server!!!!
        // this.server_data = {
        //   "dailySecuritySchedule":{
        //     "notify": true,
        //     "enabled": true,
        //     "utcOffset": -9,
        //     "schedule": [
        //       {"time":510, "action":1, "dayMask":40},
        //       {"time":690, "action":2, "dayMask":5},
        //       {"time":1300, "action":1, "dayMask":8},
        //       {"time":1340, "action":2, "dayMask":103}
        //     ]
        //   }
        // };
      }
    }

    FobModel.prototype = {
      onInitialize: onInitialize,
      hasInitialized: hasInitialized,

      onActivate: onActivate,
      onDeactivate: onDeactivate,
      onBackground: onBackground,
      onDestroy: onDestroy,

      // public method
      store: store,
      mobilePictureUpload: mobilePictureUpload,
      webPictureUpload: webPictureUpload,
      updateFobSettings: updateFobSettings,
      updateServerData: updateServerData,
      refreshState: refreshState,
      canAddExtender: canAddExtender,
      getFobProfiles: getFobProfiles,
      includeExcludeTags: includeExcludeTags,

      isConnected: isConnected,
      isArmed: isArmed,
      isDisarmed: isDisarmed,
      isTriggered: isTriggered,
      isSounding: isSounding,
      isMissing: isMissing,
      isReadyToArm: isReadyToArm,
      isArmPending: isArmPending,
      isFirmwareUpdating: isFirmwareUpdating,
      isPairing: isPairing,
      getFobUser: getFobUser,
      formattedFirmwareVersion: formattedFirmwareVersion,


      isIntrusionActive: isIntrusionActive,
      isCurrentUserInvitedToIntrusion: isCurrentUserInvitedToIntrusion,


      // Private Methods

      _generateFobStatusDescription: _generateFobStatusDescription,
      _subscribeToListeners: _subscribeToListeners,
      _generateImageUrl: _generateImageUrl,
      _reloadFobProperties: _reloadFobProperties,
      _generateQualityOfLifeValues: _generateQualityOfLifeValues,
      _refreshActivitiesForSocketCommunication: _refreshActivitiesForSocketCommunication,
      _checkForIntrusion: _checkForIntrusion,
      _includeTags: _includeTags,
      _excludeTags: _excludeTags,
      _getActiveZoneName: _getActiveZoneName,
    };

    return FobModel;

    function onInitialize() {
      var self = this;

      var promises = [];

      promises.push(self.users.onInitialize());
      promises.push(self.tags.onInitialize());
      promises.push(self.extenders.onInitialize());
      promises.push(self.messages.onInitialize());
      promises.push(self.address.onInitialize());
      promises.push(self.activities.onInitialize());


      $q.all(promises).then(
        function() {
          $log.debug('[FobModel] ready ' + self.fob_id);
          $log.debug(self);

          self._generateImageUrl();
          self._generateFobStatusDescription();
          self._subscribeToListeners();
          self._generateQualityOfLifeValues();
          self._initializedDeferred.resolve();
          self.isInitialized = true;
          self._checkForIntrusion();
          // self.firmware_release = '1000003'; // FOR TESTING ONLY!!!!!!!!!
        },
        function(error) {
          $log.debug(error);

          self._initializedDeferred.reject(error);
        }
      );

      return self._initializedDeferred.promise;
    }


    function hasInitialized() {
      return this._initializedDeferred;
    }




    function onActivate() {
      // intialization on Startup or Activate
      // if we have activat 1 minutes {
      //
      // }
      //
      //
      // return this._initializedDeferred.promise;
    }

    function onDestroy() {
      this.destroyPairHandler();
      this.destroyClircleChatHandler();
      this.destroyFobIntrusionInviteHandler();
      this.destroyTagHandler();
      this.destroyStatusHandler();
      this.destroyInfoStatusHandler();

      this.destroyPairHandler = null;
      this.destroyClircleChatHandler = null;
      this.destroyFobIntrusionInviteHandler = null;
      this.destroyTagHandler = null;
      this.destroyStatusHandler = null;
      this.destroyInfoStatusHandler = null;
    }

    function onDeactivate() {
      //intialization on Startup or Activate
      //this.lastAcivte = time.now();
      //var deferred = $q.defer();
      //return deferred.promise;
    }


    function onBackground() {
      //this._initializedDeferred = $q.defer();
    }

    // Public Methods

    function store() {
      var defer = $q.defer();
      var self = this;

      var attributes = {
        "fob_name": this.fob_name,
        "client_data": angular.toJson(this.client_data),
        "server_data": angular.toJson(this.server_data)
      };

      Restangular.one('fobs', this.fob_id).customPUT(attributes)
        .then(function() {
          self._generateImageUrl();
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

      Restangular.one('fobs', this.fob_id).get()
        .then(function(res) {
          self.fob_state = res.fob_state;
          self._generateFobStatusDescription();
          // $log.debug('FOB STATE: '+self.fob_state);
          for (var tagIdx in self.tags.tags){
            promises.push(self.tags.tags[tagIdx].refreshState());
          }

          $q.all(promises).then(function() {
            defer.resolve();
          });

          defer.resolve();
        }, function(error) {
          defer.reject(error);
        });

      return defer.promise;
    }

    function updateFobSettings() {
      var self = this;
      var defer = $q.defer();


      var settingsMessage = {
        doorchime_enabled: this.doorchime_enabled,
        buzzer_enabled: this.buzzer_enabled,
        arm_delay: this.arm_delay
      };
      Restangular.one('fobs', self.fob_id).one('settings').customPUT(settingsMessage).then(
        function(theMessages) {
          defer.resolve();
        },
        function(response) {
          defer.resolve(response.status);
        });

      return defer.promise;
    }

    function updateServerData(){
      return this.store();
    }

    function getFobProfiles(){
      if(this.client_data.fobProfiles === undefined) {
        this.client_data.fobProfiles = [
        {
          profileName: gettext('All Tags Zone'),
          tags:this.tags.getTagsEUI64Array(),
          isActive: true,
        }];
      }
      return this.client_data.fobProfiles;
    }

    function includeExcludeTags(tags){
      var self = this;
      var tagsIncluded = [];
      var tagsExcluded = [];
      var defer = $q.defer();
      var promises = [];

      for(var t in tags) {
        if(tags[t].isSelected) {
          tagsIncluded.push(tags[t].eui64);
        } else {
          tagsExcluded.push(tags[t].eui64);
        }
      }
      $log.debug('[fobModel] INCLUDING TAGS: ', tagsIncluded);
      $log.debug('[fobModel] EXCLUDING TAGS: ', tagsExcluded);

      promises.push(self._includeTags(tagsIncluded));
      promises.push(self._excludeTags(tagsExcluded));

      $q.all(promises).then(function() {
        defer.resolve();
        self._generateFobStatusDescription();
      });
      return defer.promise;
    }

    function _includeTags(tagsIncluded){
      var self = this;
      var defer = $q.defer();
      var settingsMessage = {
        tags: tagsIncluded
      };
      Restangular.one('fobs', self.fob_id).one('tags-include').customPUT(settingsMessage).then(
        function(theMessages) {
          defer.resolve();
        },
        function(response) {
          defer.resolve(response.status);
        });

      return defer.promise;
    }

    function _excludeTags(tagsExcluded){
      var self = this;
      var defer = $q.defer();
      var settingsMessage = {
        tags: tagsExcluded
      };
      Restangular.one('fobs', self.fob_id).one('tags-exclude').customPUT(settingsMessage).then(
        function(theMessages) {
          defer.resolve();
        },
        function(response) {
          defer.resolve(response.status);
        });

      return defer.promise;
    }

    function _getActiveZoneName(){
      for(var profile in this.client_data.fobProfiles) {
        if(this.client_data.fobProfiles[profile].isActive){
          return this.client_data.fobProfiles[profile].profileName;
        }
      }
      return '';
    }

    function mobilePictureUpload(picUri, picData) {

      var self = this;
      var defer = $q.defer();

      // $log.debug('[fob-service] QUERY: UPLOAD FOB PIC: ' + picUri);

      var options = new FileUploadOptions();
      var fileTransfer = new FileTransfer();
      var serverUri = encodeURI(server.getBaseUrl() +
        "/fobs/" +
        this.fob_id +
        "/image-upload");

      options.fileKey = "file";
      options.fileName = picUri.substr(picUri.lastIndexOf('/') + 1).split('?')[0]; // getFobByFobId(fobId).image_name;
      options.mimeType = "image/jpeg";
      options.chunkedMode = false;

      fileTransfer.upload(picUri, serverUri, function(res) {
        $log.debug('[fob-service] PIC UPLOADED: ' + res);

        var fileName = JSON.parse(res.response);

        if (res.response && fileName.s3_name) {
          self.image_name = fileName.s3_name; //res.response.split('"')[1].split('"')[0];
          self._generateImageUrl();
          defer.resolve();
        } else {
          defer.reject();
        }

      }, function(err) {

        for (var e in err) {
          $log.debug('[fob-service] PIC UPLOAD ERROR: ' + e + ": " + err[e]);
        }
        defer.reject(err);

      }, options, false);


      return defer.promise;
    }


    function webPictureUpload(picUri, picData) {
      console.log(this);
      var self = this;
      var defer = $q.defer();
      var serverUri = encodeURI(server.getBaseUrl() +
        "/fobs/" +
        this.fob_id +
        "/image-upload");
      // optional: set default directive values
      //Upload.setDefaults( {ngf-keep:false ngf-accept:'image/*', ...} );
      Upload.setDefaults( {
        'ngf-keep': false,
        'ngf-accept': 'image/*',
      } );


      Upload.upload({
          url: serverUri,
          file: picData,
          // fileName: picUri.substr(picUri.lastIndexOf('/') + 1).split('?')[0],
          chunkedMode: false,
          mimeType: "image/*"
        }
      ).progress(function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          $log.debug('[fob-service] WEB PIC UPLOAD PROGRESS: ' + progressPercentage + '% ' + evt.config.file.name);
        }
      ).success(function (data, status, headers, config) {
          if (data && data.s3_name) {
            self.image_name = data.s3_name; //res.response.split('"')[1].split('"')[0];
            self._generateImageUrl();
            defer.resolve(data);
            $log.debug('[fob-service] WEB PIC UPLOADED: ' + config.file.name + ' - RESPONSE: ' + data.s3_name);
          } else {
            defer.reject();
          }
        }
      ).error(function (data, status, headers, config) {
          defer.reject(status);
          $log.debug('[fob-service] WEB PIC UPLOAD ERROR: ' + status);
        }
      );

      return defer.promise;
    }

    function canAddExtender(){
      return (this.firmware_release >= requiredFirmwareConst.EXTENDER_SETUP);
      // return true;
    }

    function isConnected() {
      return KornerStateHelpers.isFobStateConnected(this.fob_state);
    }

    function isArmed() {
      return KornerStateHelpers.isFobStateArmed(this.fob_state);
    }

    function isDisarmed() {
      return KornerStateHelpers.isFobStateDisarmed(this.fob_state);
    }

    function isTriggered() {
      return KornerStateHelpers.isFobStateTriggered(this.fob_state);
    }

    function isSounding() {
      return KornerStateHelpers.isFobStateTriggeredAlarming(this.fob_state);
    }

    function isMissing() {
      return KornerStateHelpers.isFobStateMissing(this.fob_state);
    }

    function isArmPending() {
      return KornerStateHelpers.isFobStateArmPending(this.fob_state);
    }


    function isReadyToArm() {
      return !this.tags.hasIssue;
    }

    function isFirmwareUpdating() {
      return KornerStateHelpers.isFobStateFirmwareUpdating(this.fob_state);
    }

    function isPairing() {
      return KornerStateHelpers.isFobStatePairing(this.fob_state);
    }

    // Private Methods

    function _subscribeToListeners() {
      var self = this;


      this.destroyInfoStatusHandler = $rootScope.$on(fobMessageTypeConst.INFO, function(event, msg) {
        if (msg.FobID === self.fob_id) {
          self._reloadFobProperties();
          NotificationService.notify();
          $log.debug('[fob-model] REFRESHING FOB PROPS');
        }
      });

      this.destroyStatusHandler = $rootScope.$on(fobMessageTypeConst.STATUS, function(event, msg) {
        if (msg.FobID === self.fob_id) {
          self.fob_state = msg.Payload.State;
          self._generateFobStatusDescription();
          self._refreshActivitiesForSocketCommunication();
          NotificationService.notify();
          $rootScope.$emit(clientUpdateEventConst.FOB_STATE_CHANGE, msg.FobID, msg.Payload.State);
          self._checkForIntrusion();
        }
      });

      this.destroyTagHandler = $rootScope.$on(fobMessageTypeConst.TAG, function(event, msg) {

        if (msg.FobID === self.fob_id) {


          self.tags.processTagStatusMsg(msg);
          self._refreshActivitiesForSocketCommunication();
          self._generateFobStatusDescription();

          NotificationService.notify();

          // emit message with tagID (device_id)
          $rootScope.$emit(clientUpdateEventConst.TAG_STATE_CHANGE, msg.FobID, msg.Payload.DeviceID, msg.Payload.State);
        }
      });

      this.destroyExtTagHandler = $rootScope.$on(fobMessageTypeConst.TAG_EXT_STATUS, function(event, msg) {

        if (msg.FobID === self.fob_id) {


          self.tags.processTagStatusMsg(msg);
          self._refreshActivitiesForSocketCommunication();
          self._generateFobStatusDescription();

          NotificationService.notify();
          $log.debug('[fob-model] EXTENDER SATE CHANGED: ', msg);   

          // emit message with tagID (device_id)
          $rootScope.$emit(clientUpdateEventConst.TAG_STATE_CHANGE, msg.FobID, msg.Payload.DeviceID, msg.Payload.State);
        }
      });

      this.destroyPairHandler = $rootScope.$on(fobMessageTypeConst.PAIRED, function(event, msg) {
        if (self.fob_id === msg.FobID) {
          if(msg.Payload.DeviceEUI64.indexOf('dc:e0:26:f1') > -1) {
            self.tags.loadRefreshTags().then(function() {
              // emit message with tagID (device_id)
              $log.debug('[fob-model] TAG PAIRED');
              $rootScope.$emit(clientUpdateEventConst.TAG_PAIRED, msg.FobID, msg.Payload.DeviceID, msg.Payload.DeviceEUI64);
            }, function(status) {

            });
          } else if(msg.Payload.DeviceEUI64.indexOf('dc:e0:26:f0') > -1) {
            self.extenders.loadRefreshExtenders().then(function() {
              // emit message with extenderID (device_id)
              $log.debug('[fob-model] EXTENDER PAIRED');
              $rootScope.$emit(clientUpdateEventConst.EXTENDER_PAIRED, msg.FobID, msg.Payload.DeviceID, msg.Payload.DeviceEUI64);
            }, function(status) {

            });
          } else {
            $log.debug('[fob-model] UNKOWN DEVICE PAIRED');
            $rootScope.$emit(clientUpdateEventConst.UNKOWN_DEVICE_PAIRED, msg.FobID, msg.Payload.DeviceID, msg.Payload.DeviceEUI64);
          }
        }
      });

      this.destroyFobIntrusionInviteHandler = $rootScope.$on(clientUpdateEventConst.FOB_INTRUSION_INVITE, function(event, fobID) {
        if (self.fob_id === fobID) {
          self._checkForIntrusion();
        }
      });

      this.destroyClircleChatHandler = $rootScope.$on(clientUpdateEventConst.CIRCLE_CHAT_REFRESH_REQUIRED, function(event, fobID, refreshAll) {
        if (self.fob_id === fobID) {
          if (refreshAll) {
            self.messages.refreshAllMessages();
          } else {
            self.messages.refreshMessages();
          }
        }
      });
    }

    function formattedFirmwareVersion() {
      var major = Math.floor(this.firmware_release / 1000000);
      var minor = this.firmware_release % 1000000;

      // major = major.toString().split('.')[1].replace(/^0+/, '');
      // console.log('[ksFobAddressWidget] MAJOR VERSION: ' +major);

      return major +'.'+ minor;
    }

    function _generateFobStatusDescription() {
      this.statusDescription = KornerMsgHelpers.getFobStateDescription(this);

      var extraMsg = "";
      if (this.tags.hasIssue) {
        if (KornerStateHelpers.isFobStateDisarmed(this.fob_state) || KornerStateHelpers.isFobStateFirmwareUpdating(this.fob_state)) {
          extraMsg = gettext('not ready');
        } else {
          extraMsg = gettext('with issues');
        }
      }
      if (extraMsg.length > 0 ) {
        this.statusDescription += " - " + gettext(extraMsg);
      }

      this.statusSeverity = KornerMsgHelpers.getStateSeverityForFob(this);

      if (KornerStateHelpers.isFobStateArmed(this.fob_state)) {
        var activeZoneName = this._getActiveZoneName();
        if(activeZoneName !== '') {
          this.statusDescription += gettext(" (Zone: ") + activeZoneName+")";
        }
      }
    }



    function _generateImageUrl() {
      this.imageUrl = ServerService2.getFobImageURLForS3NameWithSize(this.image_name);
      this.imageUrl += '?nocache=' + Math.floor((Math.random() * 10000) + 1);
      // console.log("################# SETTTTING NEW IMAGE URL: "+this.imageUrl+" ##################");
    }

    function _reloadFobProperties() {
      var defer = $q.defer();
      var self = this;

      Restangular.one('fobs', self.fob_id).get()
        .then(function(fob) {
          angular.extend(self, fob);

          // update values based on properties
          self._generateImageUrl();
          self._generateFobStatusDescription();

          defer.resolve();
        }, function(error) {
          defer.reject(error);
        });

      return defer.promise;
    }

    function _generateQualityOfLifeValues() {
      // add stuff that will not change, so we only need to process once
      this.fobUser = this.users.getUserByAccountID($rootScope.user.account_id);
      this.isAccountOwner = this.fobUser.isOwner();

    }

    function _refreshActivitiesForSocketCommunication() {
      var self = this;
      // do we have a penidng query
      if (!self._refreshActivityQueryPending) {
        self.activities.refreshActivities()
          .then(function() {
            // query succesdful clear pending flag
            self._refreshActivityQueryPending = false;
          }, function(errorStatus) {
            //query failed. clear pending flag
            self._refreshActivityQueryPending = false;
            // refresh promise failed, try again in n seconds
            if(errorStatus !== 401){
            setTimeout(function() {
              if (!self._refreshActivityQueryPending) {
                self._refreshActivitiesForSocketCommunication();
                // self._refreshActivityQueryPending = true;
              }
            }, 1000);
            }
          });
      }
    }

    function _checkForIntrusion() {
      var self = this;

      if (this.isTriggered()) {
        if (this.intrusion === undefined) {
          this.intrusion = new FobIntrusionModel(this.fob_id);
          this.intrusion.onInitialize().then(function() {
              if (self.isCurrentUserInvitedToIntrusion()) {
                // emit fob intrusion message
                $rootScope.$emit(clientUpdateEventConst.FOB_INTRUSION, self.fob_id);
              }
            },
            function(error) {});
        } else if(this.intrusion.invites.loadRefreshIntrusionInvites){
          this.intrusion.invites.loadRefreshIntrusionInvites().then(function() {
            if (self.isCurrentUserInvitedToIntrusion()) {
              // emit fob intrusion message
              $rootScope.$emit(clientUpdateEventConst.FOB_INTRUSION, self.fob_id);
            }
          });
        }
      } else {
        this.intrusion = undefined;
      }

    }

    function getFobUser() {
      return this.users.getUserByAccountID($rootScope.user.account_id);
    }

    function isIntrusionActive() {
      if (this.intrusion !== undefined) {
        return this.intrusion.isIntrusionActive();
      }

      return false;
    }

    function isCurrentUserInvitedToIntrusion() {

      if (this.intrusion !== undefined) {
        return this.getFobUser().hasImmediateIntrusionNotificationFeature() || this.intrusion.isUserInvited(this.getFobUser().fob_user_id);
      }
      return false;
    }

  }

})();
