//
// user-service.js
//
angular.module('app.core')
  .service('userService', [
  'Restangular',
  'fobUserStatusConst',
  'fobUserTypeConst',
  '$log',
  function(
    Restangular,
    fobUserStatusConst,
    fobUserTypeConst,
    $log
  ) {

    var users = [];

    var userCount = 0;

    function getFobUsers(fobId, success) {
      resetServiceData();
      users = [];
      Restangular.one('fobs', fobId).getList('users').then(function(fobUsers) {
        users = fobUsers.plain();
        initUsers();
        userCount = users.length;

        if (success !== undefined)
          success(users, userCount);
      });
    }

    function getUsers() {
      return users;
    }

    function getUserByFobUserId(fobUserId) {
      var user = null;

      for (var u in users) {
        if (users[u].fob_user_id === fobUserId) {
          user = users[u];
        }
      }

      return user;
    }

    function initUsers() {
      // $log.debug("[user-service] USERS: "+users.length);
      /*
      for(var o in users)
      {
        var owner = users[o];
        if(owner.fob_user_type_id === fobUserTypeConst.TYPE_OWNER)
        {
            $log.debug("[user-service] REMOVING OWNER - USER: "+o, owner.first_name, owner.last_name, owner.fob_user_type_id, (owner.fob_user_type_id !== fobUserTypeConst.TYPE_OWNER));
            // TEMP disable fob owner delete so circle feed works TEMP
            // users.splice(o, 1);
        }
      }
      */

      // $log.debug("[user-service] USERS: "+users.length);

      for (var u in users) {
        var user = users[u];
        // Kept "status" for legacy purposes (we could/should remove it and simply use fob_user_status_id)
        user.status = user.fob_user_status_id;
        user.fullname = setFullName({
          first_name: user.first_name,
          last_name: user.last_name
        });

        // $log.debug("[user-service] FULLNAME: "+users[u].fullname, users[u].status, (owner.fob_user_type_id === fobUserTypeConst.TYPE_OWNER));
      }

    }

    function getImageUrl(fobUserId, imageSize) {
      return getUserByFobUserId(fobUserId).image_url + '/' + imageSize + '.jpg';
    }


    function getChatName(fobUserId) {
      var user = getUserByFobUserId(fobUserId);

      if (user && user.nick_name) {
        return user.nick_name;
      }
      return user.first_name;
    }

    function addUser(userData) {

      users.unshift({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        fullname: setFullName({
          first_name: userData.first_name,
          last_name: userData.last_name
        }),
        status: fobUserStatusConst.STATUS_NEW
      });

      return users;
    }

    function updateUser(userData) {

      for (var i in users) {
        var user = users[i];
        if (user.email === userData.email) {
          user.email = userData.email;
          user.status = userData.fob_user_status_id;
          user.fob_user_status_id = userData.fob_user_status_id;
          user.fob_user_id = userData.fob_user_id;
        }
        $log.debug("[user-service] UPDATING: " + user.email, userData.email, user.status);
      }

      return users;
    }

    function removeUser(fob_user_id) {
      $log.debug("[user-service] USERS BEFORE REMOVE: " + users.length);

      for (var u in users) {
        if (users[u].fob_user_id === fob_user_id) {
          users.splice(u, 1);
          break;
        }
      }

      $log.debug("[user-service] USERS AFTER REMOVE: " + users.length);

      return users;
    }

    function hasUsersWithStatus(status) {


      for (var u in users) {
        if (users[u].status === status && users[u].fob_user_type_id !== fobUserTypeConst.TYPE_OWNER) {
          // $log.debug('FOUN AT LEAST ONE USER WITH STATUS '+status);
          return true;
        }
      }
      // $log.debug('NO USERS WITH STATUS '+status);
      return false;
    }

    function countUsersByStatus(status) {
      var userCount = 0;
      for (var u in users) {
        // $log.debug("[user-service] USERS STATUS: "+users.length);
        if (users[u].fob_user_status_id === status && users[u].fob_user_type_id !== fobUserTypeConst.TYPE_OWNER) {
          userCount++;
        }
      }
      return userCount;
    }

    function setFullName(user) {
      return user.first_name + ' ' + user.last_name;
    }

    function resetServiceData() {
      $log.debug("[user-service] USER DATA RESET!");
      userCount = -1;
      users = [];
    }


    var theService = {
      resetServiceData: resetServiceData,
      getFobUsers: getFobUsers,
      getImageUrl: getImageUrl,
      getChatName: getChatName,
      addUser: addUser,
      updateUser: updateUser,
      removeUser: removeUser,
      setFullName: setFullName,
      hasUsersWithStatus: hasUsersWithStatus,
      countUsersByStatus: countUsersByStatus,
      getUsers: getUsers
    };


    return theService;
  }
]);
