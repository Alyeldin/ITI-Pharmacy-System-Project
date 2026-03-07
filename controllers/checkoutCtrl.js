app.controller("checkoutCtrl", function ($scope, checkoutService) {
  // Inject service

  $scope.invoice = JSON.parse(localStorage.getItem("invoice")) || [];
  $scope.invTotal = parseFloat(localStorage.getItem("invTotal")) || 0;
  $scope.customerName;
  $scope.customerPhone;
  $scope.invoiceCompleted = false;

  $scope.checkout = function () {
    if (!$scope.customerName || !$scope.customerPhone) {
      Swal.fire("Error", "Customer name and phone are required.", "error");
      return;
    }
    var invoiceData = {
      items: $scope.invoice,
      total: $scope.invTotal,
      userName: localStorage.getItem("currUser.role"),
      customerName: $scope.customerName,
      customerPhone: $scope.customerPhone,
    };

    // Save to Supabase instead of localStorage
    $scope.checkout = function () {
      checkoutService
        .createInvoice(invoiceData)
        .then(function () {
          // Assume you add createInvoice to service
          checkoutService
            .createCustomer($scope.customer)
            .then(function () {
              $scope.invoiceCompleted = true;
              localStorage.removeItem("invoice"); // Clear temp storage
              localStorage.removeItem("invTotal");
              Swal.fire("Success", "Checkout completed!", "success");
            })
            .catch(function (err) {
              console.error("Error saving customer:", err);
              Swal.fire("Error", "Failed to save customer.", "error");
            });
        })
        .catch(function (err) {
          console.error("Error saving invoice:", err);
          Swal.fire("Error", "Failed to checkout.", "error");
        });
    };
  };

  $scope.printInvoice = function () {
    window.print(); // Simple print; customize with CSS @media print
  };
});
