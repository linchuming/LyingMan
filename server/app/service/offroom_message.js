
var user = require('../models/user');
var offroom = require('../models/offroom');

module.exports = {
    do: function(client, data) {
        var user_id = data.id;
        var room_id = user.getUserRoomId(user_id);
        var user_name = user.getUserName(user_id);
        offroom.sendTextMsg(room_id, data.message, user_id, user_name);
    }
};