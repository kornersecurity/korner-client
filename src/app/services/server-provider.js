//
// server-provider.js
//
App.provider('server', function() {

  var baseApiUrl = '/api/v1';
  var baseSocketUri = '/api/v1/socket/client?apikey=05Rq5tjk12pba2D2k12bZ3djJKJask29ufv08v09l2k2Hj2Ra82ScvCA';
  var baseURL;
  var socketURL;
  var connectionParms;

  function setConnectionParams(data) {
    connectionParms = data;
    console.log('SERVER PROVIDER SETTING PARAMS:');
    console.log(connectionParms);
  }

  function getBaseUrl() {
    if (baseURL === undefined) {
      baseURL = connectionParms.httpProtocol + connectionParms.endPoint + baseApiUrl;
    }
    return baseURL;
  }

  function getSocketUri() {
    if (socketURL === undefined) {
      socketURL = connectionParms.socketProtocol + connectionParms.endPoint + baseSocketUri;
    }

    return socketURL;
  }

  return {
    setConnectionParams: function(data) {
      return setConnectionParams(data);
    },

    getBaseUrl: function() {
      return getBaseUrl();
    },

    getSocketUri: function() {
      return getSocketUri();
    },

    $get: function() {

      return {
        setConnectionParams: function(data) {
          return setConnectionParams(data);
        },

        getBaseUrl: function() {
          return getBaseUrl();
        },

        getSocketUri: function() {
          return getSocketUri();
        }
      };
    }
  };

});
