(function() {
  'use strict';

  /*jshint validthis: true */

  angular
    .module('app.core')
    .directive('ngEnter', enterDirective);

  /* @ngInject */
  function enterDirective() {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
              scope.$eval(attrs.ngEnter);
          });
          event.preventDefault();
        }
      });
    };
  }
})();
