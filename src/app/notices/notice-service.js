//
// notice-service.js
//
(function() {
  'use strict';

  angular.module('app.notice')
  .service('noticeService', [
    'Restangular',
    'kornerNoticeTypeConst',
    '$log',
  function(
    Restangular,
    kornerNoticeTypeConst,
    $log
  ) {

    var notices = [];


    function resetServiceData() {
      $log.debug("[notice-service] DATA RESET");
      notices = [];
    }

    function setKornerNoticeIcon(notice) {
      // should be the notice type and not the id
      switch(parseInt(notice.notice_type_id)) {
        case kornerNoticeTypeConst.MAINTENANCE:
          notice.icon = 'ion-wrench';
          break;
        case kornerNoticeTypeConst.PROMOTION:
          notice.icon = 'ion-images';
          break;
        case kornerNoticeTypeConst.URGENT:
          notice.icon = 'ion-alert-circled';
          break;
        case kornerNoticeTypeConst.SOFTWARE_RELEASE:
          notice.icon = 'ion-iphone';
          break;
      }
    }

    function getNotices(success) {

      // if (!notices) {
        $log.debug('[notice-service] QUERY: notices ');

        Restangular.all('notices?offset=0').getList().then(function(theNotices) {
          notices = theNotices.plain();
          for(var n in notices) {
            setKornerNoticeIcon(notices[n]);
          }
          success(notices);
        });
      // }
      // else {
      //   $log.debug('[notice-service] CACHE: notices ');
      //   success(notices);
      // }
    }


    return {
      getNotices:       getNotices,
      resetServiceData: resetServiceData

    };

  }
  ]);
})();
