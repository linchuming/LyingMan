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
		.when("/offlineroom", {
			templateUrl: 'app/component/offlineroom.html',
			 controller: 'offlineroomController'
		})
		.otherwise({
		  redirectTo: '/login'
		});




	});
})()
