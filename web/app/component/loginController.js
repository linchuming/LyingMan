(function() {
	var loginController = function($scope, webSocketService, userInfoModel, $location) {
		$scope.name = '';
		var signIn = function () {
				var obj = {
						type: 'login',
						data: {
								name: $scope.name
						}
				};
				var msg = JSON.stringify(obj);
				webSocketService.send(msg);
				console.log($scope.name);
				$location.path("/joinroom")
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
						break;
					default:

				}
			}
		});

	}
	angular.module('lyingman').controller('loginController', loginController);
})()
