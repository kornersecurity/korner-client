(function() {
  'use strict';

  angular.module('app.intrusion')
    .controller('notifyCircleController', notifyCircleController);

  /* @ngInject */
  function notifyCircleController(
    $scope,
    $state,
    FobUserModel,
    userService,
    fobUserStatusConst,
    FobService2,
    $log,
    $mdDialog,
    ProfileService
  ) {
    $scope.message = '';
    ProfileService.getProfileInformation().then(
      function(profile){
        $scope.message = "Intrusion detected at "+profile.first_name+" "+profile.last_name+"'s home located at "+addressForMessage(FobService2.fob.address)+". " +
                        "Is there any way you can help with this?";
      }
    );
    $scope.circleMembers = FobService2.fob.users.getIntrusionUsersArray();

    for (var index in $scope.circleMembers) {
      $scope.circleMembers[index].invited = true;
    }

    function addressForMessage(fobAddress) {
      return fobAddress.line_1+" "+fobAddress.line_2+", "+fobAddress.city+", "+
              fobAddress.state+" "+fobAddress.zipcode+", "+fobAddress.country;
    }

    $scope.notifyCircleMembers = function() {
      var invitees = [];

      for (var index in $scope.circleMembers) {
        var circleMember = $scope.circleMembers[index];
        if (circleMember.invited) {
          invitees.push(circleMember.fob_user_id);
        }
      }
      FobService2.fob.intrusion.invites.addInvitees($scope.message, invitees);

      // $scope.modal.hide();
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      // $scope.modal.hide();
      $mdDialog.hide();
      $log.debug('[notifyCircleController] CLOSING MODAL');
    };

    $scope.$on('$destroy', function() {
      $log.debug('$destroy()');
      if ($scope.modal !== undefined) {
        $scope.modal.remove();
      }
    });

  }
})();
