app.controller("showShiftsCtrl", function ($scope, UserService, ShiftService) {
  $scope.shifts = [];
  $scope.users = [];
  $scope.isLoading = true;

  // Retrieve existing mapping of userID to userName for easy display
  $scope.userMap = {};

  $scope.fetchShifts = function () {
    $scope.isLoading = true;

    // Fetch all users first to map their IDs to Names
    UserService.getUsers()
      .then(function (userRes) {
        $scope.users = userRes.data;
        $scope.users.forEach(function (u) {
          $scope.userMap[u.usersID] = u;
        });

        // Then fetch all shifts
        ShiftService.getShifts()
          .then(function (shiftRes) {
            var allShifts = shiftRes.data;

            $scope.shifts = allShifts.map(function (s) {
              var mappedShift = {
                shiftID: s.shiftID,
                userID: s.userID,
                userName: $scope.userMap[s.userID]
                  ? $scope.userMap[s.userID].name
                  : "Unknown User",
                role: $scope.userMap[s.userID]
                  ? $scope.userMap[s.userID].role
                  : "Unknown Role",
                loginTime: null,
                logoutTime: null,
                shiftTime: s.shiftTime, // Contains the float duration
              };

              // Parse the JSON array to find login/logout times
              if (s.shiftArr && Array.isArray(s.shiftArr)) {
                s.shiftArr.forEach(function (event) {
                  if (event.login) {
                    mappedShift.loginTime = new Date(event.login);
                  }
                  if (event.logout) {
                    mappedShift.logoutTime = new Date(event.logout);
                  }
                });
              }

              return mappedShift;
            });

            // Sort by most recent login descending
            $scope.shifts.sort(function (a, b) {
              return (b.loginTime || 0) - (a.loginTime || 0);
            });
          })
          .catch(function (err) {
            console.error("Error fetching shifts", err);
          })
          .finally(function () {
            $scope.isLoading = false;
          });
      })
      .catch(function (err) {
        console.error("Error fetching users for shift translation", err);
        $scope.isLoading = false;
      });
  };

  // Initial load
  $scope.fetchShifts();
});
