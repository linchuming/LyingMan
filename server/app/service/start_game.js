/**
 * Created by lcm on 2016/11/26.
 */
var user = require('../models/user');
var room = require('../models/room');

function randomSwap(ids)
{
    var steps = 100;
    var length = ids.length;
    while(steps--) {
        var i = Math.floor(Math.random() * length);
        var j = Math.floor(Math.random() * length);
        var tmp = ids[i];
        ids[i] = ids[j];
        ids[j] = tmp;
    }
    return ids;
}

function get_roles()
{
    /*
        平民      1
        狼人      2
        预言家    3
        女巫      4
        守卫      5
     */
    var roles = [1, 1, 1, 2, 2, 2, 3, 4, 5];
    return randomSwap(roles);
}
module.exports = {
    do: function (client, data) {
        var user_id = data.id;
        var room_id = user.getUserRoomId(user_id);
        var game_started = data.game_started;
        if(game_started) {
            if(room.getRoomSize(room_id) != 9) {
                return false;
            }
            //发身份牌
            var roles = get_roles();
            // roles[0] = 2; //钦定身份，测试用
            var userId = room.getRoomUserId(room_id);
            var index = 0;
            for(var k in userId) {
                var sdata = {
                    id_card_type: roles[index]
                };
                var status = user.sendJson(userId[k], 'send_id_card', sdata);
                var userData = user.getUserData(userId[k]);
                //角色分配
                userData.role = roles[index];
                //每个角色初始状态都是活着
                userData.isDead = false;
                //特殊角色的特殊数据初始化
                switch (roles[index]) {
                    case 4:
                        //女巫毒药解药信息
                        userData.rescue = true;
                        userData.poison = true;
                        break;
                }
                index++;
            }
            //启动该房间的游戏流程
            room.startGame(room_id);
        }
    }

};