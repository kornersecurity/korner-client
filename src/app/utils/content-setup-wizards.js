App.factory('contentSetupWizards', [
  'gettext',
  function(
    gettext
  ) {
    return {
      TITLE_WELCOME: gettext('Home Setup'),
      TITLE_FOB: gettext('Stick Setup'),
      TITLE_EXTENDER: gettext('Extender Setup'),
      TITLE_TAG: gettext('Tag Setup'),
      TITLE_CIRCLE: gettext('Security Circle Setup'),
      CLOSE_WIZARD_TITLE: gettext('Close Wizard'),
      CLOSE_WIZARD_MESSAGE: gettext(
        'Are you sure you want to exit the home setup wizard?'),
      NO: gettext('No'),
      YES: gettext('Yes'),
      FOB_MISSING: gettext('Waiting for Stick <br/>(Make sure the Stick is properly connected)...'),
      FOB_FIRMWARE_UPDATING: gettext('Firmware update in progress.<br/>Please wait until update is completed.'),
      FOB_ARMED_TITLE: gettext('System Armed'),
      FOB_ARMED: gettext('You must disarm the system before activating new tags.'),
      DISARM_AND_ACTIVATE_TAG: gettext('Disarm and Activate Tag'),
      CANCEL_TAG_ACTIVATION: gettext('Cancel Tag Activation'),
      DISARM_AND_ACTIVATE_EXTENDER: gettext('Disarm and Activate Extender'),
      CANCEL_EXTENDER_ACTIVATION: gettext('Cancel Extender Activation')
    };
  }
]);

App.factory('contentCircleSetup', [
  'gettext',
  function(
    gettext
  ) {
    return {
      INVITATION_SUBJECT: gettext('Korner Safe - Security Circle Invitation'),
      INVITATION_MESSAGE: gettext(
        'I would love for you to join my Korner Security Circle. And with this invite, you can save $10 on your own Korner.'
      ),
      PROCESS_SENDING_INVITATIONS: gettext('Sending invitations...'),
      PROCESS_INVITATIONS_SENT: gettext('Invitations sent successfully.'),
      PROCESS_INVITATIONS_NOT_SENT: gettext('Invitations cannot be sent.'),

      DUPLICATE_EMAIL_ALERT_TITLE: gettext('Email Already Used'),
      DUPLICATE_ADD_EMAIL_ALERT_MESSAGE: gettext(
        'The email address you entered is already in your Security Circle. Please enter a different email address.'
      ),
      DUPLICATE_IMPORT_EMAIL_ALERT_MESSAGE: gettext(
        'One of the email addresses you selected is already in your Security Circle. Please select a different email address.'
      ),

      ADD_CONTACT: gettext('Add Contact Manually'),
      IMPORT_CONTACT: gettext('Import Contacts'),
      CANCEL: gettext('Cancel'),
      ACTIVITY_SHEET_TITLE: gettext('Add Circle Member'),

      LOADING_CONTACTS: gettext('Loading contacts...'),
      RESEND_INVITATION_TITLE: gettext('Resending Invitation...'),
      INVITATION_RESENT_SUCCESS_TITLE: gettext('Invitation resent successfully.'),
      INVITATION_RESENT_FAIL_TITLE: gettext('Invitation cannot be sent.'),

      REMOVE_USER: gettext('Remove User'),
      NO: gettext('No'),
      YES: gettext('Yes'),
      REMOVE_USER_QUESTION_1: gettext('Are you sure you want to remove '),
      REMOVE_USER_QUESTION_2: gettext(' from this security circle?'),
      REMOVING_USER: gettext('Removing user from circle...'),
      USER_REMOVED_SUCCESS: gettext('User removed successfully.'),
      USER_REMOVED_FAIL: gettext('Cannot remove user at this time.'),

      LOAD_CONTACT_FAIL: gettext('Contacts cannot be loaded'),

      SKIP_INVITES_TITLE: gettext('Skip Invitees'),
      SKIP_INVITES_MESSAGE: gettext(
        'You have not sent invitations to everyone on your list. Are you sure you want to skip inviting these people?'
      ),
      CLOSE_WIZARD_TITLE: gettext('Close Wizard'),
      CLOSE_WIZARD_MESSAGE: gettext(
        'Are you sure you want to exit the security circle setup wizard?'),

      SKIP_WIZARD_TITLE: gettext('Skip Wizard'),
      SKIP_WIZARD_MESSAGE: gettext(
        'Are you sure you want to skip the security circle setup wizard?'),


      FEATURE_MASK_UPDATED_SUCCESSFULLY: gettext('User privileges updated successfully'),
      FEATURE_MASK_UPDATE_ERROR: gettext('There was a problem updating user privileges. Please try again.')
    };
  }
]);



App.factory('contentFobSetup', [
  'gettext',
  function(
    gettext
  ) {
    return {
      LOADING_FOB_ADDRESS: gettext('loading Stick data...'),
      FINDING_USER_LOCATION: gettext('Finding your location...'),
      USER_LOCATION_NOT_FOUND: gettext(
        'Sorry, we couldn\'t find your location.'),
      CLOSE_WIZARD_TITLE: gettext('Close Wizard'),
      CLOSE_WIZARD_MESSAGE: gettext(
        'Are you sure you want to exit the Stick Setup wizard?'),
      SAVE_CHANGES_MESSAGE: gettext(
        'You have changed your Stick information. Do you want to save your changes?'
      ),
      REGISTERING_FOB: gettext('Registering Stick...'),
      REGISTRATION_SUCCESSFUL: gettext('Registration sucessful!'),
      REGISTRATION_FAILED: gettext('Error registering Stick, please try again.'),
      FOB_SEARCH_FAILED: gettext(
        'No Sticks were found with the supplied MAC Address.<br/> Please enter a new MAC address and try again.'
      ),
      UPDATING_LOCATION: gettext('Updating Stick information...'),
      LOCATION_UPDATED_SUCCESSFUL: gettext('Update successful.'),
      LOCATION_UPDATED_FAILED: gettext(
        'There was an error updating the Stick information. Please try again.'),
      TAKE_PICTURE: gettext('Take a picture'),
      GALLERY_PICTURE: gettext('Use existing'),
      CANCEL: gettext('Cancel'),
      INVALID_FORM: gettext('Invalid Data'),

      REMOVE_SCHEDULE_TITLE: gettext('Remove Schedule'),
      REMOVE_SCHEDULE_QUESTION: gettext('Are you sure you want to remove this schedule?'),
      REMOVING_SCHEDULE: gettext('Removing Schedule...'),
      SCHEDULE_REMOVED_SUCCESS: gettext('Schedule removed successfully.'),
      SCHEDULE_REMOVED_FAIL: gettext('Cannot remove schedule at this time.'),

      ALARM_SETUP_TITLE: gettext('Alarm Setup'),
      SAVE_ALARM_MESSAGE: gettext(
        'You have changed your alarm information. Do you want to save your changes?'
      ),
    };
  }
]);


App.factory('contentExtenderSetup', [
  'gettext',
  function(
    gettext
  ) {
    return {
      CLOSE_WIZARD_TITLE: gettext('Close Wizard'),
      CLOSE_WIZARD_MESSAGE: gettext(
        'Are you sure you want to exit the Extender Setup wizard?'),
      REMOVE_EXTENDER_TITLE: gettext('Remove Extender'),
      REMOVE_EXTENDER_QUESTION: gettext('Are you sure you want to remove this Extender?'),
      REMOVING_EXTENDER: gettext('Removing Extender...'),
      EXTENDER_REMOVED_SUCCESS: gettext('Extender removed successfully.'),
      EXTENDER_REMOVED_FAIL: gettext('Cannot remove Extender at this time.'),
      UPDATING_EXTENDER_NAME: gettext('Updating Extender info...'),
      EXTENDER_NAME_UPDATE_SUCCESS: gettext('Extender name updated successfully'),
      EXTENDER_NAME_UPDATE_FAIL: gettext('Extender name cannot be updated at this time.'),
      ADD_ANOTHER_TITLE: gettext('Extender Works!'),
      ADD_ANOTHER_YES: gettext('Add Another Extender'),
      ADD_ANOTHER_NO: gettext('Done With Extenders'),
      FIRMWARE_UPDATE_REQUIRED_TITLE: gettext('Extender Setup'),
      FIRMWARE_UPDATE_REQUIRED_DESC: gettext('If you would like to setup an extender, you will require a firmware upgrade for your Stick. Please click <a ng-href="http://support.kornersafe.com" target="_system">here</a> to contact us.')
    };
  }
]);


App.factory('contentTagSetup', [
  'gettext',
  function(
    gettext) {
    return {
      EXTENDER_PAIRED_TITLE: gettext('Extender Paired'),
      EXTENDER_PAIRED_DESC: gettext('Detected pairing of Extender. This Extender will be automatically configured.'),
      CLOSE_WIZARD_TITLE: gettext('Close Wizard'),
      CLOSE_WIZARD_MESSAGE: gettext(
        'Are you sure you want to exit the Tag Setup wizard?'),
      SETUP_TYPE_WINDOW: gettext('Window'),
      SETUP_TYPE_WINDOW_DESC: gettext(
        ''
      ),
      SETUP_TYPE_DOOR: gettext('Door'),
      SETUP_TYPE_DOOR_DESC: gettext(
        '(includes sliding glass doors)'
      ),
      BLANK_NAME_ALERT_TITLE: gettext('Tag Name'),
      BLANK_NAME_ALERT_MESSAGE: gettext(
        'The name of the Tag cannot be blank.'
      ),
      ADD_ANOTHER_TITLE: gettext('Tag Works!'),
      ADD_ANOTHER_YES: gettext('Add Another Tag'),
      ADD_ANOTHER_NO: gettext('Done With Tags'),

      UPDATING_TAG_NAME: gettext('Updating Tag...'),
      TAG_NAME_UPDATE_SUCCESS: gettext('Tag updated successfully.'),
      TAG_NAME_UPDATE_FAIL: gettext('Cannot update Tag at this time.'),

      NO: gettext('No'),
      YES: gettext('Yes'),
      REMOVE_TAG_TITLE: gettext('Remove Tag'),
      REMOVE_TAG_QUESTION: gettext('Are you sure you want to remove this Tag?'),
      REMOVING_TAG: gettext('Removing Tag...'),
      TAG_REMOVED_SUCCESS: gettext('Tag removed successfully.'),
      TAG_REMOVED_FAIL: gettext('Cannot remove Tag at this time.'),

      STEP_INITIALIZING_PORTAL_TITLE: gettext('Initializing'),
      STEP_INITIALIZING_PORTAL_DESC: gettext(
        'Please make sure the cover is properly placed on the Tag'),
      STEP_ANALYZING_PORTAL_TITLE: gettext('Analyzing'),
      STEP_ANALYZING_PORTAL_DESC: gettext(
        'Do not move the portal'),

      STEP_WINDOW_OPEN_PORTAL_TITLE: gettext('Open window, and leave still for a moment...'),
      STEP_WINDOW_OPEN_PORTAL_DESC: gettext(''),
      STEP_WINDOW_CLOSE_PORTAL_TITLE: gettext('OK, now close the window'),
      STEP_WINDOW_CLOSE_PORTAL_DESC: gettext(''),

      STEP_WINDOW_OPEN_SCREEN_TITLE: gettext('Open Screen'),
      STEP_WINDOW_OPEN_SCREEN_DESC: gettext(
        'Please make sure the screen is <strong>open</strong> and window is closed.<br/>Now remove the cover from the Tag and wait 10 seconds and replace cover.'
      ),
      STEP_WINDOW_CLOSE_SCREEN_TITLE: gettext('Close Screen'),
      STEP_WINDOW_CLOSE_SCREEN_DESC: gettext(
        'Please open the window with the *screen closed* and wait for the system to detect open state'
      ),

      STEP_WINDOW_OPEN_BLINDS_TITLE: gettext('Open Blinds'),
      STEP_WINDOW_OPEN_BLINDS_DESC: gettext(
        'Please make sure the blinds are <strong>open</strong> and window is closed.<br/>Now remove the cover from the Tag and wait 10 seconds and replace cover.'
      ),
      STEP_WINDOW_CLOSE_BLINDS_TITLE: gettext('Close Blinds'),
      STEP_WINDOW_CLOSE_BLINDS_DESC: gettext(
        'Please open the window with the *blinds closed* and wait for the system to detect open state'
      ),


      STEP_DOOR_OPEN_PORTAL_TITLE: gettext('Open door, and leave still for a moment...'),
      STEP_DOOR_OPEN_PORTAL_DESC: gettext(''),
      STEP_DOOR_CLOSE_PORTAL_TITLE: gettext('OK, now close the door'),
      STEP_DOOR_CLOSE_PORTAL_DESC: gettext(''),

      STEP_DOOR_OPEN_SCREEN_TITLE: gettext('Open Screen'),
      STEP_DOOR_OPEN_SCREEN_DESC: gettext(
        'Please make sure the screen is <strong>open</strong> and door is closed.<br/>Now remove the cover from the Tag and wait 10 seconds and replace cover.'
      ),
      STEP_DOOR_CLOSE_SCREEN_TITLE: gettext('Close Screen'),
      STEP_DOOR_CLOSE_SCREEN_DESC: gettext(
        'Please open the door with the *screen closed* and wait for the system to detect open state'
      ),

      STEP_DOOR_OPEN_BLINDS_TITLE: gettext('Open Blinds'),
      STEP_DOOR_OPEN_BLINDS_DESC: gettext(
        'Please make sure the blinds are <strong>open</strong> and door is closed.<br/>Now remove the cover from the Tag and wait 10 seconds and replace cover.'
      ),
      STEP_DOOR_CLOSE_BLINDS_TITLE: gettext('Close Blinds'),
      STEP_DOOR_CLOSE_BLINDS_DESC: gettext(
        'Please open the door with the *blinds closed* and wait for the system to detect open state'
      )

    };
  }
]);
