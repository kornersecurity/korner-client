(function() {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.component')
    .directive('ksKornerSectionTitle', ['$log', ksKornerSectionTitle]);


    /* @ngInject */
    function ksKornerSectionTitle($log) {
      return {
        restrict: 'E',
        scope: {
          title: '=',
          subTitle: '=',
          pluralizeSubTitle: '=',
          count: '=',
          hasPlusMinusIcon: '=',
          swapControl: "=",
          showTags: "="
        },
        link: function (scope, element, attrs) {
          scope.internalControl = scope.swapControl || {};
          scope.internalControl.showMinusSign = scope.showTags;
          $log.debug('[fob-section-title-widget] SHOW MINUS SIGN: '+scope.internalControl.showMinusSign);
          scope.internalControl.swapIcon = function() {
            scope.internalControl.showMinusSign = !scope.internalControl.showMinusSign;
          };
        },
        templateUrl: 'app/views/fob-section-title-widget.html',
        controller: ksKornerSectionTitleWidget
      };
    }

  angular.module('app.component')
    .controller('ksKornerSectionTitleWidget', ksKornerSectionTitleWidget);


  /* @ngInject */
  function ksKornerSectionTitleWidget($scope) {

    $scope.hasPluralizeSubTitle = function() {
      return ($scope.pluralizeSubTitle !== undefined);
    };

  }


})();
