App.factory('contentNotices', [
  'gettext',
  function(
    gettext
  ) {
    return {
      LOADING:         gettext('Loading notices...')
    };
  }
]);
