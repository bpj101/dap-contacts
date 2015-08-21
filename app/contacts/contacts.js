'use strict';

angular.module('dapContacts.contacts', ['ngRoute', 'firebase'])

.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/contacts', {
        templateUrl: 'contacts/contacts.html',
        controller: 'ContactsCtrl'
      })
      .when('/contact/:contactId', {
        templateUrl: 'contacts/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/contact/edit/:contactId', {
        templateUrl: 'contacts/contact_edit.html',
        controller: 'ContactEditCtrl'
      })
  }
])
//Sets firebase URL
.constant('firebaseURI', 'https://dap-contacts.firebaseio.com/contacts')

//Sets up contacts service into Firebase
.factory('contactsService', ['$firebaseArray', '$filter', 'firebaseURI',
  function ($firebaseArray, $filter, firebaseURI) {
    var ref = new Firebase(firebaseURI);
    var contacts = $firebaseArray(ref);
    this.contact = [];

    var getContacts = function () {
      return contacts;
    };
    var setContact = function (id) {
      var setContact;

      this.contact = contacts.$getRecord(id);
      // setContact = $filter('filter')(contacts, {
      //   $id: id
      // });
      // this.contact = setContact[0];
      console.log(this.contact);
    };

    var addContact = function (contact) {
      contacts.$add(contact)
        .then(function (ref) {
          var id = ref.key();
          console.log('Added Ccontact with ID: ' + id);
        });
    };

    var updateContact = function (contact) {
      contacts.$save(contact)
        .then(function (ref) {
          var id = ref.key();
          console.log('Updated Ccontact with ID: ' + id);
        });
    };

    var removeContact = function (id) {
      contacts.$remove(id);
    };
    return {
      ref: ref,
      contact: this.contact,
      getContacts: getContacts,
      setContact: setContact,
      addContact: addContact,
      updateContact: updateContact,
      removeContact: removeContact
    };
  }
])

//CONTROLLER
.controller('ContactsCtrl', ['$scope', 'contactsService',
  function ($scope, contactsService) {

    //GET CONTACTS
    $scope.contacts = contactsService.getContacts();
    var ref = contactsService.ref;
    console.log($scope.contacts, ref);


    $scope.hide = function () {
      $scope.addFormShow = false;
    };

    $scope.clearContact = function () {
      $scope.newContact = {
        name: null,
        email: null,
        company: null,
        phone: [{
          mobile: null,
          home: null,
          work: null
        }],
        address: [{
          street_address: null,
          city: null,
          state: null,
          zipcode: null
        }]
      };
      console.log($scope.newContact);
    };

    $scope.addContact = function () {
      contactsService.addContact(angular.copy($scope.newContact));
      $scope.clearContact();
      $scope.hide();
      $scope.msg = 'Contact Added';
    };

    $scope.setContact = function (id) {
      contactsService.setContact(id);
    };

    $scope.deleteContact = function (id) {
      contactsService.removeContact(id);
    };

    //SHOW & HIDE ADDFORM
    $scope.showAddForm = function () {
      $scope.addFormShow = true;
    };

  }
])

.controller('ContactCtrl', ['$scope', 'contactsService',
  function ($scope, contactsService) {
    $scope.contact = contactsService.contact;


    console.log($scope.contact);
  }
])

.controller('ContactEditCtrl', ['$scope', '$location', 'contactsService',
  function ($scope, $location, contactsService) {
    $scope.contact = contactsService.contact;

    $scope.undoContact = function () {
      $scope.contact = contactsService.contact;
    }
    console.log($scope.contact);

    $scope.updateContact = function (contact) {
      contactsService.updateContact(contact);
      $location.path('contacts');
    };

    // $scope.clearContact = function () {
    //   shareContact.clearContact();
    // };
  }
]);