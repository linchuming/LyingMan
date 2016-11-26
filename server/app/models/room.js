/**
 * 在线版房间模块
 */

/**
 * 存储每一个房间对象
 * @type {Array}
 */
var rooms = [];

var json = require('../utils/json');
var user = require('./user');

/**
 * 初始化房间
 * @param room_number
 */
function init_room(room_number) {
    var empty_room = {
        userId: [],
        size: 0
    };
    rooms[room_number] = empty_room;
}

/**
 * 添加一个用户到房间
 * @param room_id
 * @param user_id
 */
function add_user(room_id, user_id) {
    var room = rooms[room_id];
    room.userId.push(user_id);
    room.size++;
}

/**
 * 向房间的所有人发送API
 * @param room_id
 * @param type
 * @param data
 */
function send_to_room(room_id, type, data) {
    var room = rooms[room_id];
    var userIds = room.userId;
    for(var k in userIds) {
        var status = user.sendJson(userIds[k], type, data);
        if(!status) {
            //TODO: 如果发送失败，即用户掉线，要做的处理
        }
    }
}

module.exports = {
    /**
     * 添加房间用户
     * @param room_id
     * @param user_id
     */
    userJoin: function(room_id, user_id) {
        if(rooms[room_id] == undefined) {
            init_room(room_id);
        }
        add_user(room_id, user_id);
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
    }
};