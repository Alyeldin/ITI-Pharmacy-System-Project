app.service("ShiftService", function ($http) {
  const API_URL = "https://snelfsnpmftideftesup.supabase.co/rest/v1/Shift";

  const config = {
    headers: {
      apikey: "sb_publishable_oS6a7X-nhQMU4TsJS4n6Ug_eB4or508",
      Authorization: "Bearer sb_publishable_oS6a7X-nhQMU4TsJS4n6Ug_eB4or508",
      "content-type": "application/json",
    },
  };

  const createConfig = {
    headers: {
      apikey: "sb_publishable_oS6a7X-nhQMU4TsJS4n6Ug_eB4or508",
      Authorization: "Bearer sb_publishable_oS6a7X-nhQMU4TsJS4n6Ug_eB4or508",
      "content-type": "application/json",
      Prefer: "return=representation",
    },
  };

  this.getShifts = function () {
    return $http.get(API_URL, config);
  };
  this.createShift = function (shift) {
    return $http.post(API_URL, shift, createConfig);
  };
  this.updateShift = function (id, shift) {
    return $http.patch(API_URL + "?shiftID=eq." + id, shift, config);
  };
  this.deleteShift = function (id) {
    return $http.delete(API_URL + "?shiftID=eq." + id, config);
  };
});
