app.service("productService", function ($http) {
  const API_URL = "https://snelfsnpmftideftesup.supabase.co/rest/v1/Products";

  const config = {
    headers: {
      apikey: "sb_publishable_oS6a7X-nhQMU4TsJS4n6Ug_eB4or508",
      Authorization: "Bearer sb_publishable_oS6a7X-nhQMU4TsJS4n6Ug_eB4or508",
      "content-type": "application/json",
    },
  };

  this.getAllProducts = function () {
    return $http.get(API_URL, config);
  };
  //   this.getProduct = function (id) {
  //     return $http.get(API_URL + "/" + id, config);
  //   };
  this.createProduct = function (product) {
    return $http.post(API_URL, product, config);
  };
  this.updateProduct = function (id, product) {
    return $http.put(API_URL + "?productID=eq." + id, product, config);
  };
  this.deleteProduct = function (id) {
    return $http.delete(API_URL + "?productID=eq." + id, config);
  };
});
