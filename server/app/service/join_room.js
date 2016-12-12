/**
 * Created by lcm on 2016/11/26.
 */
var user = require('../models/user');
var room = require('../models/room');
var json = require('../utils/json');
module.exports = {
    do: function (client, data) {
        var room_id = data.number;
        var user_id = data.id;
        var pre_room_id = user.getUserRoomId(user_id);
        if(room_id<1000 && room_id > 9999) {
            //房间号必须为4位整数
            return;
        }
        room.createRoom(room_id);
        if(room.getRoomPeriod(room_id) != '' && pre_room_id != room_id) {
            //房间正在游戏中，无法加入
            return;
        }
        if(pre_room_id > 0) {
            //TODO: 用户之前在其他房间，现在需要做的处理
        }
        user.setUserRoomId(user_id, room_id);
        user.setUserOnline(user_id, true);
        room.userJoin(room_id, user_id);

        //向该用户发送房间所有人信息（包括自己）
        var users = [];
        var seatId;
        var userId = room.getRoomUserId(room_id);
        for (var k in userId) {
            var name = user.getUserName(userId[k]);
            users.push({id: userId[k], name: name, seatId: Number(k)+1});
            if(userId[k] == user_id) {
                seatId = Number(k) + 1;
            }
        }
        // userId.forEach(function (id) {
        //     var name = user.getUserName(id);
        //     users.push({id: id, name: name});
        // });
        client.send(json.json_encode('room_info', {users: users}));
        //向房间内所有人发送该用户的登录信息
        room.sendRoom(room_id, 'room_user_change',
            {   id: user_id,
                name: user.getUserName(user_id),
                seatId: seatId,
                enter: true
            }, user_id);
        //房间人数达到条件值，可以开始游戏
        if(room.getRoomSize(room_id) == 9) {
            room.prepareGame(room_id);
        }
    }

};