/**
 * Created by lcm on 2016/11/28.
 */
var user = require('../models/user');
var room = require('../models/room');
var login = require('../service/login');
var join = require('../service/join_room');
var start = require('../service/start_game');
var msg = require('../service/text_message');
var client = {
    send: function (str) {
        console.log(str);
    }
};
var room_id = 1000;
//新添用户
for(var i = 0; i < 9; i++) {
    var data = {};
    data.name = 'test' + i.toString();
    login.do(client, data);
}
//加入房间
for(var i = 0; i < 9; i++) {
    var data = {};
    data.number = room_id;
    data.id = i;
    join.do(client, data);
}
//聊天消息
data = {};
data.id = 0;
data.message = 'ha';
msg.do(client, data);
//开始游戏
data = {};
data.id = 0;
data.game_started = true;
start.do(client, data);

setInterval(test_send, 1000);

for(var i = 0; i < 9; i++) {
    var userData = user.getUserData(i);
    switch (userData.role) {
        case 2:
            var wolf = i;
            break;
        case 3:
            var prophet = i;
            break;
        case 4:
            var witch = i;
            break;
        case 5:
            var guard = i;
            break;
    }
}

var target = require('../service/choose_target');
var func = require('../service/is_function_chosen');
function test_send() {
    console.log('ha');
    var data = {};
    switch (room.getRoomPeriod(room_id)) {
        case 'werewolf':
            data.id = wolf;
            data.target_id = 1;
            target.do(client, data);
            break;
        case 'guard':
            data.id = guard;
            data.target_id = 2;
            target.do(client, data);
            break;
        case 'witch_rescue':
            data.id = witch;
            data.is_chosen = false;
            func.do(client, data);
            break;
        case 'witch_poison':
            data.id = witch;
            data.is_chosen = true;
            func.do(client, data);
            data.target_id = 2;
            target.do(client, data);
            break;
        case 'prophet':
            data.id = prophet;
            data.target_id = 2;
            target.do(client, data);
            break;
        case 'last_words':
            data.id = 1;
            data.message = 'my last words';
            msg.do(client, data);
            break;
        case 'discuss':
            data.id = 0;
            data.message = 'discuss something';
            msg.do(client, data);
            break;
        case 'vote':
            data.id = 0;
            data.target_id = 0;
            target.do(client, data);
            break;
    }
}
