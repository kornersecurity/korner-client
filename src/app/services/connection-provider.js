(function() {
  'use strict';

  App.provider('connection', function() {
    var uri = {};
    var ws = {};

    return {
      setSocketUri: function(socketUri) {
        uri = socketUri;
      },

      $get: [
        '$rootScope',
        'clientUpdateEventConst',
        '$log',
        'appSettingsConst',
        'Restangular',
        '$q',
        function(
          $rootScope,
          clientUpdateEventConst,
          $log,
          appSettingsConst,
          Restangular,
          $q
        ) {
          return {

            isNetworkAvailable: function() {
              var available = true;
              if ($rootScope.appRuntime.isMobileApp === false) {
                return true;
              }
              if (navigator !== undefined && navigator !== null &&
                navigator.connection !== undefined && navigator.connection !== null) {
                if (navigator.connection.type === Connection.NONE) {
                  available = false;
                }
              }
              return available;
            },

            connect: function() {
              var protocol = null;
              var options = {
                debug: appSettingsConst.debug,
                automaticOpen: true,
                reconnectInterval: 3000,
                reconnectDecay: 1.5,
                timeoutInterval: 2000,
                maxReconnectAttempts: null
              };
              ws = new ReconnectingWebSocket(uri, protocol, options);


              ws.onconnecting = function() {};

              ws.onopen = function() {
                $rootScope.$emit(
                  clientUpdateEventConst.SOCKET_STATE_CHANGE,
                  ws.readyState);
              };

              ws.onmessage = function(message) {
                var parsedMessage = JSON.parse(message.data);

                //$log.debug('[connection] RECEIVED MESSAGE');
                //$log.debug(parsedMessage);

                $rootScope.$emit(
                  clientUpdateEventConst.SOCKET_MESSAGE_RECEIVED,
                  parsedMessage);
              };

              ws.onclose = function() {
                $rootScope.$emit(
                  clientUpdateEventConst.SOCKET_STATE_CHANGE,
                  ws.readyState);
              };

              ws.onerror = function(response) {
                $log.debug(response);
                $log.debug(ws.readyState);
                if(response.status === 404 || response.message === 'Not logged in') {
                  $state.go('app.account.login', {}, {});
                } else if(response.status === 401 || response.status === 0 || response.status === 503){
                  $state.go('app.startup.splash', {}, {});
                }

              };
            },

            isConnected: function() {
              return ws && ws.readyState === WebSocket.OPEN;
            },

            sendMessage: function(message) {

              if (this.isConnected()) {
                var stringifiedMessage = JSON.stringify(message);

                //$log.debug('[connection] SENDING MESSAGE');
                //$log.debug(stringifiedMessage);

                ws.send(stringifiedMessage);
              }
              // TODO: error...
            },

            disconnect: function() {

              ws.close();
              ws = {};
            },

            checkServerStatus: function(){

                var self = this;
                var defer = $q.defer();

                Restangular.one('utils/test').get().then(
                  function() {
                    defer.resolve();
                  },
                  function(res) {
                    defer.reject(res);
                  }
                );
                return defer.promise;
            }

          };
        }
      ]
    };
  });

})();
