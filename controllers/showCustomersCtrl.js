app.controller("showCustomersCtrl", function ($scope, checkoutService) {
  $scope.customers = [];
  $scope.isLoading = true;
  $scope.searchQuery = "";

  $scope.loadCustomers = function () {
    $scope.isLoading = true;
    checkoutService
      .getCustomers()
      .then(function (res) {
        $scope.customers = res.data;
        console.log("Customers loaded:", $scope.customers);
      })
      .catch(function (err) {
        console.error("Error loading customers", err);
        Swal.fire({
          icon: "error",
          title: "Database Error",
          text: "Failed to fetch customer records.",
        });
      })
      .finally(function () {
        $scope.isLoading = false;
      });
  };

  // Initialize
  $scope.loadCustomers();
});