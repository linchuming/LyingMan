
var user = require('../models/user');
var offroom = require('../models/offroom');
var offgame = require('../models/offgame');
var json = require('../utils/json');

function randomSwap(ids)
{
    var steps = 100;
    var length = ids.length;
    while(steps--) {
        var i = Math.floor(Math.random() * length);
        var j = Math.floor(Math.random() * length);
        var tmp = ids[i];
        ids[i] = ids[j];
        ids[j] = tmp;
    }
    return ids;
}

module.exports = {
    do: function(client, data) {
        var user_id = data.id;
        var room_id = user.getUserRoomId(user_id);
        offroom.sendRoomNumber(room_id);
        var online_number = offroom.getRoomNumber(room_id);
        var result = [];
        online_number--;
        if(online_number >= 6 && online_number <= 13 || online_number == 2) {
            var ids = offroom.getRoomUserId(room_id);
            ids.splice(0,1);
            ids = randomSwap(ids);
            var d = offgame.getRoleNumber(online_number);
            console.log(d);
            var i = 0;
            for(var k in d) {
                while(d[k]--) {
                    result.push({
                        id: ids[i],
                        name: user.getUserName(ids[i]),
                        role_id: k
                    });
                    offroom.setUserRole(ids[i++], k);
                }
            }
            var data = {users: result};
            var str = json.json_encode('offroom_start_succ', data);
            client.send(str);
        }

    }
};