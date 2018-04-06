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
        $window.localStorage["value"] = $scope.username;
        $location.path('/dashboard');
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
        "dlno": $scope.dlno,
        "regno": $scope.regno
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

app.controller('dashboardController', function($http, $scope, $window){
  $http({
    url: '/dashboard',
    method: 'post',
    data: {username: $window.localStorage.value}
  }).then(function(data){
      $scope.details = data.data[0];
      console.log($scope.details);
  }, function(err){});
});

app.controller('transactionsController', function($http, $scope, $window){
  $scope.start_date = '';
  $scope.end_date = '';
  $scope.isData = false;
  var username = $window.localStorage["value"];
  $scope.get_transactions = function(){
    var date = new Date($scope.start_date);
    var start = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + ' ' + date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();
    date = new Date($scope.end_date);
    var end = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + ' ' + date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();
    console.log(start, end);
    $http({
      url: '/transactions',
      method: 'post',
      data: {start: start,
            end: end,
            userid : username 
          }
    }).then(function(data){
        $scope.details = data.data;
        if($scope.details.length)
          $scope.isData = true;
        else {
          $scope.isData = false;
        }
    }, function(err){});
  }
});
