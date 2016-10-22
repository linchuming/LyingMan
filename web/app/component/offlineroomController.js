(function() {
	var offlineroomController = function($scope, webSocketService, userInfoModel, $sce) {
    $scope.roomnumber = userInfoModel.roomnumber;
    $scope.trustedCurrentConversation = '';
    $scope.currentConversation = '';
    $scope.onlinenumber = 1;
    $scope.myMessage = '';
    var messageHtml = function (id, name, phrase) {
      var prefix = id == userInfoModel.id ? "<dl class='me m1'><dt>" : "<dl class='he m1'><dt>";
      var phrase = prefix + name + "</dt><dd>" + phrase + "</dd></dl>";
      $scope.currentConversation = $scope.currentConversation + phrase;
      console.log($scope.currentConversation);
      $scope.trustedCurrentConversation = $sce.trustAsHtml($scope.currentConversation);
    }
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
          default:

        }
      }
    });
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
    };
    $scope.sendMessage = sendMessage;

	}
	angular.module('lyingman').controller('offlineroomController', offlineroomController);
})()
