(function() {
	angular.module("lyingman").config(function($routeProvider){
		$routeProvider
		.when("/login", {
			templateUrl: 'app/component/login.html',
			 controller: 'loginController'
		})
		.when("/joinroom", {
			templateUrl: 'app/component/joinroom.html',
			 controller: 'joinroomController'
		})
		.when("/room", {
			templateUrl: 'app/component/room.html',
			controller: 'roomController'
		})
		.otherwise({
		  redirectTo: '/login'
		});
	});
})()
