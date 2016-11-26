/**
 * Created by lcm on 2016/11/26.
 */

var user = require('../models/user');
var room = require('../models/room');

module.exports = {
    do: function(client, data) {
        var user_id = data.id;
        var room_id = user.getUserRoomId(user_id);
        var user_name = user.getUserName(user_id);
        room.sendTextMsg(room_id, data.message, user_id, user_name);
    }
};
