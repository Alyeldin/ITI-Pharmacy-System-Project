app.controller("userCtrl", function ($scope, $location, UserService) {
  $scope.isLoggedIn = false;
  $scope.loginError = false;
  $scope.credentials = { username: "", password: "" };
  $scope.users = [];
  $scope.currUser = {};

  // ✅ CHECK IF USER WAS ALREADY LOGGED IN (on page refresh)
  if (localStorage.getItem("isLoggedIn") === "true") {
    $scope.isLoggedIn = true;
    $scope.currUser = JSON.parse(localStorage.getItem("currUser"));
  }

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
    var matched = $scope.users.find(function (user) {
      $scope.currUser = user;

      return (
        user.userName === $scope.credentials.username &&
        user.password === $scope.credentials.password
      );
    });

    if (matched) {
      $scope.isLoggedIn = true;
      $scope.loginError = false;

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currUser", JSON.stringify($scope.currUser));
      localStorage.setItem("username", $scope.credentials.username);
    } else {
      $scope.loginError = true;
    }
  };

  $scope.logout = function () {
    $scope.isLoggedIn = false;
    $scope.credentials = { username: "", password: "" };
    $scope.loginError = false;

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currUser");
    localStorage.removeItem("username");
  };

  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };
});
