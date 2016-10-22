(function() {
	var loginController = function($scope) {
		$scope.v = "a"
		console.log("hello world");
		var output = function () {

			console.log("hello world");
		}
		$scope.output = output;
	}
	angular.module('lyingman').controller('loginController', loginController);
})()
