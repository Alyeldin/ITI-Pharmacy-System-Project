var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/adminDashboard", {
      templateUrl: "views/adminDashboard.html",
      controller: "",
    })
    .when("/checkout", {
      templateUrl: "views/checkout.html",
      controller: "checkoutCtrl",
    })
    .when("/profilePage", {
      templateUrl: "views/profilePage.html",
      controller: "",
    })
    .when("/returnProduct", {
      templateUrl: "views/returnProduct.html",
      controller: "",
    })
    .when("/salesHistory", {
      templateUrl: "views/salesHistory.html",
      controller: "",
    })
    .when("/showCustomers", {
      templateUrl: "views/showCustomers.html",
      controller: "",
    })
    .when("/showInvoices", {
      templateUrl: "views/showInvoices.html",
      controller: "",
    })
    .when("/showProducts", {
      templateUrl: "views/showProducts.html",
      controller: "productCtrl",
    })
    .when("/showShifts", {
      templateUrl: "views/showShifts.html",
      controller: "",
    })
    .when("/showUsers", {
      templateUrl: "views/showUsers.html",
      controller: "showUsersCtrl",
    })
    .otherwise({
      redirectTo: "/showProducts",
    });
});
