(function() {
	var roomController = function($scope, webSocketService, userInfoModel, $location) {
		//初始化房间
        var usernumber = 0;
		var initializeRoom = function() {
			var data = {
				number: userInfoModel.roomnumber
			};
			//登录房间
			webSocketService.sendAPI('join_room', data);

			$scope.roomnumber = userInfoModel.roomnumber;
			$scope.usernumber = usernumber;
		};
		initializeRoom();

        $scope.startGame = function() {
            webSocketService.sendAPI('start_game', {game_started: true});
        };

        webSocketService.onmessage(function (msg) {
            var api = JSON.parse(msg.data);
            console.log(api);
            var data = api.data;
            switch (api.type) {
                case 'room_info':
                    usernumber = 0;
                    data.users.forEach(function(user) {
                        var seatId = user.seatId;
                        userInfoModel.seat[seatId] = {
                            id: user.id,
                            name: user.name
                        };
                        usernumber++;
                    });
                    $scope.usernumber = usernumber;
                    $scope.$apply();
                    break;
                case 'room_user_change':
                    if(data.id == userInfoModel.id) {
                        //如果是自己，则无视
                    } else {
                        var seatId = data.seatId;
                        if(data.enter) {
                            //用户进入房间的消息
                            userInfoModel.seat[seatId] = {
                                id: data.id,
                                name: data.name
                            };
                            usernumber++;
                        } else {
                            //用户离开房间 TODO: 相应处理，暂时不考虑
                            usernumber--;
                        }
                    }
                    $scope.usernumber = usernumber;
                    $scope.$apply();
                    break;
                case 'game_aviliable':
                    $scope.complete = data.is_game_aviliable;
                    $scope.$apply();
                    break;
            }
        });
	};
	angular.module('lyingman').controller('roomController', roomController);
})();


