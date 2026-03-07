app.controller("showUsersCtrl", function ($scope, UserService) {
  $scope.users = [];
  $scope.isLoading = true;
  $scope.currUser = JSON.parse(localStorage.getItem("currUser"));
  console.log($scope.currUser.role);

  UserService.getUsers()
    .then(function (response) {
      $scope.users = response.data;
      console.log($scope.users);
    })
    .finally(function () {
      $scope.isLoading = false;
    });

  $scope.addUser = function () {
    $scope.isPosting = true;
    UserService.createUser($scope.newUser)
      .then(function (res) {
        $scope.users.push(res.data[0] || res.data); // Supabase usually returns an array
        $scope.newUser = {}; // Reset form
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "User added successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch(function (err) {
        console.error("Error adding user: ", err);
        Swal.fire("Error", "Could not add user.", "error");
      })
      .finally(function () {
        $scope.isPosting = false;
      });
  };

  $scope.editUser = function (user) {
    user.isEditing = true;
    // Create a copy of the original data in case of cancel
    user.originalData = angular.copy(user);
    console.log(user);
  };

  $scope.cancelEdit = function (user) {
    user.isEditing = false;
    // Restore original data
    if (user.originalData) {
      user.name = user.originalData.name;
      user.userName = user.originalData.userName;
      user.password = user.originalData.password;
      user.pin = user.originalData.pin;
    }
  };

  $scope.saveUpdate = function (user) {
    // 1. Create a clean object with ONLY database columns
    var dataToUpdate = {
      name: user.name,
      userName: user.userName,
      password: user.password,
      pin: user.pin,
      // Add other database columns here if you have them,
      // but DO NOT include usersID, isEditing, or originalData
    };

    // 2. Pass the clean object to the service
    UserService.updateUser(user.usersID, dataToUpdate)
      .then(function () {
        user.isEditing = false;
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "User info saved successfully.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => window.location.reload());
      })
      .catch(function (err) {
        console.error("Error updating user: ", err);
        // Pro-tip: check err.data.message in the console to see the exact column error
        Swal.fire("Error", "Could not update user.", "error");
      });
  };

  $scope.deleteUser = function (id, index) {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6e7881",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        UserService.deleteUser(id)
          .then(function () {
            $scope.users.splice(index, 1);
            Swal.fire("Deleted!", "User has been removed.", "success");
          })
          .catch(function (err) {
            console.error("Error deleting user: ", err);
            Swal.fire("Error", "Could not delete user.", "error");
          });
      }
    });
  };
});
