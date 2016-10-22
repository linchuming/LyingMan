(function() {
	var offlineroomController = function($scope, webSocketService, userInfoModel, $sce) {
    $scope.roomnumber = userInfoModel.roomnumber;
    $scope.trustedCurrentConversation = '';
    $scope.currentConversation = '';
    $scope.onlinenumber = 1;
    $scope.myMessage = '';
    $scope.isGod = false;
    var role = ['上帝', '狼人', '平民', '女巫', '预言家', '丘比特'];

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
                if(data.role_id == '1') {
                  messageHtml(-1, "系统消息","您的身份是狼人。");
                }
                if(data.role_id == '2') {
                  messageHtml(-1, "系统消息","您的身份是平民。");
                }
                if(data.role_id == '3') {
                  messageHtml(-1, "系统消息","您的身份是女巫。");
                }
                if(data.role_id == '4') {
                  messageHtml(-1, "系统消息","您的身份是预言家。");
                }
                if(data.role_id == '5') {
                  messageHtml(-1, "系统消息","您的身份是丘比特。");
                }
              }
              break;
            case 'offroom_start_succ':
                var users = data.users;
                var str = '';
                for(var k in users) {
                  str += '<br>' + users[k].name + ':' + role[users[k].role_id];
                }
                messageHtml(-1, "系统消息", "游戏开始，本局身份分布为：" + str);
              break;
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
      if ($scope.myMessage) {
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
      }
    };
    $scope.startGame = startGame;
    $scope.sendMessage = sendMessage;
    initializeRoom();

	}
	angular.module('lyingman').controller('offlineroomController', offlineroomController);
})()
