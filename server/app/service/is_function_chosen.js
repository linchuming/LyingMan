/**
 * Created by lcm on 2016/11/27.
 */
var user = require('../models/user');
var room = require('../models/room');

module.exports = {
    do: function (client, data) {
        var user_id = data.id;
        var room_id = user.getUserRoomId(user_id);
        var userData = user.getUserData(user_id);
        var is_chosen = data.is_chosen;

        var period = room.getRoomPeriod(room_id);
        switch (period) {
            case 'witch_rescue':
                if(userData.rescue) {
                    room.setWitchRescueChosen(room_id, is_chosen);
                }
                break;
            case 'witch_poison':
                if(userData.poison) {
                    room.setWitchPoisonChosen(room_id, is_chosen);
                }
                break;
        }

    }

};