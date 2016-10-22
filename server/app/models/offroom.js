/**
 * Created by cmlin on 2016/10/13.
 */

var rooms = [];

var json = require('../utils/json');
var user = require('./user');

function init_room(room_number) {
    var empty_room = {
        userId: [],
        size: 0
    };
    rooms[room_number] = empty_room;
}

function exist_id(id, room_number) {
    if(rooms[room_number] == undefined) {
        return false;
    }
    var ids = rooms[room_number].userId;
    for(var k in ids) {
        if(ids[k] == id) {
            return true;
        }
    }
    return false;
}

function add_id_to_room(id, room_number) {
    if(!exist_id(id, room_number)) {
        var room = rooms[room_number];
        room.userId.push(id);
        room.size++;
    }
}


function send_to_room(room_id, type, data) {
    var ids = rooms[room_id].userId;
    for(var k in ids) {
        var status = user.sendJson(ids[k], type, data);
        if(!status) {
            remove_user(ids[k], room_id);
        }
    }
}

function remove_user(user_id, room_id) {
    var ids = rooms[room_id].userId;
    for(var k in ids) {
        if(ids[k] == user_id) {
            rooms[room_id].userId.splice(k, 1);
            rooms[room_id].size--;
        }
    }
}

module.exports = {
    /**
     * 添加用户至房间
     * @param id
     * @param room_number
     */
    userJoin: function (id, room_number) {
        if(rooms[room_number] == undefined) {
            init_room(room_number);
        }
        add_id_to_room(id, room_number);
    },

    /**
     * 发送文字消息到房间的所有用户
     * @param room_id
     * @param message
     * @param from_id
     * @param from_name
     */
    sendTextMsg: function (room_id, message, from_id, from_name) {
        var obj = {
            id: from_id,
            name: from_name,
            message: message
        };
        send_to_room(room_id, 'text_message', obj);
    },

    removeUser: function (user_id, room_id) {
        remove_user(user_id, room_id);
    }

};