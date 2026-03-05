app.controller("userCtrl", function ($scope, $location, UserService) {
  $scope.isLoggedIn = false;
  $scope.loginError = false;
  $scope.credentials = { username: "", password: "" };
  $scope.users = [];
  // Hardcoded credentials — replace with a real check if needed
  // var VALID_USERNAME = "admin";
  // var VALID_PASSWORD = "1234";
  UserService.getUsers()
    .then(function (response) {
      $scope.users = response.data;
      console.log($scope.users);
    })
    .catch(function (error) {
      console.log(error);
    });
  $scope.login = function () {
    $scope.loginAttempted = true;
    console.log("Users from DB:", $scope.users); 
    var matched = $scope.users.find(function (user) {
      return (
        user.userName === $scope.credentials.username &&
        user.password === $scope.credentials.password
      );
    });

    if (matched) {
      $scope.isLoggedIn = true;
      $scope.loginError = false;
    } else {
      $scope.loginError = true;
    }
  };

  $scope.logout = function () {
    $scope.isLoggedIn = false;
    $scope.credentials = { username: "", password: "" };
    $scope.loginError = false;
  };

  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };
});
