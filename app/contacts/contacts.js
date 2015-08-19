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
  }
])
  .service('shareContact', [

    function () {
      var share = this;

      share.passContact = function (c) {
        share.contact = c;
      };
      share.clearContact = function () {
        share.contact = {};
      };

    }
  ])

//CONTROLLER
.controller('ContactsCtrl', ['$scope', '$firebaseArray', 'shareContact',

  function ($scope, $firebaseArray, shareContact) {
    var fbRef = new Firebase('https://dap-contacts.firebaseio.com/contacts');

    // Clear $scope Fields
    function clearFields() {
      console.log('Clearing All Fields...');

      $scope.name = '';
      $scope.email = '';
      $scope.company = '';
      $scope.mobile_phone = '';
      $scope.home_phone = '';
      $scope.work_phone = '';
      $scope.street_address = '';
      $scope.city = '';
      $scope.state = '';
      $scope.zipcode = '';
    }

    //GET CONTACTS
    $scope.contacts = $firebaseArray(fbRef);
    console.log($scope.contacts);

    //SHOW & HIDE ADDFORM
    $scope.showAddForm = function () {
      $scope.addFormShow = true;
    };
    $scope.hide = function () {
      $scope.addFormShow = false;
    };
    //SUBMIT ADD FORM
    $scope.addFormSubmit = function () {

      //assign values
      var name = $scope.name || null;
      var email = $scope.email || null;
      var company = $scope.company || null;
      var mobile_phone = $scope.mobile_phone || null;
      var home_phone = $scope.home_phone || null;
      var work_phone = $scope.work_phone || null;
      var street_address = $scope.street_address || null;
      var city = $scope.city || null;
      var state = $scope.state || null;
      var zipcode = $scope.zipcode || null;

      $scope.contacts.$add({
        name: name,
        email: email,
        company: company,
        phone: [{
          mobile: mobile_phone,
          home: home_phone,
          work: work_phone
        }],
        address: [{
          street_address: street_address,
          city: city,
          state: state,
          zipcode: zipcode
        }]
      })
        .then(function (fbRef) {
          var id = fbRef.key();
          console.log('Added Ccontact with ID: ' + id);

          // Clear Form
          clearFields();

          // Hide Form
          $scope.addFormShow = false;

          // Send Message
          $scope.msg = 'Contact Added';
        });

    };
    $scope.shareContact = function (c) {
      shareContact.passContact(c);
    };
  }
])

.controller('ContactCtrl', ['$scope', 'shareContact',
  function ($scope, shareContact) {
    $scope.contact = shareContact.contact;
    console.log($scope.contact);
  $scope.clearContact = function () {
      shareContact.clearContact();
    };
  }
]);