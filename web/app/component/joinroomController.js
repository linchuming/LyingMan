(function() {
	var joinroomController = function($scope, webSocketService, userInfoModel, $location) {
    $scope.roomnumber = '';
    var join = function() {
      if($scope.roomnumber>=1000 && $scope.roomnumber<=9999) {
        userInfoModel.roomnumber = $scope.roomnumber;
				$location.path("/offlineroom");
      } else {

      }
    }
    $scope.join = join;
	}
	angular.module('lyingman').controller('joinroomController', joinroomController);
})()
