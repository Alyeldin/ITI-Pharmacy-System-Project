app.controller("productCtrl", function ($scope, productService) {
  $scope.products = [];

  // used to add product
  $scope.newProduct = {};

  $scope.isLoading = true;

  $scope.currUser = JSON.parse(localStorage.getItem("currUser"));
  console.log($scope.currUser.role);

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
        $scope.products.unshift(res.data);
        $scope.newProduct = {};
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Product added successfully",
          timer: 2000,
          showConfirmButton: false,
        }).then(function () {
          window.location.reload();
        });
      })
      .finally(function () {
        $scope.isPosting = false;
        // window.location.reload();
      });
  };

  // Update Product
  $scope.saveUpdate = function (product) {
    productService.updateProduct(product.productID, product).then(function () {
      product.isEditing = false;
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

  $scope.load();
});
