/**
 * Created by cmlin on 2016/10/13.
 */

var user = require('./../models/user');
var json = require('./../utils/json');
var offroom = require('./../models/offroom');

module.exports = {
    do: function(client, data) {
        var number = data.number;
        var user_id = data.id;
        var room_id = user.getUserRoomId(user_id);
        if(room_id > 0) {
            offroom.removeUser(user_id, room_id);
        }
        user.setUserRoomId(user_id, number);
        offroom.userJoin(user_id, number);

        var obj = {
            id: -1,
            name: '系统消息',
            message: '欢迎进入聊天室: ' + number
        };

        client.send(json.json_encode(
            'text_message',
            obj
        ));
    }
};