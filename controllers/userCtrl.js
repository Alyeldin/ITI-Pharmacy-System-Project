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

    $scope.isLocked = localStorage.getItem("isLocked") === "true";
    $scope.unlockError = false;

    $scope.lockSystem = function () {
      $scope.isLocked = true;
      localStorage.setItem("isLocked", "true");
    };

    $scope.unlockSystem = function () {
      var enteredPin = $scope.credentials.unlockPin;
      if (enteredPin && parseInt(enteredPin) === $scope.currUser.pin) {
        $scope.isLocked = false;
        $scope.unlockError = false;
        localStorage.removeItem("isLocked");
        $scope.credentials.unlockPin = "";
      } else {
        $scope.unlockError = true;
      }
    };

    $scope.pinData = { currentPin: "", newPin: "", confirmPin: "" };
    $scope.pinChangeError = false;
    $scope.pinChangeSuccess = false;
    $scope.pinErrorMsg = "";

    $scope.changePin = function () {
      $scope.pinChangeError = false;
      $scope.pinChangeSuccess = false;

      if (parseInt($scope.pinData.currentPin) !== $scope.currUser.pin) {
        $scope.pinChangeError = true;
        $scope.pinErrorMsg = "Current PIN is incorrect.";
        return;
      }

      if ($scope.pinData.newPin !== $scope.pinData.confirmPin) {
        $scope.pinChangeError = true;
        $scope.pinErrorMsg = "New PIN and Confirm PIN do not match.";
        return;
      }

      if (isNaN($scope.pinData.newPin) || $scope.pinData.newPin.trim() === "") {
        $scope.pinChangeError = true;
        $scope.pinErrorMsg = "New PIN must be a number.";
        return;
      }

      $scope.isChangingPin = true;
      var newPinInt = parseInt($scope.pinData.newPin);

      UserService.updateUser($scope.currUser.usersID, { pin: newPinInt })
        .then(function (res) {
          $scope.pinChangeSuccess = true;
          $scope.currUser.pin = newPinInt;
          localStorage.setItem("currUser", JSON.stringify($scope.currUser));

          $scope.pinData = { currentPin: "", newPin: "", confirmPin: "" };

          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Your PIN has been updated successfully",
            timer: 2000,
            showConfirmButton: false,
          });
        })
        .catch(function (err) {
          $scope.pinChangeError = true;
          $scope.pinErrorMsg = "Failed to update PIN. Please try again.";
        })
        .finally(function () {
          $scope.isChangingPin = false;
        });
    };

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
      localStorage.removeItem("isLocked");
      $scope.isLocked = false;
    };

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  },
);
