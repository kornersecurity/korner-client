App.constant('accountStatusConst', {
  STATUS_ACTIVE: 'active',
  STATUS_DISABLED: 'disabled',
  STATUS_SUSPENDED: 'suspended',
  STATUS_VERFICATION: 'verification'
});

App.constant('requiredFirmwareConst', {
  TAG_DELETE: '1000001',
  EXTENDER_SETUP: '1000003'
});

// Refer to server code app/session/fob_protocol_constants.go


// // Fob Messages sent to the Server / Client
//
// const (
// 	fobMessageStatusID          = 0x1 // Fob Message [devicePayload w/ fob data]
// 	fobMessageTagID             = 0x2 // Tag Message [devicePayload w/ tag data]
// 	fobMessageExtenderID        = 0x3 // Extender Message [devicePayload w/ extender data]
// 	fobMessageTagsID            = 0x4 // Tags Messages [devicesPayload w/ tag data]
// 	fobMessageExtendersID       = 0x5 // Extenders Message [devicesPayload w/ extender data]
// 	fobMessagePairedID          = 0x6 // Pairing Message [devicePayload w/ tag data]
// 	fobMessageSettingsID        = 0x7 // Settings Message [settingsPayload w/ settings]
// 	fobMessageFirmwareID        = 0x8 // Firmware Message [firmwarePayload w/ status of procedure and device being updated]
// 	fobMessageInfoID            = 0x9 // Fob Info Message [infoPayload]
// 	fobMessageFirmwareRequestID = 0xA // request a specified firmware [firmwareRequestPayload w/ the type required]
// )
App.constant('fobMessageTypeConst', {
  STATUS: 0x1,
  TAG: 0x2,
  EXTENDER: 0x3,
  TAGS: 0x4,
  EXTENDERS: 0x5,
  PAIRED: 0x6,
  SETTINGS: 0x7,
  FIRMWARE: 0x8,
  INFO: 0x9,
  FIRMWARE_REQUEST: 0xA,
  EXTENDER_EXT_STATUS: 0x10,
  TAG_EXT_STATUS:0x11
});

// // Commands Messages sent to the Fob
// const (
// 	// Fob
// 	fobCommandInfoID   = 0x100 // Info about the Fob (version info at the moment)
// 	fobCommandStatusID = 0x101 // get fob status
//
// 	// Maintenance / Configuration
// 	fobCommandGetTagsID      = 0x110 // get list of tags
// 	fobCommandIncludeTagsID  = 0x111 // included tags [tagsPayload]
// 	fobCommandExcludeTagsID  = 0x112 // exclude tags [tagsPayload]
// 	fobCommandRemoveTagsID   = 0x113 // remove tags [tagsPayload]
// 	fobCommandGetExtendersID = 0x114 // get list of extenders
// 	fobCommandGetSettingsID  = 0x115 // get fob settings
// 	fobCommandSetSettingsID  = 0x116 // set fob settings [settingsPayload w/ fob setting data]
// 	fobCommandStartPairingID = 0x118 // starts tag pairing mode
// 	fobCommandStopPairingID  = 0x119 // stops tag pairing mode
//
// 	// Security Commands
// 	fobCommandArmID     = 0x120 // Arms the System
// 	fobCommandDisarmID  = 0x121 // Disarms the System
// 	fobCommandSilenceID = 0x122 // Silences the Alarm Audio if activated
//
// 	// Firmware
// 	fobCommandFirmwareUpdateFobID       = 0x130 // starts fob firmware update
// 	fobCommandFirmwareUpdateTagsID      = 0x131 // starts tag firmware update
// 	fobCommandFirmwareUpdateExtendersID = 0x132 // starts extender firmware update
// 	fobCommandFirmwareUpdateSytemID     = 0x133 // start system firmware update
// 	fobCommandFirmwareDownloadID        = 0x134 // server sends the specified firmware [firmwarePayload w/ firmware for the type requested]
//
// )
App.constant('fobCmdMessageConst', {
  GET_INFO: 0x100,
  GET_STATUS: 0x101,

  GET_TAGS: 0x110,
  INCLUDE_TAGS: 0x111,
  EXCLUDE_TAGS: 0x112,
  REMOVE_TAGS: 0x113,
  GET_EXTENDERS: 0x114,
  GET_SETTINGS: 0x115,
  SET_SETTINGS: 0x116,
  START_PAIRING: 0x118,
  STOP_PAIRING: 0x119,

  ARM_FOB: 0x120,
  DISARM_FOB: 0x121,
  SILENCE_FOB: 0x122,

  UPDATE_FOB_FIRMWARE: 0x130,
  UPDATE_TAG_FIRMWARE: 0x131,
  UPDATE_EXTENDER_FIRMWARE: 0x132,
  UPDATE_SYSTEM_FIRMWARE: 0x133,
  DOWNLOAD_FIRMWARE: 0x134
});


// Notification names for $on events emitted on updates from messages received
App.constant('clientUpdateEventConst', {

  // Broadcast events from connection service

  SOCKET_STATE_CHANGE: 'socketStateChange', // { state }
  SOCKET_MESSAGE_RECEIVED: 'socketMessageReceived', // { message }


  // Broadcast events from client protocol service

  FOB_STATE_CHANGE: 'fobStateUpdate', // fob state updated { fobId, fobState }

  TAGS_REFRESH: 'tagsRefresh', // fob tags updated { fobId }

  TAG_STATE_CHANGE: 'tagStateUpdate', // tag state updated { fobId, tagId, tagState }

  TAG_PAIRED: 'tagPaired', // new tag paired { fobId, tagId, tag_eui64 }
  EXTENDER_PAIRED: 'extenderPaired', // new extender paired { fobId, tagId, tag_eui64 }
  UNKOWN_DEVICE_PAIRED: 'unkownDevicePaired', // new unkown device paired { fobId, tagId, tag_eui64 }

  FOB_INTRUSION: 'fobIntrusion', // fob intrusion { fobId }

  FOB_INTRUSION_INVITE: 'fobIntrusionInvite', // fob intrusion invite { fobId }

  UI_REFRESH_REQUIRED: 'uiRefreshRequired',

  CIRCLE_CHAT_REFRESH_REQUIRED: 'circleChatRefreshRequired', // circle chat refresh { fobId, requeryAll }
  INTRUSION_CHAT_REFRESH_REQUIRED: 'intrusionChatRefreshRequired', // intrusion chat refresh { fobId, requeryAll }

  // Broadcast events from session service

  DATA_REFRESH_BEGIN: 'dataRefreshBegin',
  DATA_REFRESH_END: 'dataRefreshEnd',
});


//
// App.constant('wizardType', {
// 	FOB_SETUP:      0,
// 	EXTENDER_SETUP: 1,
// 	TAG_SETUP:      2,
// 	CIRCLE_SETUP:   3,
// 	WELCOME:        4,
//   HARDWARE:       5
// });

App.constant('googleMapsKeyConst', {
  KEY_VALUE: 'AIzaSyCvGRCzTiq_mvRUk5PXVzrvgD7-QDjduUk'
});


App.constant('tagPortalTypeConst', {
  UNKNOWN: 0,
  WINDOW: 1,
  DOOR: 2,
});

App.constant('tagPortalMechanismConst', {
  UNKNOWN: 0,
  SLIDE_UP_DOWN: 1,
  SLIDE_LEFT_RIGHT: 2,
  SWING_IN_OUT: 3,
});


App.constant('kornerNoticeTypeConst', {
  MAINTENANCE: 1,
  PROMOTION: 2,
  URGENT: 3,
  SOFTWARE_RELEASE: 4,
});
