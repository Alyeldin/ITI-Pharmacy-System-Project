app.controller("myctrl", function ($scope) {
  $scope.isLoggedIn = false;
  $scope.loginError = false;
  $scope.credentials = { username: "", password: "" };

  // Hardcoded credentials — replace with a real check if needed
  var VALID_USERNAME = "admin";
  var VALID_PASSWORD = "1234";

  $scope.login = function () {
    if (
      $scope.credentials.username === VALID_USERNAME &&
      $scope.credentials.password === VALID_PASSWORD
    ) {
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

  // $scope.isActive = function (viewLocation) {
  //   return viewLocation === $location.path();
  // };
});
