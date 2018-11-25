//
// lookup-service.js
//
angular.module('app.core')
  .service('lookupService', [
  'Restangular',
function(
  Restangular) {

  var theService = {

    // get current server version
    getServerVersion: function(success) {

      return Restangular.one('utils/server-version').get().then(function(serverVersion) {
        success(serverVersion.response);
      });
    },


    // get current database version
    getDatabaseVersion: function(success) {

      return Restangular.one('utils/database-version').get().then(function(databaseVersion) {
        success(databaseVersion.response);
      });
    },


    // get image base url
    getImageServerUrl: function(success) {

      return Restangular.one('utils/image-base-url-path').get().then(function(imageServerUrl) {
        success(imageServerUrl.response);
      });
    },



    // get portal type lookup map
    getPortalTypeLookup: function(success) {

      return Restangular.all('lookup/fob-tag-portal-type').getList().then(function(portalTypes) {
        var portalTypeMap = {};

        for (var i = 0; i < portalTypes.length; i++) {
          var portalType = portalTypes[i];
          portalTypeMap[portalType.portal_type_id] = portalType.portal_type_name;
        }

        success(portalTypeMap);
      });
    },


    // get portal mechanism lookup map
    getPortalMechanismLookup: function(success) {

      return Restangular.all('lookup/fob-tag-portal-mechanism').getList().then(function(portalMechanisms) {
        var portalMechanismMap = {};

        for (var i = 0; i < portalMechanisms.length; i++) {
          var portalMechanism = portalMechanisms[i];
          portalMechanismMap[portalMechanism.portal_mechanism_id] = portalMechanism.portal_mechanism_name;
        }

        success(portalMechanismMap);
      });
    },


    // get activity type lookup map
    getActivityTypeLookup: function(success) {

      return Restangular.all('lookup/fob-activity-type').getList().then(function(activityTypes) {
        var activityTypeMap = {};

        for (var i = 0; i < activityTypes.length; i++) {
          var activityType = activityTypes[i];
          activityTypeMap[activityType.fob_activity_type_id] = activityType.fob_activity_type_name;
        }

        success(activityTypeMap);
      });
    },


    // get channel type lookup map
    getChannelTypeLookup: function(success) {

      return Restangular.all('lookup/fob-channel-type').getList().then(function(channelTypes) {
        var channelTypeMap = {};

        for (var i = 0; i < channelTypes.length; i++) {
          var channelType = channelTypes[i];
          channelTypeMap[channelType.channel_type_id] = channelType.channel_type_name;
        }

        success(channelTypeMap);
      });
    },

    // get intrusion status map
    getIntrusionStatusLookup: function(success) {

      return Restangular.all('lookup/fob-intrusion-status').getList().then(function(intrusionStatuses) {
        var intrusionStatusMap = {};

        for (var i = 0; i < intrusionStatuses.length; i++) {
          var intrusionStatus = intrusionStatuses[i];
          intrusionStatusMap[intrusionStatus.intrusion_status_id] = intrusionStatus.intrusion_status_name;
        }

        success(intrusionStatusMap);
      });
    },

    // get intrusion action taken map
    getIntrusionActionTakenLookup: function(success) {

      return Restangular.all('lookup/fob-intrusion-action-taken').getList().then(function(intrusionActionsTaken) {
        var intrusionActionTakenMap = {};

        for (var i = 0; i < intrusionActionsTaken.length; i++) {
          var intrusionActionTaken = intrusionActionsTaken[i];
          intrusionActionTakenMap[intrusionActionTaken.intrusion_action_taken_id] = intrusionActionTaken.intrusion_action_taken_name;
        }

        success(intrusionActionTakenMap);
      });
    },


  };


  return theService;
}
]);
