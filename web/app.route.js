(function() {
	angular.module("lyingman").config(function($stateProvider, $urlRouterProvider,$routeProvider){
    // $stateProvider
    //     .state('login', {
		//
    //         templateUrl: 'app/component/login.html',
		// 				controller: 'loginController'
    //     })
    //     $urlRouterProvider.otherwise('login');
		$routeProvider
    .when("/login", {
			templateUrl: 'app/component/login.html',
			 controller: 'loginController'
    })
	});
})()
