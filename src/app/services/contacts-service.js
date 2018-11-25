(function() {
  'use strict';

  /*jshint validthis: true */

  angular
    .module('app.core')
    .service('contactsService', contactsService);

  /* @ngInject */
  function contactsService(
    $q,
    $cordovaContacts,
    $log
  ) {
    var self = this;


    // list of exported public methods
    return {
      getName: getName,
      loadContacts: loadContacts,
      findContacts: findContacts
    };

    // initializer
    function init() {


    }

    function getName(contact) {
      var name = '';

      if(contact.name.formatted) {
        return contact.name.formatted;
      }

      if(contact.name.givenName) {
        name = contact.name.givenName;
      }

      if(contact.name.familyName) {
        name += " " + contact.name.familyName;
      }

      return name;
    }

    function findContacts(filter, list) {
      var filteredContacts = [];
      for(var contact in list) {
        if(contact.first_name.indexOf(filter) == -1 ||
           contact.last_name.indexOf(filter) == -1 ||
           contact.email.indexOf(filter) == -1)
        {
          filteredContacts.push(contact);
        }
      }
      return filteredContacts;
    }

    function loadContacts() {
      var defer = $q.defer();
      var self = this;
      // $log.debug("[contacts-service] NAVIGATOR: "+navigator);
      if(navigator) {
        // $log.debug("[contacts-service] NAVIGATOR CONTACTS: "+navigator.contacts);
        var fields = ['name', 'emails', 'id'];
        var options = new ContactFindOptions('', true);  // {filter, multiple}

        navigator.contacts.find(fields, function(contacts)
        {
          $log.debug("[contacts-service] CONTACTS: "+contacts.length);
          var contactEmails = [];
          for(var c in contacts)
          {
            var contact = contacts[c];
            // $log.debug("[contacts-service] NAVIGATOR CONTACT: "+getName(contact));

            for(var e in contact.emails)
            {
              // $log.debug("[contacts-service] NAVIGATOR CONTACT EMAIL: " + contact.emails[0].value);
              var first_name = '';
              if(contact.name && contact.name.givenName && contact.name.familyName)
                first_name = contact.name.givenName;

              var last_name = '';
              if(contact.name && contact.name.familyName)
                last_name = contact.name.familyName;

              contactEmails.push({fullname: getName(contact), first_name: first_name, last_name: last_name, email: contact.emails[e].value.toLowerCase()});
            }
          }
          defer.resolve(contactEmails);
        },
        function(error)
        {
          defer.reject(error);
        }, options);

      } else {
        defer.reject();
      }
      return defer.promise;
    }
  }
})();
