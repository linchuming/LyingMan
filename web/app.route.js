(function() {
	angular.module("lyingman").config(function($routeProvider){
		$routeProvider
    .when("/login", {
			templateUrl: 'app/component/login.html',
			 controller: 'loginController'
    })
	});
})()
