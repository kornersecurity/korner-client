(function(exports) {


  exports.accountRoutes = function(stateProvider, urlProvider) {
    //
    // Accounts Routes
    // -----------------------------------

    stateProvider

      .state('app.account', {
        url: "/account",
        templateUrl: urlProvider.basepath('account.html'),
        abstract: true,
        data: {
          accessLevel: accessLevels.none
        }
      })
      .state('app.account.login', {
        url: "/login",
        title: 'Login',
        templateUrl: urlProvider.basepath('account-login.html'),
        controller: 'account.login.controller'

      })
      .state('app.account.forgot-password', {
        url: "/forgot-password",
        title: 'Forgot Password',
        templateUrl: urlProvider.basepath('account-forgot-password.html'),
        controller: 'account.forgot.password.controller'
      })
      .state('app.account.registration', {
        url: "/registration",
        title: 'Registration',
        templateUrl: urlProvider.basepath('account-registration.html'),
        controller: 'account.registration.controller'
      })
      .state('app.account.password-reset', {
        url: "/password-reset/:resetToken",
        title: 'Password Reset',
        templateUrl: urlProvider.basepath('account-password-reset.html'),
        controller: 'account.password.reset.controller'
      })
      .state('app.account.verification-successful', {
        url: '/verification-successful',
        title: "Verification Successful",
        templateUrl: urlProvider.basepath('account-verification-successful.html')
      })
      .state('app.account.verification-failed', {
        url: '/verification-failed',
        title: "Verification Failed",
        templateUrl: urlProvider.basepath('account-verification-failed.html'),
        controller: 'account.verification.controller'
      });
  };





})(typeof exports === 'undefined' ? this : exports);
