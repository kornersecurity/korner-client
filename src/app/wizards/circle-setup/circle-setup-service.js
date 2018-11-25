(function() {
  'use strict';

  /*jshint validthis: true */

  angular
    .module('app.wizard.circle')
    .service('CircleSetupService', circleSetupService);

  /* @ngInject */
  function circleSetupService($rootScope, $q, Restangular, gettext, $log) {

    // list of exported public methods
    return {
      inviteCircleMembers:inviteCircleMembers,
    };

    function inviteCircleMembers(data) {
      var defer = $q.defer();
      var self = this;
      var postData = {};
      var invitees = [];
      var inviteSubject = gettext('Korner - Circle Member Invitation');

      for(var i in data.invitees)
      {
        var invitee = data.invitees[i];
        $log.debug("POSTING INVITED USER: "+invitee.first_name, invitee.last_name, data.message);
        invitees.push({
          first_name:      invitee.first_name,
          last_name:       invitee.last_name,
          email:          invitee.email,
          invite_subject: inviteSubject,
          invite_message: data.message
        });
      }

      postData.invitees = invitees;
      Restangular.all('fobs/'+data.fob_id+'/users').post(postData).then(
        function(newFobUsersData) {
          // success(newFobUsersData);
            defer.resolve();
        },
        function(res) {
          defer.reject(res);
          // error(res);
        }
      );
      return defer.promise;
    }
  }
})();
