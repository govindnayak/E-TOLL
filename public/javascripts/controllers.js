var app = angular.module("myApp");


app.controller('loginController', function($scope, $location, $http, $window) {
  $scope.main = "Login";
  $scope.username = "";
  $scope.password = "";
    $scope.check = function() {
      if($window.localStorage.value)
        return true;
      else {
        return false;
      }
    }

  $scope.login = function() {
    $http({
      url: '/login',
      method: 'post',
      data: {
        "username": $scope.username,
        "password": $scope.password,
      }
    }).then(function(data) {
      if(data.data.success) {
        $location.path('/user');
      }
      else {
        alert(data.data.message);
        location.reload();
      }
    }, function(err){})
  }

  $scope.logout = function() {
    $window.localStorage.clear();
    alert('You have been successfully logged out');
    $location.path('/home');
    location.reload();
  }

});


app.controller('registerController', function($scope, $location, $http, $window) {
  $scope.main = "Register";

  $scope.register = function() {
    $http({
      url: '/register',
      method: 'post',
      data: {
        "fname": $scope.fname,
        "lname": $scope.lname,
        "age": $scope.age,
        "mobile": $scope.mobile,
        "username": $scope.username,
        "password": $scope.password,
        "dlno": $scope.dlno
      }
    }).then(function(data) {
      if(data.data.success) {
        alert("Successfully Registered!")
        $location.path('/login');
      }
      else {
        alert(data.data.message);
        location.reload();
      }
    }, function(err){})
  }
});
