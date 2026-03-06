app.service("UserService", function ($http) {
  const API_URL = "https://snelfsnpmftideftesup.supabase.co/rest/v1/Users";

  const config = {
    headers: {
      apikey: "sb_publishable_oS6a7X-nhQMU4TsJS4n6Ug_eB4or508",
      Authorization: "Bearer sb_publishable_oS6a7X-nhQMU4TsJS4n6Ug_eB4or508",
      "content-type": "application/json",
    },
  };

  this.getUsers = function () {
    return $http.get(API_URL, config);
  };

  this.deleteUser = function (id) {
    return $http.delete(API_URL + "?usersID=eq." + id, config);
  };

  this.updateUser = function (id, user) {
    return $http.put(API_URL + "?usersID=eq." + id, user, config);
  };

  this.createUser = function (user) {
    return $http.post(API_URL, user, config);
  };
});
