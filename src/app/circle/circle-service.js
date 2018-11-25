App.service('circleService', [
  '$rootScope',
  '$state',
  '$q',
  'Restangular',
  function(
    $rootScope,
    $state,
    $q,
    Restangular
  ) {

    //  /#/circle/invitation-declined/{fobUserID}
    //  /#/circle/invitation-creation/{AccountID}
    //  /#/circle/invitation-accepted


    var theService = {

      decline: function(reason, token, success, error) {
        Restangular.all('circle/decline/'+ token).post(reason).then(
          function() {
            success();
          },
          function(res) {
            error(res);
          }
        );
      },

      updateAccount: function(registrationInfo, token, success, error) {
        Restangular.all('circle/account/'+ token).post(registrationInfo).then(
          function() {
            success();
          },
          function(res) {
            error(res);
          }
        );
      },

      getAccountInfo:    function(token, success, error) {
        Restangular.one('circle/account/'+ token).get().then(
          function(res) {
            success(res);
          },
          function(res) {
            error(res);
          }
        );
      }
    };

    return theService;

  }
]);
