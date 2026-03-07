app.service("checkoutService", function ($http) {
  const API_INVOICES =
    "https://snelfsnpmftideftesup.supabase.co/rest/v1/Invoices";
  const API_CUSTOMERS =
    "https://snelfsnpmftideftesup.supabase.co/rest/v1/Customers";

  const config = {
    headers: {
      apikey: "sb_publishable_oS6a7X-nhQMU4TsJS4n6Ug_eB4or508",
      Authorization: "Bearer sb_publishable_oS6a7X-nhQMU4TsJS4n6Ug_eB4or508",
      "content-type": "application/json",
    },
  };

  this.getInvoices = function () {
    return $http.get(API_INVOICES, config);
  };
  this.getCustomers = function () {
    return $http.get(API_CUSTOMERS, config);
  };

  this.createInvoice = function (invoice) {
    return $http.post(API_INVOICES, invoice, config);
  };
  this.createCustomers = function (customer) {
    return $http.post(API_INVOICES, customer, config);
  };

  this.createInvoice = function (invoice) {
    return $http.post(API_INVOICES, invoice, config);
  };
  this.createCustomers = function (customer) {
    return $http.post(API_INVOICES, customer, config);
  };
});
