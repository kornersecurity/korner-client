(function() {
'use strict';

angular.module('app.fob.setup')
.controller('armingScheduleController', armingScheduleController);

/* @ngInject */
function armingScheduleController(
  $rootScope,
  $scope,
  $state,
  $log,
  $ionicPopup,
  KornerDayHelpers,
  DayOfWeekUIHelpersConst,
  ScheduleActionConst,
  DayOfWeekConst,
  $location,
  $anchorScroll,
  uiLoadingService,
  contentFobSetup,
  contentTagSetup
) {

  $scope.showSpinner = false;
  $scope.change_password = {};
  $scope.ScheduleActionConst = ScheduleActionConst;
  $scope.DayOfWeekConst = DayOfWeekConst;

  $scope.fobConfiguration.localTimeZone = moment.utc().toDate();
  $scope.fobConfiguration.localTimeZone = moment($scope.fobConfiguration.localTimeZone).format('Z').split(':')[0];
  $scope.fobConfiguration.localTimeZone = Number($scope.fobConfiguration.localTimeZone);


  function parseStandardTime(eTime){
    if (eTime === null) {
      return "00:00";
    } else {
      var meridian = ['AM', 'PM'];

      var hours = parseInt(eTime / 3600);
      var minutes = (eTime / 60) % 60;
      var hoursRes = hours > 12 ? (hours - 12) : hours;

      var currentMeridian = meridian[parseInt(hours / 12)];

      return (prependZero(hoursRes) + ":" + prependZero(minutes) + currentMeridian);
    }
  }

  function prependZero(param) {
    if (String(param).length < 2) {
      return "0" + String(param);
    }
    return param;
  }

  function addDaysOfWeek(dayMask) {
    var days = '';
    if(KornerDayHelpers.hasMonday(dayMask)){
      days += DayOfWeekUIHelpersConst.MONDAY;
    }
    if(KornerDayHelpers.hasTuesday(dayMask)){
      days += (days !== '')? ', ' : '';
      days += DayOfWeekUIHelpersConst.TUESDAY;
    }
    if(KornerDayHelpers.hasWednesday(dayMask)){
      days += (days !== '')? ', ' : '';
      days += DayOfWeekUIHelpersConst.WEDNESDAY;
    }
    if(KornerDayHelpers.hasThursday(dayMask)){
      days += (days !== '')? ', ' : '';
      days += DayOfWeekUIHelpersConst.THURSDAY;
    }
    if(KornerDayHelpers.hasFriday(dayMask)){
      days += (days !== '')? ', ' : '';
      days += DayOfWeekUIHelpersConst.FRIDAY;
    }
    if(KornerDayHelpers.hasSaturday(dayMask)){
      days += (days !== '')? ', ' : '';
      days += DayOfWeekUIHelpersConst.SATURDAY;
    }
    if(KornerDayHelpers.hasSunday(dayMask)){
      days += (days !== '')? ', ' : '';
      days += DayOfWeekUIHelpersConst.SUNDAY;
    }

    return days;
  }

  $scope.fobConfiguration.onSelectedScheduleChanged = function(){
    $scope.fobConfiguration.selectedSchedule.action = $scope.fobConfiguration.scheduleAction;
    $scope.fobConfiguration.generateScheduleLabel($scope.fobConfiguration.selectedSchedule);
    $scope.fobConfiguration.selectedScheduleChanged = true;
    if($scope.fobConfiguration.selectedSchedule.dayMask === 0) {
      $scope.fobConfiguration.selectedScheduleChanged = false;
    }
  };
  $scope.fobConfiguration.generateScheduleLabel = function(schedule){
    if(schedule === null || schedule === undefined){
      return;
    }

    var label = (schedule.action === 1)? 'Arm' : 'Disarm';
    label += ' @'+parseStandardTime(schedule.time*60);
    label += ' on '+addDaysOfWeek(schedule.dayMask);
    return label;
  };

  $scope.fobConfiguration.saveFobConfigurationChanges = function(hideUiLoader, callback) {
    if(hideUiLoader !== true) {
      uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "kornerFobConfiguration");
    }
    $scope.fobConfiguration.selectedFob.server_data.dailySecuritySchedule.utcOffset = $scope.fobConfiguration.localTimeZone;
    $scope.fobConfiguration.selectedFob.updateServerData().then(
      function(){
        $scope.timePickerObject = null;
        $scope.fobConfiguration.selectedSchedule = null;
        $scope.fobConfiguration.selectedScheduleIndex = -1;
        $scope.fobConfiguration.selectedScheduleChanged = false;
        uiLoadingService.showHideDelay(contentFobSetup.LOCATION_UPDATED_SUCCESSFUL, "kornerFobConfiguration", true);
        if(callback){
          callback();
        }
      },
      function(err){
        //Show error message
        uiLoadingService.showHideDelay(contentFobSetup.LOCATION_UPDATED_FAILED, "kornerFobConfiguration",
          false);
      }
    );
  };

  $scope.fobConfiguration.removeSchedule = function(selectedScheduleIndex){
    var confirmRemovePopup = $ionicPopup.confirm({
      title: contentFobSetup.REMOVE_SCHEDULE_TITLE,
      template: contentFobSetup.REMOVE_SCHEDULE_QUESTION,
      cancelText: contentTagSetup.NO,
      okText: contentTagSetup.YES
    });

    confirmRemovePopup.then(function(res) {

      if (res) {
        uiLoadingService.show(contentFobSetup.REMOVING_SCHEDULE, "kornerFobConfiguration");

        $scope.fobConfiguration.selectedFob.server_data.dailySecuritySchedule.schedule.splice(selectedScheduleIndex, 1);
        $scope.fobConfiguration.saveFobConfigurationChanges(true);
      }
    });
  };

  $scope.fobConfiguration.saveSchedule = function(callback){
    var schedule = $scope.fobConfiguration.selectedFob.server_data.dailySecuritySchedule.schedule;
    if(schedule === undefined || schedule === null) {
      $scope.fobConfiguration.selectedFob.server_data.dailySecuritySchedule.schedule = schedule = [];
    }
    if($scope.fobConfiguration.selectedScheduleIndex === -1){
      schedule.push($scope.fobConfiguration.selectedSchedule);
    } else {
      schedule[$scope.fobConfiguration.selectedScheduleIndex] = $scope.fobConfiguration.selectedSchedule;
    }
    $scope.fobConfiguration.saveFobConfigurationChanges(false, callback);
    $log.debug('[armingScheduleController] SCHEDULE: ', schedule);
    $log.debug('[armingScheduleController] SCHEDULE ', $scope.fobConfiguration.selectedFob.server_data.dailySecuritySchedule.schedule);
  };

  $scope.fobConfiguration.addSchedule = function(){
    $scope.fobConfiguration.editSchedule({"time":0, "action":1, "dayMask":0}, -1);
    $scope.fobConfiguration.selectedScheduleChanged = false;
    scrollToSettings();
  };

  $scope.fobConfiguration.editSchedule = function(selectedSchedule, selectedScheduleIndex) {
    $scope.timePickerObject = null;
    $scope.fobConfiguration.selectedSchedule = angular.copy(selectedSchedule);
    $scope.fobConfiguration.selectedScheduleIndex = selectedScheduleIndex;
    $scope.fobConfiguration.selectedScheduleChanged = false;
    setTimePickerObject(selectedSchedule);
    $scope.fobConfiguration.scheduleAction = selectedSchedule.action;
    $scope.fobConfiguration.hasMonday = KornerDayHelpers.hasMonday(selectedSchedule.dayMask);
    $scope.fobConfiguration.hasTuesday = KornerDayHelpers.hasTuesday(selectedSchedule.dayMask);
    $scope.fobConfiguration.hasWednesday = KornerDayHelpers.hasWednesday(selectedSchedule.dayMask);
    $scope.fobConfiguration.hasThursday = KornerDayHelpers.hasThursday(selectedSchedule.dayMask);
    $scope.fobConfiguration.hasFriday = KornerDayHelpers.hasFriday(selectedSchedule.dayMask);
    $scope.fobConfiguration.hasSaturday = KornerDayHelpers.hasSaturday(selectedSchedule.dayMask);
    $scope.fobConfiguration.hasSunday = KornerDayHelpers.hasSunday(selectedSchedule.dayMask);
    scrollToSettings();
    // $log.debug('[armingScheduleController] SELECTED SCHEDULE INDEX: '+selectedScheduleIndex);
  };

  $scope.fobConfiguration.onSelectedWeekDaysChanged = function(hasDay, dayBitConst){
    setWeekDayMaskBit(hasDay, dayBitConst);
    $scope.fobConfiguration.onSelectedScheduleChanged();
  };

  $scope.fobConfiguration.cancelArmingScheduleChanges = function(){
    $scope.timePickerObject = null;
    $scope.fobConfiguration.selectedSchedule = null;
    $scope.fobConfiguration.selectedScheduleIndex = -1;
    $scope.fobConfiguration.selectedScheduleChanged = false;
  };

  function setWeekDayMaskBit(hasDay, dayBitConst) {
  // $log.debug('[fob-tag-model] DAY MASK: '+dayBitConst+'('+hasDay+')');
    if (hasDay === true) {
      $scope.fobConfiguration.selectedSchedule.dayMask |= dayBitConst;
    } else {
      $scope.fobConfiguration.selectedSchedule.dayMask &= ~dayBitConst;
    }
    // $log.debug('[fob-tag-model] DAY MASK: '+$scope.fobConfiguration.selectedSchedule.dayMask);
  }

  $scope.alerts = [];
  var defulatTimePickerValues = {
  };

  $scope.thisDate = new Date().getHours() * 60 * 60;

  function setTimePickerObject(schedule) {
    $scope.timePickerObject = {
      inputEpochTime: schedule.time*60,
      step: 5,  //Optional
      format: 12,  //Optional
      titleLabel: 'Arming Time',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        timePickerCallback(val, $scope.timePickerObject);
      }
    };
  }

  function timePickerCallback(val, button){
    if(val === undefined) {
      return;
    }
    // $log.debug('[armingScheduleController] TIME: '+val/60);
    $scope.fobConfiguration.selectedSchedule.time = val/60;
    $scope.fobConfiguration.onSelectedScheduleChanged();
  }

  function scrollToSettings() {
    //  var newHash = 'ksAnchor1';
    //  if ($location.hash() !== newHash) {
    //    // set the $location.hash to `newHash` and
    //    // $anchorScroll will automatically scroll to it
    //    $location.hash('ksAnchor1');
    //  } else {
    //    // call $anchorScroll() explicitly,
    //    // since $location.hash hasn't changed
    //    $anchorScroll();
    //  }
  }

  if($scope.fobConfiguration.selectedFob.server_data.dailySecuritySchedule.utcOffset !== $scope.fobConfiguration.localTimeZone) {
    $scope.fobConfiguration.selectedFob.server_data.dailySecuritySchedule.utcOffset = $scope.fobConfiguration.localTimeZone;
    $scope.fobConfiguration.saveFobConfigurationChanges(true);
  }
}
})();
