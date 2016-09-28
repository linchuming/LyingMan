/**
 * Created by cmlin on 2016/9/28.
 */

var json = require('./json');

module.exports = {
    init: function(message, client) {
        var msg = json.json_decode(message);
        if(msg.type != undefined) {
            try{
                var action = require('./' + msg.type);
                action.do(client, msg.data);
            }catch (e) {
                console.log(e);
            }

            // switch (msg.type) {
            //     case 'login':
            //         break;
            //     default:
            //
            // }
        }
    }
};