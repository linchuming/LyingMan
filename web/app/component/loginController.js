(function() {
	var loginController = function($scope, webSocketService, userInfoModel, $location) {
		$scope.name = '';
		var signIn = function (mode) {
			var data = {
				name: $scope.name
			};
			webSocketService.sendAPI('login', data, true);
			console.log($scope.name);
			userInfoModel.mode = mode;
		};
		$scope.signIn = signIn;

		webSocketService.onmessage(function(msg) {
			var obj = JSON.parse(msg.data);
			console.log(obj);
			if(obj.type != undefined) {
				var data = obj.data;
				switch (obj.type) {
					case 'login_succ':
						var data = obj.data;
						userInfoModel.name = data.name;
						userInfoModel.id = data.id;
						userInfoModel.token = data.token;
						console.log(userInfoModel.token);
						$location.path('/joinroom');
						$scope.$apply();
						break;
					default:

				}
			}
		});

	};
	angular.module('lyingman').controller('loginController', loginController);
})();
