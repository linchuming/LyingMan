/**
 * Created by lcm on 2016/11/27.
 */
var user = require('../models/user');
var room = require('../models/room');

module.exports = {
    do: function (client, data) {
        var user_id = data.id;
        var room_id = user.getUserRoomId(user_id);
        var target_id = data.target_id;

        var period = room.getRoomPeriod(room_id);
        switch (period) {
            case 'guard':
                room.setGuardTarget(room_id, target_id);
                break;
            case 'werewolf':
                room.setWolfTarget(room_id, user_id, target_id);
                //给所有狼人发送谁被选择了
                var tarArr = room.getWolfTarget(room_id);
                var id = [];
                for(var k in tarArr) {
                    id.push(tarArr[k]);
                }
                var sdata = {
                    id: id
                };
                var userId = room.getRoomUserId(room_id);
                for(var k in userId) {
                    var userData = user.getUserData(userId[k]);
                    if(userData.role == 2 && userData.isDead == false) {
                        user.sendJson(userId[k], 'user_is_chosen', sdata);
                    }
                }
                break;
            case 'witch_rescue':
                break;
            case 'witch_poison':
                room.setWitchPoisonTarget(room_id, target_id);
                break;
            case 'prophet':
                room.setProphetTarget(room_id, target_id);
                break;
            case 'vote':
                var u = user.getUserData(user_id);
                if(u.isDead) return;
                room.getRoom(room_id).setCitizenTarget(user_id, target_id);
                room.getRoom(room_id).broadcastVote();
                break;
        }

    }

};