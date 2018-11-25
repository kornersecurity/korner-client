(function() {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.component')
    .directive('ksFobStatusBanner', function() {
      return {
        restrict: 'E',
        scope: {
          fob: '='
        },
        templateUrl: 'app/views/fob-status-banner-widget.html',
        controller: ksFobStatusBannerWidget
      };
    })
    .controller('ksFobStatusBannerWidget', ksFobStatusBannerWidget);


  /* @ngInject */
  function ksFobStatusBannerWidget($scope, KornerUIHelpers) {

    $scope.backgroundStyle = function(fob) {
      return KornerUIHelpers.backgroundStyleForFobStatusOrSeverity(fob);
    };

  }


})();
