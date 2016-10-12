var host = "lm.cmlin.me";
var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({
        port: 8080,
        verifyClient: socketVerify});

/**
 * 验证socket来源
 * @param info
 * @returns {boolean}
 */
function socketVerify(info) {
    return true; //暂时关闭验证
    var origin = info.origin.match(/^(:?.+\:\/\/)([^\/]+)/);
    // console.log(origin);
    if(origin.length >= 3 && origin[2] == host) {
        return true;
    }
    return false;
}

/**
 * 加载控制器
 */
var controller = require('./app/controller');

/**
 * 接受消息
 */
wss.on('connection', function(client) {
    client.on('message', function(message) {
        console.log('received: %s', message);
        controller.init(message, client);
        //wss.broadcast(message);
    });

    client.on('close', function(close){

    });
    //ws.send('成功登录');
});

//广播发送
wss.broadcast = function broadcast(text) {
    wss.clients.forEach(function (client) {
        client.send(text);
    })
};
