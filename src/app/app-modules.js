(function() {
  'use strict';

  /*jshint validthis: true */
  angular.module('app.core', []);
  angular.module('app.component', []);
  angular.module('app.startup', []);
  angular.module('app.account', []);
  angular.module('app.account.component', []);
  angular.module('app.account.service', []);
  angular.module('app.circle', []);
  angular.module('app.credits', []);
  angular.module('app.circlefeed', []);
  angular.module('app.intrusion', []);
  angular.module('app.debug', []);
  angular.module('app.home', []);
  angular.module('app.invitation', []);
  angular.module('app.notice', []);
  angular.module('app.profile', []);
  angular.module('app.profile.service', []);
  angular.module('app.wizard', [
  'app.wizard.service',
  'app.wizard.fob',
  'app.wizard.tag',
  'app.wizard.circle',
  'app.wizard.extender']);
  angular.module('app.wizard.service', []);
  angular.module('app.wizard.fob', []);
  angular.module('app.wizard.tag', []);
  angular.module('app.wizard.circle', []);
  angular.module('app.wizard.extender', []);
  angular.module('app.fob.setup', []);
  angular.module('app.timepicker', []);
  })();
