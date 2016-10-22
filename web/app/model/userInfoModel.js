(function() {
	var userInfoModel = function() {
    var token = '';
    var name = '';
    var id = '';
    var roomnumber = '';
    return {
      token: token,
      name: name,
      id: id,
      roomnumber: roomnumber
    }

	}
	angular.module('lyingman').factory('userInfoModel', userInfoModel);
})()
