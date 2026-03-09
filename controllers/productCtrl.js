app.controller("productCtrl", function ($scope, productService, $timeout) {
  $scope.products = [];

  // used to add product
  $scope.newProduct = {};

  $scope.isLoading = true;

  $scope.currUser = JSON.parse(localStorage.getItem("currUser"));
  console.log($scope.currUser.role);

  $scope.invoice = JSON.parse(localStorage.getItem("invoice")) || [];
  console.log("this is scope.invoice " + $scope.invoice);

  $scope.invTotal = JSON.parse(localStorage.getItem("invTotal") || 0);

  $scope.search = "";
  $scope.selectedCategory = "";
  $scope.selectedType = "";
  $scope.selectedMaterial = "";
  $scope.sortKey = "productName"; // default sort

  $scope.clearAllFilters = function () {
    $scope.search = "";
    $scope.selectedCategory = "";
    $scope.selectedType = "";
    $scope.selectedMaterial = "";
  };

  // Fetch Data
  $scope.load = function () {
    $scope.isLoading = true;
    productService
      .getAllProducts()
      .then(function (res) {
        $scope.products = res.data;
        console.log($scope.products);
      })
      .finally(function () {
        $scope.isLoading = false;
      });
  };

  // search Product

  // Add Product
  $scope.addProduct = function () {
    $scope.isPosting = true;
    productService
      .createProduct($scope.newProduct)
      .then(function (res) {
        $scope.load();

        $scope.newProduct = {};
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Product added successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .finally(function () {
        $scope.isPosting = false;
      });
  };

  // Update Product
  $scope.saveUpdate = function (product) {
      product.isEditing = false;
    productService.updateProduct(product.productID, product).then(function () {
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Product info saved",
        timer: 1500,
        showConfirmButton: false,
      });
    });
  };

  //Remove product
  $scope.removeProduct = function (id, index) {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6e7881",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        productService.deleteProduct(id).then(function () {
          $scope.products.splice(index, 1);
          Swal.fire("Deleted!", "Product has been removed.", "success");
        });
      }
    });
  };

  $scope.editProduct = function (p) {
    p.isEditing = true;
  };
  $scope.cancelEdit = function (p) {
    p.isEditing = false;
  };

  $scope.goToCheckout = function () {
    window.location.href = "#!/checkout";
  };

  $scope.addToInvoice = function (product, quantity) {
    // If quantity is not provided, default to 1
    if (quantity === undefined || quantity === null || quantity === "") {
      quantity = 1;
    }

    if (quantity > product.productQuantity) {
      Swal.fire({
        icon: "error",
        title: "Insufficient Quantity",
        text: "There is no enough quantity of this product",
      });
      return;
    }

    if (quantity < 1) {
      Swal.fire("Error", "Please enter a valid quantity (minimum 1).", "error");
      return;
    }

    $scope.item = {
      productID: product.productID,
      productName: product.productName,
      productPrice: product.productPrice,
      productQuantity: quantity, // Quantity being purchased
      currentStock: product.productQuantity, // Current stock to calculate new stock
    };
    console.log("this is item ", $scope.item);

    $scope.invoice.push($scope.item);

    localStorage.setItem("invoice", JSON.stringify($scope.invoice));

    $scope.invTotal = ($scope.invTotal || 0) + product.productPrice * quantity;

    localStorage.setItem("invTotal", $scope.invTotal);

    // alert("Product added to invoice successfully!");
    Swal.fire("Success", "Product added to invoice!", "success"); // alert(localStorage.getItem("invTotal"));
    // alert(JSON.parse(localStorage.getItem("invoice")));
    // alert(JSON.parse(localStorage.getItem("invoice")).length);
    // alert($scope.invTotal);
    // alert($scope.invoice);
  };

  $scope.clearInvoice = function () {
    localStorage.removeItem("invoice");
    localStorage.removeItem("invTotal");
    $scope.invoice = [];
    $scope.invTotal = 0;
  };

  // $scope.removeItem = function (index, product) {
  //   $scope.invoice.splice(index, 1);
  //   $scope.invTotal -= product.productPrice * quantity;
  //   localStorage.setItem("invoice", JSON.stringify($scope.invoice));
  //   localStorage.setItem("invTotal", $scope.invTotal);
  //   alert("Item removed from invoice successfully!");
  // };

  $scope.removeItem = function (index) {
    var itemToRemove = $scope.invoice[index];

    var amountToSubtract =
      itemToRemove.productPrice * itemToRemove.productQuantity;

    $scope.invTotal = ($scope.invTotal || 0) - amountToSubtract;
    if ($scope.invTotal < 0) $scope.invTotal = 0;

    $scope.invoice.splice(index, 1);

    localStorage.setItem("invoice", JSON.stringify($scope.invoice));
    localStorage.setItem("invTotal", $scope.invTotal.toFixed(2));

    Swal.fire({
      icon: "success",
      title: "Removed",
      text: `${itemToRemove.productName} removed from invoice`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  $scope.load();
});
