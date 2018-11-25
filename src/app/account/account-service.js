angular.module('app.account.service')
  .service('accountService', [
'$rootScope',
'$q',
'$state',
'Restangular',
'$log',
function(
  $rootScope,
  $q,
  $state,
  Restangular,
  $log
) {

  var theService = {

    registration: function(registrationInfo, success, error) {
      Restangular.all('account/registration').post(registrationInfo).then(
        function() {
          success();
        },
        function(res) {
          error(res);
        }
      );
    },

    forgotPassword: function(email, success, error) {
      Restangular.all('account/forgot-password').post(email).then(
        function() {
          success();
        },
        function(res) {
          // $log.debug('[accountService] FORGOT RESET ERROR: '+res);
          // console.log(res);
          error(res);
        }
      );
    },


    resetPassword: function(info, success, error) {
      Restangular.all('account/password-reset').post(info).then(
        function() {
          success();
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
