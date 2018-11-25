(function() {
  'use strict';

  angular
    .module('app.core')
    .service('KornerDayHelpers', kornerDayHelpers);

  /* @ngInject */
  function kornerDayHelpers(DayOfWeekConst) {

    // list of exported public methods
    return {
      hasMonday: hasMonday,
      hasTuesday: hasTuesday,
      hasWednesday: hasWednesday,
      hasThursday: hasThursday,
      hasFriday: hasFriday,
      hasSaturday: hasSaturday,
      hasSunday: hasSunday,
    };



    function hasMonday(day) {
      return (day & DayOfWeekConst.MONDAY) === DayOfWeekConst.MONDAY;
    }

    function hasTuesday(day) {
      return (day & DayOfWeekConst.TUESDAY) === DayOfWeekConst.TUESDAY;
    }

    function hasWednesday(day) {
      return (day & DayOfWeekConst.WEDNESDAY) === DayOfWeekConst.WEDNESDAY;
    }

    function hasThursday(day) {
      return (day & DayOfWeekConst.THURSDAY) === DayOfWeekConst.THURSDAY;
    }

    function hasFriday(day) {
      return (day & DayOfWeekConst.FRIDAY) === DayOfWeekConst.FRIDAY;
    }

    function hasSaturday(day) {
      return (day & DayOfWeekConst.SATURDAY) === DayOfWeekConst.SATURDAY;
    }

    function hasSunday(day) {
      return (day & DayOfWeekConst.SUNDAY) === DayOfWeekConst.SUNDAY;
    }

  }

})();
