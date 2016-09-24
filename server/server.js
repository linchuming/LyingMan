var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 8080});
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
        wss.broadcast(message)
    });
    //ws.send('成功登录');
});

wss.broadcast = function broadcast(text) {
    wss.clients.forEach(function (client) {
        client.send(text)
    })
}
