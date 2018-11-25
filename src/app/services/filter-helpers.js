(function() {
  'use strict';

  /*jshint validthis: true */

  angular
    .module('app.component')


  .filter('removeAtTime', function() {
    return function(input, scope) {
      return input.split(' at', 2)[0];
    };
  })


  .filter('orderObjectBy', function() {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });

      function index(obj, i) {
        return obj[i];
      }
      filtered.sort(function(a, b) {
        var comparator;
        var reducedA = field.split('.').reduce(index, a);
        var reducedB = field.split('.').reduce(index, b);
        if (reducedA === reducedB) {
          comparator = 0;
        } else if (reverse) {
          comparator = (reducedA > reducedB ? 1 : -1);
        } else {
          comparator = (reducedA < reducedB ? 1 : -1);
        }
        return comparator;
      });
      return filtered;
    };
  });

})();
