(function(exports) {


  exports.circleRoutes = function(stateProvider, urlProvider) {
    //
    // Accounts Routes
    // -----------------------------------

    stateProvider

    .state('app.circle', {
      url: '/circle',
      templateUrl: urlProvider.basepath('circle.html'),
      abstract: true,
      data: {
        accessLevel: accessLevels.none
    }

    })
    .state('app.circle.invitation-accepted', {
      url: '/invitation-accepted',
      title: "Invitation Accepted",
      templateUrl: urlProvider.basepath('circle-invitation-accepted.html'),
    })
    .state('app.circle.member-creation-successful', {
      url: '/member-creation-successful',
      title: "Member Sign Up Successful",
      templateUrl: urlProvider.basepath('circle-member-creation-successful.html'),
    })
    .state('app.circle.invitation-problem', {
      url: '/invitation-problem',
      title: "Invitation Problem",
      templateUrl: urlProvider.basepath('circle-invitation-problem.html'),
    })
    .state('app.circle.invitation-declined', {
      url: '/invitation-declined/:token',
      title: "Invitation Declined",
      templateUrl: urlProvider.basepath('circle-invitation-declined.html'),
      controller: 'circleInvitationDeclinedController',
    })
    .state('app.circle.invitation-creation', {
      url: '/invitation-creation/:token',
      title: "Invitation Accepted / New Member Creation",
      templateUrl: urlProvider.basepath('circle-invitation-creation.html'),
      controller: 'circleInvitationCreationController',
    });
  };





})(typeof exports === 'undefined' ? this : exports);
