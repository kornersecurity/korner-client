App.factory('contentInvites', [
  'gettext',
  function(
    gettext
  ) {
    return {
      LOADING:         gettext('Loading Invitations...'),
      STATUS_ACCEPTED: gettext('Accepted'),
      STATUS_DECLINED: gettext('Declined'),
      STATS_PENDING:   gettext('Pending'),
      ACCEPTING:       gettext('Accepting invitation...'),
      DECLINING:       gettext('Declining invitation...'),
      ACCEPTED:        gettext('Invitation accepted'),
      DECLINED:        gettext('Invitation declined'),
      NO:              gettext('No'),
      YES:             gettext('Yes')
    };
  }
]);
