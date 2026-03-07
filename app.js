var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/adminDashboard", {
      templateUrl: "views/adminDashboard.html",
      controller: "adminDashboardCtrl",
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
    .when("/showCustomers", {
      templateUrl: "views/showCustomers.html",
      controller: "showCustomersCtrl",
    })
    .when("/showInvoices", {
      templateUrl: "views/showInvoices.html",
      controller: "showInvoicesCtrl",
    })
    .when("/showProducts", {
      templateUrl: "views/showProducts.html",
      controller: "productCtrl",
    })
    .when("/showShifts", {
      templateUrl: "views/showShifts.html",
      controller: "showShiftsCtrl",
    })
    .when("/showUsers", {
      templateUrl: "views/showUsers.html",
      controller: "showUsersCtrl",
    })
    .otherwise({
      redirectTo: "/showProducts",
    });
});
