(function() {
  'use strict';

  angular.module('app.account')
    .service('accountAuthService', accountAuthenticationService);

  /* @ngInject */
  function accountAuthenticationService(
    $rootScope,
    $q,
    $state,
    Restangular,
    SessionService2,
    $log
  ) {

    var currentUser;



    var theService = {

      isLoggedIn: function() {
        return (currentUser !== undefined);
      },

      getCurrentUser: function(){
        return currentUser;
      },

      hasCurrentUser: function() {
        var self = this;
        var defer = $q.defer();

        if (currentUser === undefined) {
          Restangular.one('auth/user').get().then(
            function(user) {

              currentUser = user.plain();
              $rootScope.user = currentUser;
              defer.resolve(currentUser);
            },
            function(res) {
              // problem lets just reset for now
              $log.debug(res);
              currentUser = undefined;
              $rootScope.user = currentUser;
              defer.reject(res);
            }
          );
        } else {
          // already have user - success
          defer.resolve(currentUser);
        }
        return defer.promise;
      },

      login: function(user) {
        var defer = $q.defer();

        Restangular.all('auth/login').post(user).then(
          function(user) {
            currentUser = undefined;
            theService.hasCurrentUser();
            defer.resolve();

          },
          function(res) {
            if (res.data) {
              defer.reject(res);
            } else {
              defer.reject({data:{message:"No network connectivity"}});
            }
          }
        );

        return defer.promise;
      },

      logout: function() {
        SessionService2.onShutdown();

        Restangular.one('auth/logout').get().then(
          function() {
            $state.go('app.account.login', {}, {});
          }
        );
      },

      resendVerificationEmail: function(email) {
        var defer = $q.defer();

        Restangular.all('account/verify-email').post({email: email}).then(
          function() {
            defer.resolve();
          },
          function(res) {
            if (res.data) {
              defer.reject(res);
            } else {
              defer.reject("No network connectivity");
            }
          }
        );

        return defer.promise;
      },

    };

    theService.hasCurrentUser();

    return theService;

  }
})();
