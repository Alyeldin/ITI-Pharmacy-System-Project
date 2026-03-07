app.controller(
  "userCtrl",
  function ($scope, $location, UserService, ShiftService) {
    $scope.isLoggedIn = false;
    $scope.loginError = false;
    $scope.credentials = { username: "", password: "" };
    $scope.users = [];
    $scope.currUser = {};

    // CHECK IF USER WAS ALREADY LOGGED IN (on page refresh)
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

        // Track shift
        var loginTime = new Date().toISOString();
        var shiftData = {
          userID: $scope.currUser.usersID,
          shiftArr: [{ login: loginTime }],
        };

        ShiftService.createShift(shiftData)
          .then(function (res) {
            // Supabase returns an array of the created resource(s) when using Prefer: return=representation.
            // If not returning representation, it might be empty or require fetching.
            // In most of the existing code, res.data[0] or res.data is used.
            var createdShift = Array.isArray(res.data) ? res.data[0] : res.data;
            if (createdShift && createdShift.shiftID) {
              localStorage.setItem("currentShiftID", createdShift.shiftID);
              localStorage.setItem("currentShiftLoginTime", loginTime);
            }
          })
          .catch(function (err) {
            console.error("Failed to create shift session: ", err);
          });

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

      // Update shift on logout
      var shiftID = localStorage.getItem("currentShiftID");
      var loginTimeStr = localStorage.getItem("currentShiftLoginTime");

      if (shiftID && loginTimeStr) {
        var logoutTime = new Date();
        var loginTime = new Date(loginTimeStr);

        // Calculate diff in hours
        var diffMs = logoutTime.getTime() - loginTime.getTime();
        var diffHours = diffMs / (1000 * 60 * 60);

        // Fetch the existing shift first (to preserve the login time node)
        // or since we know it's a simple array of 2 objects, we can just build it:
        var updateData = {
          shiftArr: [
            { login: loginTimeStr },
            { logout: logoutTime.toISOString() },
          ],
          shiftTime: Number(diffHours.toFixed(2)),
        };

        ShiftService.updateShift(shiftID, updateData)
          .then(function () {
            localStorage.removeItem("currentShiftID");
            localStorage.removeItem("currentShiftLoginTime");
          })
          .catch(function (err) {
            console.error("Failed to update shift on logout: ", err);
          });
      }

      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currUser");
      localStorage.removeItem("username");
    };

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  },
);
