(function() {
	var offlineroomController = function($scope, webSocketService, userInfoModel, $sce) {
    $scope.roomnumber = userInfoModel.roomnumber;
    $scope.trustedCurrentConversation = '';
    $scope.currentConversation = '';
    $scope.onlinenumber = 1;
    $scope.myMessage = '';
    $scope.isGod = false;
    var initializeRoom = function() {
      var obj = {
        type: 'join_offroom',
        data: {
          number: userInfoModel.roomnumber,
          id: userInfoModel.id,
          token: userInfoModel.token
        }
      };
      webSocketService.send(JSON.stringify(obj));
      webSocketService.onmessage(function(msg) {
        var obj = JSON.parse(msg.data);
        if(obj.type != undefined) {
          var data = obj.data;
          switch (obj.type) {
            case 'text_message':
              //console.log(data);
              messageHtml(data.id, data.name, data.message);
              break;
            case 'offroom_number':
              $scope.onlinenumber = data.number;
              $scope.$apply();
              break;
            case 'role':
              if(data.role_id == '0') {
                $scope.isGod = true;
                //messageHtml(-1, "系统消息", "您是本间房主/上帝，当人数已满,请点击 <div ng-click='startGame()' class='link'>开始游戏</div>")
                $scope.$apply();
              }
              else {

              }
            default:

          }
        }
      });
    }


    var messageHtml = function (id, name, phrase) {
      var prefix = id == userInfoModel.id ? "<dl class='me m1'><dt>" : "<dl class='he m1'><dt>";
      var phrase = prefix + name + "</dt><dd>" + phrase + "</dd></dl>";
      $scope.currentConversation = $scope.currentConversation + phrase;
      console.log($scope.currentConversation);
      $scope.trustedCurrentConversation = $sce.trustAsHtml($scope.currentConversation);
      $scope.$apply();
    }

    var startGame = function() {
      var obj = {
        type: 'offroom_start',
        data: {
          id: userInfoModel.id,
          token: userInfoModel.token
        }
      };
      console.log("user");
      webSocketService.send(JSON.stringify(obj));
    }



    var sendMessage = function() {
      var obj = {
        type: 'offroom_message',
        data: {
          message: $scope.myMessage,
          id: userInfoModel.id,
          token: userInfoModel.token
        }
      };
      webSocketService.send(JSON.stringify(obj));
      $scope.myMessage = '';
    };
    $scope.startGame = startGame;
    $scope.sendMessage = sendMessage;
    initializeRoom();

	}
	angular.module('lyingman').controller('offlineroomController', offlineroomController);
})()
