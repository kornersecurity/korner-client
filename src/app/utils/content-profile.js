(function() {
  'use strict';

  angular.module('app.profile')
    .factory('contentProfile', contentProfile);

  function contentProfile(
    gettext
  ) {
    return {
      UPDATING_PROFILE:  gettext('Updating profile information...'),
      UPDATE_SUCCESSFUL: gettext('Information updated successfully'),
      UPDATE_FAILED:
        gettext('There was a problem updating your profile. Please try agian.'),
      CLOSE_PROFILE_TITLE:  gettext('Account Profile'),
      SAVE_CHANGES_MESSAGE: gettext('Do you want to save your changes?'),
      YES: gettext('YES'),
      NO: gettext('NO'),
    };
  }
})();
