'use strict';

// Declare app level module which depends on views, and components
angular.module('dapContacts', [
  'ngRoute',
  'firebase',
  'dapContacts.contacts'
]).
config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/contacts'
    });
  }
]);