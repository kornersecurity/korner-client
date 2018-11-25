(function () {
  'use strict';

  angular.module('app.wizard.tag')
    .controller('tagSetupControllerPage1', tagSetupControllerPage1);

  /* @ngInject */
  function tagSetupControllerPage1(
    $scope,
    $state,
    $ionicModal,
    $ionicPopup,
    $ionicListDelegate,
    contentTagSetup,
    wizardType,
    uiLoadingService,
    KornerStateHelpers,
    $log,
    FobService2,
    KornerUIHelpers,
    requiredFirmwareConst
  ) {
    // $log.debug('P1 CONTROLLER');
    $scope.wizard.tagSetup.p1 = {};

    $scope.wizard.tagSetup.p1.isGroupShown = function (group) {
      switch (group) {
        case 'active':
          return $scope.wizard.tagSetup.p1.showActiveGroup;
        case 'missing':
          return $scope.wizard.tagSetup.p1.showMissingGroup;
      }
    };

    $scope.firmwareVersionToHex = function (tag) {
      // console.log('[ksFobAddressWidget] FIRMWARE VERSION HEX: ' +
      //              KornerUIHelpers.stringToHex(tag.firmware_version));

      return KornerUIHelpers.stringToHex(tag.firmware_version);
    };

    $scope.wizard.tagSetup.p1.deactivateTag = function (tag) {
      $log.debug('$deactivateTag()');

      var confirmRemovePopup = $ionicPopup.confirm({
        title: contentTagSetup.REMOVE_TAG_TITLE,
        template: contentTagSetup.REMOVE_TAG_QUESTION,
        cancelText: contentTagSetup.NO,
        okText: contentTagSetup.YES
      });

      confirmRemovePopup.then(function (res) {

        if (res) {
          uiLoadingService.show(contentTagSetup.REMOVING_TAG, "wizardToast");


          FobService2.fob.tags.removeTagFromCollectionWithID(tag.tag_id)
            .then(function () {
              $log.debug('[tagSetupControllerPage1] TAG REMOVED SUCCESSFULLY');
              $scope.wizard.tagSetup.tags = FobService2.fob.tags.getTagsArray();
              uiLoadingService.showHideDelay(contentTagSetup.TAG_REMOVED_SUCCESS, "wizardToast", true);
              $scope.wizard.tagSetup.p1.totalActiveTags = countActiveTags();
              $scope.wizard.tagSetup.p1.totalMissingTags = countMissingTags();
            }, function (status) {
              $log.debug('[tagSetupControllerPage1] TAG REMOVE ERROR: ' +
                status);
              uiLoadingService.showHideDelay(contentTagSetup.TAG_REMOVED_FAIL, "wizardToast", false);
            });


        }
      });
    };



    $scope.wizard.tagSetup.closeModal = function () {
      $scope.wizard.showModal = false;
      $log.debug('$closeModal()');
      // $scope.modal.hide();
      $state.go('wizard-manager.tag-setup.p1', {}, {});
      $scope.wizard.tagSetup.editedTag = null;

      $log.debug("[tag-setup-p1-controller] CLOSE EDIT TAG NAME MODAL");

    };



    function countActiveTags() {
      var counter = 0;
      for (var i = 0; i < $scope.wizard.tagSetup.tags.length; i++) {
        var tag = $scope.wizard.tagSetup.tags[i];
        if (KornerStateHelpers.isTagStateActive(tag.tag_state)) {
          counter++;
        }
      }
      // $log.debug("ACTIVE TAGS: "+counter);
      return counter;
    }

    function countMissingTags() {
      var counter = 0;
      for (var i = 0; i < $scope.wizard.tagSetup.tags.length; i++) {
        var tag = $scope.wizard.tagSetup.tags[i];
        if (!KornerStateHelpers.isTagStateActive(tag.tag_state)) {
          counter++;
        }
      }
      // $log.debug("Missing TAGS: "+counter);
      return counter;
    }

    $scope.wizard.tagSetup.p1.editTag = function (tag) {
      $scope.wizard.tagSetup.editedTag = tag;
      $ionicListDelegate.closeOptionButtons();
      $scope.wizard.showModal = true;
      // $ionicModal.fromTemplateUrl('app/views/edit-tag-name.html', {
      //     scope: $scope,
      //     animation: 'slide-in-up',
      //   })
      //   .then(function(modal) {
      //     $scope.modal = modal;
      //     modal.show();
      //
      //     $log.debug("SHOWING EDIT TAG NAME POPUP");
      //
      //   });
      $state.go('wizard-manager.tag-setup.editTagName', {}, {});
    };

    (function () {
      $scope.wizard.pageCode = '400';
      // $scope.wizard.tagSetup.tags =
      $scope.wizard.tagSetup.p1.showActiveGroup = false;
      $scope.wizard.tagSetup.p1.showMissingGroup = false;

      $scope.wizard.tagSetup.tag = null;
      $scope.wizard.tagSetup.openingMechanism = null;
      $scope.wizard.tagSetup.selectedSetupType = null;
      $scope.wizard.tagSetup.portalTypeId = null;

      $scope.wizard.tagSetup.canDeleteTags = (FobService2.fob.firmware_release >= requiredFirmwareConst.TAG_DELETE) ? true : false;

      if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
        $scope.wizard.canExitWizard = false;
        $scope.wizard.showExitButton = false;
      } else {
        $scope.wizard.canExitWizard = true;
        $scope.wizard.showExitButton = true;
      }
      // $scope.wizard.enablePreviousButton();
      // $scope.wizard.tagSetup.p1.tagsWithIssues = tagService.getTagsWithIssues(sessionService.getSelectedFob());
      // $log.debug('[tag-setup-p1-controller] TAGS WITH ISSUES: ' + $scope.wizard.tagSetup.p1.tagsWithIssues);
      // $scope.wizard.tagSetup.tagStateConst = tagStateConst;

      //seb replaced with tag.state_description  (should be upto date)

      // tagService.setTagStateTitles($scope.wizard.tagSetup.tags);


      $scope.wizard.tagSetup.p1.totalActiveTags = countActiveTags();
      $scope.wizard.tagSetup.p1.totalMissingTags = countMissingTags();

      $log.debug('[tag-setup-p1-controller] TOTAL ACTIVE TAGS:  ' + $scope.wizard
        .tagSetup.p1.totalActiveTags);
      $log.debug('[tag-setup-p1-controller] TOTAL MISSING TAGS: ' + $scope.wizard
        .tagSetup.p1.totalMissingTags);

      if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
        if ($scope.wizard.tagSetup.tags.length > 0) {
          $scope.wizard.enableNextButton();
        } else {
          $scope.wizard.disableNextButton();
        }
      } else {
        $scope.wizard.disableNextButton();
      }
    })();
  }
})();

(function () {
  'use strict';
  App.filter('activeTags', activeTagsFilter);

  /* @ngInject */
  function activeTagsFilter(
    KornerStateHelpers,
    $log
  ) {
    return function (tags) {
      var filtered = [];
      for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        if (KornerStateHelpers.isTagStateActive(tag.tag_state)) {
          filtered.push(tag);
        }
      }
      // $log.debug("[activeTagsFilter] ACTIVE TAGS: " + filtered.length);
      return filtered;
    };
  }
})();

(function () {
  'use strict';
  App.filter('missingTags', missingTagsFilter);

  /* @ngInject */
  function missingTagsFilter(
    KornerStateHelpers,
    $log
  ) {
    return function (tags) {
      var filtered = [];
      for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        // $log.debug("[missingTagsFilter] TAG STATE: " + tag.tag_state,
        // tagOpstatusConst.UNKNOWN, tagOpstatusConst.MISSING);
        if (!KornerStateHelpers.isTagStateActive(tag.tag_state)) {
          filtered.push(tag);
        }
      }
      // $log.debug("[missingTagsFilter] MISSING TAGS: " + filtered.length);
      return filtered;
    };
  }
})();
