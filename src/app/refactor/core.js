(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('core', core);

  /* @ngInject */
  function core() {

    var service = {
      stringToEpoch: stringToEpoch,
      stringAs02d: stringAs02d
    };

    return service;


    function stringToEpoch(stringDate) {
      var date = new Date(stringDate);
      var epochDate = Math.floor(date.getTime() / 1000);
      return epochDate;
    }

    function stringAs02d(number) {
      if (number < 10) {
        return "0" + number;
      }

      return "" + number;
    }


  }
})();
