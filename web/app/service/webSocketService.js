(function() {
    var webSocketService = function(userInfoModel) {
        var socket = new WebSocket('ws://localhost:8080');
        socket.onopen = function () {
            // socket.send('client login');
        };

        return {
            socket: socket,
            send: function(msg) {
                socket.send(msg);
            },
            onmessage: function(message) {
                socket.onmessage = message;
            },
            sendAPI: function(type, data, noToken) {
                if(!noToken || noToken == undefined) {
                    data.id = userInfoModel.id;
                    data.token = userInfoModel.token;
                }
                var obj = {
                    type: type,
                    data: data
                };
                socket.send(JSON.stringify(obj));
            }
        };

    };
    angular.module('lyingman').service('webSocketService', webSocketService);
})();
