(function() {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.component')
    .directive('ksFobAddress', function() {
      return {
        restrict: 'E',
        scope: {
          fob: '=',
          showVersion: '='
        },
        templateUrl: 'app/views/fob-address-widget.html',
        controller: ksFobAddressWidget
      };
    })
    .controller('ksFobAddressWidget', ksFobAddressWidget);


  /* @ngInject */
  function ksFobAddressWidget($scope, KornerUIHelpers) {
    $scope.formatFirmwareVersion = function(){
      return $scope.fob.formattedFirmwareVersion();
    };
  }


})();
