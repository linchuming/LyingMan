/**
 * Created by lcm on 2016/11/26.
 */
var user = require('../models/user');
var room = require('../models/room');

module.exports = {
    do: function (client, data) {
        var room_id = data.number;
        var user_id = data.id;
        var pre_room_id = user.getUserRoomId(user_id);
        if(pre_room_id > 0) {
            //TODO: 用户之前在其他房间，现在需要做的处理

        }
        user.setUserRoomId(user_id, room_id);
        user.setUserOnline(user_id, true);
        room.userJoin(user_id, room_id);
    }

};