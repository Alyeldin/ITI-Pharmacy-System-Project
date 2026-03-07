app.controller(
  "checkoutCtrl",
  function ($scope, checkoutService, productService, $q) {
    try {
      $scope.invoice = JSON.parse(localStorage.getItem("invoice")) || [];
    } catch (e) {
      $scope.invoice = [];
    }

    $scope.invTotal = parseFloat(localStorage.getItem("invTotal")) || 0;

    $scope.customerName = "";
    $scope.customerPhone = "";

    $scope.invoiceCompleted = false;

    $scope.checkout = function () {
      if (!$scope.customerName || !$scope.customerPhone) {
        Swal.fire("Error", "Customer name and phone are required.", "error");
        return;
      }

      var currUser = JSON.parse(localStorage.getItem("currUser")) || {};

      $scope.invoiceData = {
        invoiceItems: $scope.invoice,
        invoiceTotalPrice: $scope.invTotal,
        customerName: $scope.customerName,
        userName: currUser.userName || currUser.name,
      };

      Swal.fire({
        title: "Processing Checkout...",
        text: "Please wait while we update inventory and save your invoice.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // 1. Update Product Quantities
      var updatePromises = $scope.invoice.map(function (item) {
        if (!item.productID) return $q.resolve();

        var newQty = (item.currentStock || 0) - item.productQuantity;
        if (newQty < 0) newQty = 0;

        return productService.updateProduct(item.productID, {
          productQuantity: newQty,
        });
      });

      $q.all(updatePromises)
        .then(function () {
          // 2. Create Invoice
          return checkoutService.createInvoice($scope.invoiceData);
        })
        .then(function () {
          // 3. Create/Update Customer
          return checkoutService.createCustomer({
            customerName: $scope.customerName,
            customerPhone: $scope.customerPhone,
          });
        })
        .then(function () {
          $scope.invoiceCompleted = true;
          localStorage.removeItem("invoice");
          localStorage.removeItem("invTotal");

          Swal.fire(
            "Success",
            "Checkout completed and inventory updated!",
            "success",
          );
        })
        .catch(function (err) {
          console.error("Checkout error:", err);
          var errMsg =
            err.data && err.data.message ? err.data.message : "Unknown error";
          Swal.fire("Error", "Failed to checkout: " + errMsg, "error");
        });
    };

    $scope.printInvoice = function () {
      window.print();
    };
  },
);
