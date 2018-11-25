(function() {
  'use strict';

  /*jshint validthis: true */

  angular
    .module('app.core')
    .service('NotificationService', notificationService);

  /* @ngInject */
  function notificationService($rootScope, clientUpdateEventConst) {

    var self = this;
    var has_notifications = false;

    notificationPump();

    // list of exported public methods
    return {
      notify: notify
    };

    function notify() {
      self.has_notifications = true;
    }

    function notificationPump() {
      setInterval(function() {
        if (self.has_notifications) {
          self.has_notifications = false;

          // tell the world that stuff may have changed - this could be
          // a poor design choice......TBD
          $rootScope.$apply();
          $rootScope.$emit(clientUpdateEventConst.UI_REFRESH_REQUIRED);
        }
      }, 250);
    }



  }

})();
