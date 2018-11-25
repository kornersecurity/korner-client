(function(exports) {

  // access level used by the routes

  var internallevels = {
    none: 0,
    user: 1,
    support: 2,
    supportAdmin: 3
  };

  exports.accessLevels = internallevels;

})(typeof exports === 'undefined' ? this : exports);
