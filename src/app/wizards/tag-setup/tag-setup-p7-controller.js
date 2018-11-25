(function() {
  'use strict';
  angular.module('app.wizard.tag')
    .controller('tagSetupControllerPage7', tagSetupControllerPage7);

  /* @ngInject */
  function tagSetupControllerPage7(
    $scope,
    $state,
    WizardModel,
    $log,
    FobService2
  ) {
    $scope.wizard.tagSetup.p7 = {};

    $scope.wizard.tagSetup.p7.validateData = function() {
      // if($scope.wizard.tagSetup.tag.tag_name !== undefined && $scope.wizard.tagSetup.tag.openingMechanism !== undefined
      if ($scope.wizard.tagSetup.tag.tag_name !== undefined && $scope.wizard.tagSetup.tag.tag_name !== '') {
        $scope.wizard.tagSetup.tag.setTagFullName();
        $scope.wizard.enableNextButton();
        return true;
      } else {
        $scope.wizard.disableNextButton();
        return false;
      }
    };

    $scope.catchEnter = function(keyEvent) {
      if (keyEvent.which === 13) {
        keyEvent.preventDefault();
        if(window.cordova && cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.close();
        }
        keyEvent.target.blur();
        if($scope.wizard.tagSetup.p7.validateData()){
          $scope.wizard.goToNextPage();
        }
      }
    };

    $scope.wizard.tagSetup.p7.nextPage = function() {
      // $log.debug('[fob-setup-controller] SHOW NEXT PAGE');

      if ($scope.wizard.tagSetup.tag.tag_name !== undefined) {

        $scope.wizard.tagSetup.tag.setTagFullName();
        // save the tag
        $scope.wizard.tagSetup.tag.store().then(function() {
          $log.debug('[tagSetupControllerPage7] TAG NAME SUCCESSFULLY UPDATED: '+
            $scope.wizard.tagSetup.tag.tagFullName);

          // if($scope.$$phase) {
          //   $scope.$apply(function(){
          //     $scope.wizard.tagSetup.tags.push($scope.wizard.tagSetup.tag);
          //   });
          // } else {
          //   $scope.wizard.tagSetup.tags.push($scope.wizard.tagSetup.tag);
          // }
            // FobService2.fob.tags.loadRefreshTags().then(
            //   function() {
            //     $scope.wizard.tagSetup.tags.push() = FobService2.fob.tags.getTagsArray();
            //   }
            // );

        }, function(status) {
          $log.debug('[tagSetupControllerPage7] TAG NAME UPDATE ERROR: ' +
            status);

        });



      }
    };

    (function() {
      $scope.wizard.pageCode = '406';
      $scope.wizard.tagSetup.p7.includeSource = ($scope.wizard.tagSetup.selectedSetupType
          .toLowerCase() === 'window') ? 'app/views/window-step3.html' :
        'app/views/door-step3.html';

      $scope.wizard.tagSetup.openingMechanisms = $scope.wizard.wizardModel
        .tagSetup.openingMechanisms;

      $scope.wizard.tagSetup.tag.hasScreen = false;
      $scope.wizard.tagSetup.tag.hasBlinds = false;
      $scope.wizard.tagSetup.tag.horizontalBlinds = false;
      $log.debug('[tagSetupControllerPage7] TAG NAME : '+$scope.wizard.tagSetup.tag.tag_name);

      // if($scope.wizard.tagSetup.tag.tag_name === undefined || $scope.wizard.tagSetup.tag.openingMechanism === undefined)
      // if ($scope.wizard.tagSetup.tag.tag_name === undefined || $scope.wizard.tagSetup.tag.tag_name === '') {
        // $scope.wizard.disableNextButton();
        $scope.wizard.tagSetup.tag.setTagFullName();
        // $scope.wizard.tagSetup.tag.tag_name = $scope.wizard.tagSetup.tag.tagFullName;
      // }

      $scope.$on('wizardEvent::showNextPage', $scope.wizard.tagSetup.p7.nextPage);
    })();
  }
})();
