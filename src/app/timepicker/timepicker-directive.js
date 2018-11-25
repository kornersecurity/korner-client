//By Rajeshwar Patlolla
//https://github.com/rajeshwarpatlolla

(function () {
  'use strict';

  angular.module('app.timepicker')
    .directive('timepicker', timepicker);

  /* @ngInject */
  function timepicker() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        inputObj: "=inputObj"
      },
      templateUrl: 'app/views/timepicker.html',
      link: function (scope, element, attrs) {
        var obj;
        var objDate;

        scope.$watch('inputObj', function(inputObj) {
           console.log(scope.inputObj, inputObj);

          //  var today = new Date();
           var currentEpoch = ((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60);

           //set up base variables and options for customization
           scope.inputEpochTime = scope.inputObj.inputEpochTime ? scope.inputObj.inputEpochTime : currentEpoch;
           scope.step = scope.inputObj.step ? scope.inputObj.step : 15;
           scope.format = scope.inputObj.format ? scope.inputObj.format : 24;
           scope.titleLabel = scope.inputObj.titleLabel ? scope.inputObj.titleLabel : 'Time Picker';
           scope.setLabel = scope.inputObj.setLabel ? scope.inputObj.setLabel : 'Set';
           scope.closeLabel = scope.inputObj.closeLabel ? scope.inputObj.closeLabel : 'Close';
           scope.setButtonType = scope.inputObj.setButtonType ? scope.inputObj.setButtonType : 'button-positive';
           scope.closeButtonType = scope.inputObj.closeButtonType ? scope.inputObj.closeButtonType : 'button-stable';

           obj = {epochTime: scope.inputEpochTime, step: scope.step, format: scope.format};
           scope.time = {hours: 0, minutes: 0, meridian: ""};
           objDate = new Date(obj.epochTime * 1000);       // Epoch time in milliseconds.





           if (typeof scope.inputObj.inputEpochTime === 'undefined' || scope.inputObj.inputEpochTime === null) {
             objDate = new Date();
           } else {
             objDate = new Date(scope.inputObj.inputEpochTime * 1000);
           }

           if (obj.format == 12) {
             scope.time.meridian = (objDate.getUTCHours() >= 12) ? "PM" : "AM";
             scope.time.hours = (objDate.getUTCHours() > 12) ? ((objDate.getUTCHours() - 12)) : (objDate.getUTCHours());
             scope.time.minutes = (objDate.getUTCMinutes());

             scope.time.hours = (scope.time.hours < 10) ? ("0" + scope.time.hours) : (scope.time.hours);
             scope.time.minutes = (scope.time.minutes < 10) ? ("0" + scope.time.minutes) : (scope.time.minutes);

             if (scope.time.hours === 0 && scope.time.meridian === "AM") {
               scope.time.hours = 12;
             }

           } else if (obj.format == 24) {

             scope.time.hours = (objDate.getUTCHours());
             scope.time.minutes = (objDate.getUTCMinutes());

             scope.time.hours = (scope.time.hours < 10) ? ("0" + scope.time.hours) : (scope.time.hours);
             scope.time.minutes = (scope.time.minutes < 10) ? ("0" + scope.time.minutes) : (scope.time.minutes);

           }
        });
        //Increasing the hours
        scope.increaseHours = function () {
          scope.time.hours = Number(scope.time.hours);
          if (obj.format == 12) {
            if (scope.time.hours != 12) {
              scope.time.hours += 1;
            } else {
              scope.time.hours = 1;
            }
          }
          if (obj.format == 24) {
            scope.time.hours = (scope.time.hours + 1) % 24;
          }
          scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
          scope.updateContent();
        };

        //Decreasing the hours
        scope.decreaseHours = function () {
          scope.time.hours = Number(scope.time.hours);
          if (obj.format == 12) {
            if (scope.time.hours > 1) {
              scope.time.hours -= 1;
            } else {
              scope.time.hours = 12;
            }
          }
          if (obj.format == 24) {
            scope.time.hours = (scope.time.hours + 23) % 24;
          }
          scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
          scope.updateContent();
        };

        //Increasing the minutes
        scope.increaseMinutes = function () {
          scope.time.minutes = Number(scope.time.minutes);
          scope.time.minutes = (scope.time.minutes + obj.step) % 60;
          scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
          scope.updateContent();
        };

        //Decreasing the minutes
        scope.decreaseMinutes = function () {
          scope.time.minutes = Number(scope.time.minutes);
          scope.time.minutes = (scope.time.minutes + (60 - obj.step)) % 60;
          scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
          scope.updateContent();
        };

        //Changing the meridian
        scope.changeMeridian = function () {
          scope.time.meridian = (scope.time.meridian === "AM") ? "PM" : "AM";
          scope.updateContent();
        };

        scope.updateContent = function(){
          var totalSec = 0;

          if (scope.time.hours !== 12) {
            totalSec = (scope.time.hours * 60 * 60) + (scope.time.minutes * 60);
          } else {
            totalSec = scope.time.minutes * 60;
          }

          if (scope.time.meridian === "AM") {
            totalSec += 0;
          } else if (scope.time.meridian === "PM") {
            totalSec += 43200;
          }

          scope.etime = totalSec;
          scope.inputObj.callback(scope.etime);
        };

      }
    };
  }

})();
