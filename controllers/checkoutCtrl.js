app.controller("checkoutCtrl", function ($scope, checkoutService) {
  $scope.invoice = localStorage.getItem("invoice") || [];
  alert($scope.invoice);
  $scope.invTotal = parseFloat(localStorage.getItem("invTotal")) || 0;
  alert($scope.invTotal);

  $scope.customerName = "";
  $scope.customerPhone = "";

  $scope.invoiceCompleted = false;

  $scope.checkout = function () {
    if (!$scope.customerName || !$scope.customerPhone) {
      Swal.fire("Error", "Customer name and phone are required.", "error");
      return;
    }

    $scope.invoiceData = {
      items: $scope.invoice,
      total: $scope.invTotal,
      customerName: $scope.customerName,
      customerPhone: $scope.customerPhone,
    };
    alert($scope.invoiceData);
    checkoutService
      .createInvoice(invoiceData)

      .then(function () {
        return checkoutService.createCustomer({
          name: $scope.customerName,
          phone: $scope.customerPhone,
        });
      })

      .then(function () {
        $scope.invoiceCompleted = true;

        localStorage.removeItem("invoice");
        localStorage.removeItem("invTotal");

        Swal.fire("Success", "Checkout completed!", "success");
      })

      .catch(function (err) {
        console.error("Checkout error:", err);

        Swal.fire("Error", "Failed to checkout.", "error");
      });
  };

  $scope.printInvoice = function () {
    window.print();
  };
});
