app.controller("showInvoicesCtrl", function ($scope, checkoutService) {
  $scope.invoices = [];
  $scope.isLoading = true;

  $scope.loadInvoices = function () {
    $scope.isLoading = true;
    checkoutService
      .getInvoices()
      .then(function (res) {
        $scope.invoices = res.data;
        console.log("Invoices loaded:", $scope.invoices);
      })
      .catch(function (err) {
        console.error("Error loading invoices", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load invoices!",
        });
      })
      .finally(function () {
        $scope.isLoading = false;
      });
  };

  // Initialize
  $scope.loadInvoices();

  $scope.printInvoice = function (invoice) {
    // Basic print functionality for a specific invoice
    // In a real scenario, this might open a new window with a printable template
    window.print();
  };
});
