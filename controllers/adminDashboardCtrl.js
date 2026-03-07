app.controller(
  "adminDashboardCtrl",
  function ($scope, UserService, checkoutService, productService) {
    $scope.dashboard = {
      totalCustomers: 0,
      totalRevenue: 0,
      lowStockCount: 0,
    };

    $scope.refreshDashboard = function () {
      loadDashboard();
    };

    function loadDashboard() {
      // 1. Total customers (from Customers table)
      checkoutService
        .getCustomers()
        .then((res) => {
          $scope.dashboard.totalCustomers = res.data.length;
        })
        .catch((err) => console.log("Customers fetch error", err));

      // 2. Total revenue (sum of invoiceTotalPrice)
      checkoutService
        .getInvoices()
        .then((res) => {
          let sum = 0;
          res.data.forEach((inv) => {
            sum += Number(inv.invoiceTotalPrice || 0);
          });
          $scope.dashboard.totalRevenue = sum;
        })
        .catch((err) => console.log("Invoices fetch error", err));

      // 3. Low stock products
      productService
        .getAllProducts()
        .then((res) => {
          const lowStock = res.data.filter(
            (p) => Number(p.productQuantity || 0) < 50,
          );
          $scope.dashboard.lowStockCount = lowStock.length;
        })
        .catch((err) => console.log("Products fetch error", err));
    }

    // Initial load
    loadDashboard();

    $scope.goToLowStock = function () {
      // You can improve this later with query params or shared state
      window.location.href = "#!/showProducts";
      // Later you can add ?lowstock=true and filter in productCtrl
    };
  },
);
