(function() {
	angular.module("LyingMan").config(function($stateProvider){    
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'components/login.html',
			controller: 'components/loginController.js'			
        })   
        
	});
})()