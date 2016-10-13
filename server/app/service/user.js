/**
 * 用户处理模块
 */

//用户池
var users = [];

var u_id = 0;

var json = require('./json');

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

module.exports = {

    /**
     * 往用户池添加用户
     * @param name
     * @param client
     * @returns {{id: number, client: *, name: *, room: number, data: {}, token}}
     */
    addUser: function (name, client) {
        var obj = {
            id: u_id,
            client: client,
            name: name,
            room: -1,
            data: {},
            token: randomString(16)
        };
        users[u_id] = obj;
        u_id++;
        return obj;
    },

    /**
     * 根据id获取用户对象（注意这个对象是引用的对象，非拷贝）
     * @param id
     * @returns {*}
     */
    getUser: function(id) {
        return users[id];
    },

    /**
     * 设置用户的client对象
     * @param id
     * @param client
     * @returns {boolean}
     */
    setUserClient: function(id, client) {
        if(users[id] != undefined) {
            users[id].client = client;
        }
        return false;
    },

    /**
     * 设置用户的房间号信息
     * @param id
     * @param number
     */
    setUserRoomId: function(id, number) {
        users[id].room = number;
    },

    /**
     * 获取用户的房间号
     * @param id
     * @returns {number|*}
     */
    getUserRoomId: function(id) {
        return users[id].room;
    },

    /**
     * 获取用户昵称
     * @param id
     * @returns {*}
     */
    getUserName: function(id) {
        return users[id].name;
    },

    /**
     * 向用户id发送json信息
     * @param id
     * @param type
     * @param data
     */
    sendJson: function(id, type, data) {
        var str = json.json_encode(type, data);
        users[id].client.send(str);
        console.log('send: ' + id + ', ' + str);
    }

};