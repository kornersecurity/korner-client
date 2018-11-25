// xdescribe('contactsService', function()
// {
//   var scope, service, navigatorMock;
//
//   beforeEach(function()
//   {
//     navigatorMock = {contacts: {find: function ()
//       {
//         return [
//           {
//             first_name: 'First',
//             last_name:  'User',
//             emails:    ['first@user.com', 'first_2@user.com'],
//           },
//           {
//             first_name: 'Second',
//             last_name:  'User',
//             email:     ['second@user.com'],
//           },
//           {
//             first_name: 'Third',
//             last_name:  'User',
//             email:     ['third@user.com'],
//           },
//           {
//             first_name: 'Third',
//             last_name:  'User',
//             email:     [],
//           },
//           {
//             first_name: '',
//             last_name:  '',
//             email:     ['third@user.com'],
//           }
//         ];
//       }}
//     };
//   });
//
//   beforeEach(module('app.core'), inject(function($provide)
//   {
//      $provide.value('navigator', navigatorMock);
//   }));
//
//   beforeEach(inject(['$rootScope', 'contactsService', function($rootScope, contactsService, $provide) {
//    scope = $rootScope.$new();
//    service = contactsService;
//   }]));
//
//   it('is instantiated', function()
//   {
//     expect(service).toBeDefined();
//   });
// //getName
// //loadContacts
//
//   // it('should get first and last name', function()
//   // {
//   //   expect(service.getName(service.loadContacts()[0]).toEqual('First User');
//   // });
//
//   it('find three contacts', function()
//   {
//     expect(service.loadContacts().length).toEqual(5);
//   });
// });
