/**
 * 线下版房间模块
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
    var isUpdate = false;
    var remove_arr = [];
    for(var k in ids) {
        var status = user.sendJson(ids[k], type, data);
        if(!status) {
            isUpdate = true;
            remove_arr.push(ids[k]);
        }
    }
    for(var k in remove_arr) {
        remove_user(remove_arr[k], room_id);
    }
    if(isUpdate) {
        sendRoomNumber(room_id);
    }
}

function remove_user(user_id, room_id) {
    var ids = rooms[room_id].userId;
    for(var k in ids) {
        if(ids[k] == user_id) {
            rooms[room_id].userId.splice(k, 1);
            rooms[room_id].size--;
            // console.log(rooms[room_id].size);
        }
    }
}

function sendRoomNumber(room_id) {
    var obj = {
        number: rooms[room_id].size
    };
    send_to_room(room_id, 'offroom_number', obj);
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

    /**
     * 将用户移出房间
     * @param user_id
     * @param room_id
     */
    removeUser: function (user_id, room_id) {
        remove_user(user_id, room_id);
        this.sendRoomNumber(room_id);
    },

    /**
     * 向房间发送在线人数
     * @param room_id
     */
    sendRoomNumber: function (room_id) {
        return sendRoomNumber(room_id);
    },

    /**
     * 获取房间在线人数
     * @param room_id
     * @returns {number|Number|string|*}
     */
    getRoomNumber: function (room_id) {
        return rooms[room_id].size;
    },

    /**
     * 设置角色身份
     * @param user_id
     * @param role_id
     */
    setUserRole: function (user_id, role_id) {
        user.sendJson(user_id, 'role', {role_id: role_id});
    },

    /**
     * 获取房间的用户id
     * @param room_id
     * @returns {Array.<*>}
     */
    getRoomUserId: function (room_id) {
        return rooms[room_id].userId.concat();
    }


};