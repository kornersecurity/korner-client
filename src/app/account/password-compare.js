(function() {
  'use strict';


  angular.module('app.account.component')
    .directive('compareTo', compareTo);

  /* @ngInject */
  function compareTo(){
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
          ngModel.$validate();
        });
      }
    };
  }
})();
