/**
 * Created by lcm on 2016/12/12.
 * 用于模拟用户登录并加入房间的过程，方便前端开发测试
 */

var users = [];
var num = 1;
var roomnumber = 1111;
for (var i = 0; i<num; i++) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.onopen = function() {
        var obj = {
            type: 'login',
            data: {
                name: String(i)
            }
        };
        socket.send(JSON.stringify(obj));
    };
    socket.onmessage = function(message) {
        var api = JSON.parse(message.data);
        var data = api.data;
        switch (api.type) {
            case 'login_succ':
                var obj = {
                    type: 'join_room',
                    data: {
                        number: roomnumber,
                        id: data.id,
                        token: data.token
                    }
                };
                socket.send(JSON.stringify(obj));
                break;
        }
    };
}