//
// client-protocol-service.js
//
(function() {
  'use strict';

  angular.module('app.core')
    .constant('serverMessageConst', {
      FobMessage: 0x10000,

      IntrusionMessage: 0x10010,
      IntrusionInviteMessage: 0x10011,

      CircleInvitationMessage: 0x10020,
      CircleChatMessage: 0x10021,
      CirclePermissionMessage: 0x10022,
      CircleRemovalMessage: 0x10023,

      MaintenanceMessage: 0x10024,

      TagSetupStarted: 0x10025,
      TagSetupCompleted: 0x10026,
      TagSetupCancelled: 0x10027,

      CircleChatUpdateMessage: 0x10028,
      CircleChatDeleteMessage: 0x10029,

      IntrusionChatMessage: 0x10030,
      IntrusionChatUpdateMessage: 0x10031,
      IntrusionChatDeleteMessage: 0x10032,

      PingMessage: 0xA0000001,
      PongMessage: 0xA0000002,
      AccountReload: 0xA0000003,

      InternalReload: 0xF0000000,
      InternalError: 0xF0000001,

      //TODO Ask dan about this
      ExtenderSetupStarted: 0x10033,
      ExtenderSetupCompleted: 0x10034,
      ExtenderSetupCancelled: 0x10035,

    });


  angular.module('app.core')
    .service('clientProtocolService', clientProtocolService);

  /* @ngInject */
  function clientProtocolService(
    $rootScope,
    fobCmdMessageConst,
    fobMessageTypeConst,
    clientUpdateEventConst,
    $log,
    serverMessageConst,
    $state,
    connection
  ) {

    var pingAt = new Date();
    var removeSocketMessageReceivedHandler;

    var pingPongTimer = setInterval(function() {
      var delta = new Date() - pingAt;
      if (delta >  145 * 1000) {
        restartClient();
      }
    }, 150 * 1000);

    // outgoing client messages
    function buildOutgoingFobMessage(cmdId, fob, tags, settings) {
      var outgoingMessage = {
        'ServerMsgID': serverMessageConst.FobMessage,
        'MsgID': cmdId,
        'FobID': fob.fob_id,
      };

      if (tags) {
        outgoingMessage.Payload = tags;
      }

      if (settings) {
        outgoingMessage.Payload = settings;
      }

      return outgoingMessage;
    }

    function buildOutgoingSetupMessage(msg, fob) {
      var outgoingMessage = {
        'ServerMsgID': msg,
        'MsgID': 0,
        'FobID': fob.fob_id,
      };

      return outgoingMessage;
    }




    // incoming client messages

    function processIncomingMessage(msg) {
      switch (msg.ServerMsgID) {
        case serverMessageConst.FobMessage:
          console.log('[client-protocol-service] MSG ID: ' + msg.MsgID);
          $rootScope.$emit(msg.MsgID, msg);
          break;

          // case serverMessageConst.IntrusionMessage:
          //   $rootScope.$emit(msg.ServerMsgID, msg);
          //   break;

        case serverMessageConst.IntrusionInviteMessage:
          $rootScope.$emit(clientUpdateEventConst.FOB_INTRUSION_INVITE, msg.FobID);
          break;

        case serverMessageConst.IntrusionChatMessage:
        case serverMessageConst.IntrusionChatUpdateMessage:
        case serverMessageConst.IntrusionChatDeleteMessage:
          $rootScope.$emit(clientUpdateEventConst.INTRUSION_CHAT_REFRESH_REQUIRED,
            msg.FobID, (msg.ServerMsgID !== serverMessageConst.IntrusionMessage));
          break;

        case serverMessageConst.CircleChatMessage:
        case serverMessageConst.CircleChatUpdateMessage:
        case serverMessageConst.CircleChatDeleteMessage:
          $rootScope.$emit(clientUpdateEventConst.CIRCLE_CHAT_REFRESH_REQUIRED,
            msg.FobID, (msg.ServerMsgID !== serverMessageConst.CircleChatMessage));
          break;

        case serverMessageConst.InternalError:
          processInternalError(msg);
          break;
        case serverMessageConst.PingMessage:
          pingAt = new Date();
          console.log(">>>>PING PING PING <<<<");
          break;
        case serverMessageConst.AccountReload:
          console.log("RELOAD CLIENT!!!");
          restartClient();
          break;
        case serverMessageConst.InternalReload:
          // ignore - happens when a account accepts invitiation or setups a fob
          break;
        default:
          $log.debug("[client-protocol-service] Server MsgID:" + msg.ServerMsgID + " not handled");
      }
    }



    function stopPingPongTimer() {
      if(pingPongTimer){
        clearInterval(pingPongTimer);
        pingPongTimer = null;
      }
    }

    function logOut() {
      console.log('WE SHOULD LOG USER OUT!!!');
      stopPingPongTimer();
      $rootScope.logOut();
    }

    function restartClient() {
      console.log('RESTARTING APP');

      // if(removeSocketMessageReceivedHandler){
      //   removeSocketMessageReceivedHandler();
      // }
      connection.disconnect();

      stopPingPongTimer();
      $rootScope.restart();

    }

    function processInternalError(msg) {
      $log.debug('[client-protocol-service] Server Error message error: ' + msg.Payload.ErrorDescription + ' (' +
        msg.Payload.ErrorID + ')');
    }


    console.log('[client-protocol-service] SUBSCRIBING TO SOCKET_MESSAGE_RECEIVED');
    removeSocketMessageReceivedHandler = $rootScope.$on(clientUpdateEventConst.SOCKET_MESSAGE_RECEIVED, function(event, message) {
      processIncomingMessage(message);
    });


    return {
      buildOutgoingFobMessage: buildOutgoingFobMessage,
      buildOutgoingSetupMessage: buildOutgoingSetupMessage,
      processIncomingMessage: processIncomingMessage
    };

  }
})();
