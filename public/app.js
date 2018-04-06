var app = angular.module("myApp", ['ngResource', 'ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'loginController'
  })
  .when('/register', {
    templateUrl: 'views/register.html',
    controller: 'registerController'
  })
  .when('/dashboard', {
    templateUrl: 'views/dashboard.html',
    controller: 'dashboardController'
  })
  .when('/transactions', {
    templateUrl: 'views/transactions.html',
    controller: 'transactionsController'
  })
  .otherwise({
    redirectTo: '/login'
  })
});
