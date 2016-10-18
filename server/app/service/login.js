/**
 * 处理用户登陆逻辑
 */

var user = require('../models/user');
var json = require('../utils/json');

module.exports = {
    do: function(client, data) {
        var name = data.name;
        var res = user.addUser(name, client);
        var obj = {
            id: res.id,
            token: res.token,
            name: name
        };
        client.send(json.json_encode(
            'login_succ',
            obj
        ));
    }
};
