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
  .when('/user', {
    templateUrl: 'views/user.html',
    controller: 'homeController'
  })

  .otherwise({
    redirectTo: '/login'
  })
});
