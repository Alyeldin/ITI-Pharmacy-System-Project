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
      prefer: "return =representation",
    },
  };

  this.getInvoices = function () {
    return $http.get(API_INVOICES, config);
  };
  this.getCustomers = function () {
    return $http.get(API_CUSTOMERS, config);
  };

  // Search customer by phone
  this.searchCustomerByPhone = function (phone) {
    return $http.get(`${API_CUSTOMERS}?phone=eq.${phone}`, config);
  };

  this.createInvoice = function (invoiceData) {
    return $http.post(API_INVOICES, invoiceData, config);
  };
  // Create new customer (NEW - fix the endpoint)
  this.createCustomer = function (customer) {
    return $http.post(API_CUSTOMERS, customer, config);
  };
});
