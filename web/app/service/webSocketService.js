(function() {
	var webSocketService = function() {
    var socket = new WebSocket('ws://localhost:8080');
    socket.onopen = function () {
			socket.send('client login');
    };

    return {
      socket: socket,
      send: function(msg) {
        socket.send(msg);
      },
      onmessage: function(message) {
        socket.onmessage = message;
      }
    };

	}
	angular.module('lyingman').service('webSocketService', webSocketService);
})()
