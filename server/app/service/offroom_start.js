
var user = require('../models/user');
var offroom = require('../models/offroom');
var offgame = require('../models/offgame');

module.exports = {
    do: function(client, data) {
        var user_id = data.id;
        var room_id = user.getUserRoomId(user_id);
        offroom.sendRoomNumber(room_id);
        var online_number = offroom.getRoomNumber(room_id);
        online_number--;
        if(online_number >= 6 && online_number <= 13 || online_number == 2) {
            var ids = offroom.getRoomUserId(room_id);
            ids.splice(0,1);
            var d = offgame.getRoleNumber(online_number);
            console.log(d);
            var i = 0;
            for(var k in d) {
                while(d[k]--) {
                    offroom.setUserRole(ids[i++], k);
                }
            }
        }
    }
};