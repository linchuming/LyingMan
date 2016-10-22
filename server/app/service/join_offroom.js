
var user = require('../models/user');
var json = require('../utils/json');
var offroom = require('../models/offroom');

module.exports = {
    do: function(client, data) {
        var room_id = data.number;
        var user_id = data.id;
        var pre_room_id = user.getUserRoomId(user_id);
        if(pre_room_id > 0) {
            //如果用户之前有加入其他房间，则退出之前房间
            offroom.removeUser(user_id, pre_room_id);
        }
        user.setUserRoomId(user_id, room_id);
        user.setUserOnline(user_id, true);
        offroom.userJoin(user_id, room_id);

        offroom.sendRoomNumber(room_id);

        // var obj = {
        //     id: -1,
        //     name: '系统消息',
        //     message: '欢迎进入聊天室: ' + room_id
        // };
        //
        // client.send(json.json_encode(
        //     'text_message',
        //     obj
        // ));

        var online_number = offroom.getRoomNumber(room_id);
        if(online_number == 1) {
            //你是目前第一个进入该房间，将成为房主
            offroom.setUserRole(user_id, 0);
        }
    }
};