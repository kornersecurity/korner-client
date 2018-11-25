(function() {
  'use strict';

  angular
    .module('app.core')
    .service('KornerUIHelpers', kornerUIHelpers)
    .constant('KornerUIHelpersSeverityConst', {
      UNKNOWN: 0x0,
      TROUBLE: 0x1,
      ASSERTIVE: 0x2,
      ENERGIZED: 0x3,
      BALANCED: 0x4,
      CALM: 0x5,
      POSITIVE: 0x6,
      INFO: 0x7,
      DARK: 0x8,
      STABLE: 0x9,
      LIGHT: 0xa,
      UNDEFINED: 0xff,
    })
    .constant('DayOfWeekUIHelpersConst', {
      MONDAY: 'MON',
      TUESDAY: 'TUE',
      WEDNESDAY: 'WED',
      THURSDAY: 'THU',
      FRIDAY: 'FRI',
      SATURDAY: 'SAT',
      SUNDAY: 'SUN'
    });




  /* @ngInject */
  function kornerUIHelpers(KornerStateHelpers, KornerUIHelpersSeverityConst) {

    // list of exported public methods
    return {
      backgroundStyleForFobStatusOrSeverity: backgroundStyleForFobStatusOrSeverity,
      textColorStyleForStatusServerity: textColorStyleForStatusServerity,
      stringToHex: stringToHex
    };

    function stringToHex(str) {
      return parseInt(str).toString(16);
    }

    function backgroundStyleForFobStatusOrSeverity(fob) {

      if (fob.tags.getCount() === 0) {

        if (KornerStateHelpers.isFobStateConnected(fob.fob_state)) {
          return "korner-bg-info";
        } else {
          return "korner-bg-energized";
        }
      }


      switch (fob.statusSeverity) {
        case KornerUIHelpersSeverityConst.UNKNOWN:
          return "korner-bg-unknown";
        case KornerUIHelpersSeverityConst.TROUBLE:
          return "korner-bg-trouble pulse";
        case KornerUIHelpersSeverityConst.ASSERTIVE:
          return "korner-bg-assertive";
        case KornerUIHelpersSeverityConst.ENERGIZED:
          return "korner-bg-energized";
        case KornerUIHelpersSeverityConst.BALANCED:
          return "korner-bg-balanced";
        case KornerUIHelpersSeverityConst.CALM:
          return "korner-bg-calm";
        case KornerUIHelpersSeverityConst.POSITIVE:
          return "korner-bg-positive";
        case KornerUIHelpersSeverityConst.INFO:
          return "korner-bg-info";
        case KornerUIHelpersSeverityConst.DARK:
          return "korner-bg-dark";
        case KornerUIHelpersSeverityConst.STABLE:
          return "korner-bg-stable";
        case KornerUIHelpersSeverityConst.LIGHT:
          return "korner-bg-light";
        default:
          return "korner-bg-undefined";

      }
    }

    function textColorStyleForStatusServerity(severity) {
      switch (severity) {
        case KornerUIHelpersSeverityConst.UNKNOWN:
          return "korner-text-color-unknown";
        case KornerUIHelpersSeverityConst.TROUBLE:
          return "korner-text-color-trouble";
        case KornerUIHelpersSeverityConst.ASSERTIVE:
          return "korner-text-color-assertive";
        case KornerUIHelpersSeverityConst.ENERGIZED:
          return "korner-text-color-energized";
        case KornerUIHelpersSeverityConst.BALANCED:
          return "korner-text-color-balanced";
        case KornerUIHelpersSeverityConst.CALM:
          return "korner-text-color-info";
        case KornerUIHelpersSeverityConst.POSITIVE:
          return "korner-text-color-working";
        case KornerUIHelpersSeverityConst.INFO:
          return "korner-text-color-info";
        case KornerUIHelpersSeverityConst.DARK:
          return "korner-text-color-dark";
        case KornerUIHelpersSeverityConst.STABLE:
          return "korner-text-color-stable";
        case KornerUIHelpersSeverityConst.LIGHT:
          return "korner-text-color-light";
        default:
          return "korner-text-color-undefined";

      }
    }


  }

})();
