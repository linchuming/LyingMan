/**
 * 后台控制器
 * 所有发送过来的请求都先经过这层处理
 */

var json = require('./service/json');
var midware = require('./service/userCheck');

module.exports = {
    init: function(message, client) {
        var msg = json.json_decode(message);
        if(msg.type != undefined) {
            try{
                switch (msg.type) {
                    case 'login':
                        var action = require('./service/login');
                        action.do(client, msg.data);
                        break;
                    default:
                        midware.userValidCheck(client, msg.data);
                        var action = require('./service/' + msg.type);
                        action.do(client, msg.data);
                }
            }catch (e) {
                console.log(e);
            }
        }
    }
};