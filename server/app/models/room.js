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

function room_object() {
    var userId = [];
    var master = -1;
    var size = 0;
    this.getUserid = function () {return userId;};
    this.getMaster = function () {return master;};
    this.getSize = function () {return size;};
    /**
     * 房间添加用户
     * @param user_id
     */
    this.add_user = function (user_id) {
        userId.push(user_id);
        if(size == 0) {
            master = user_id;
        }
        size++;
    };

    /**
     * 向房间内所有用户发送API
     * @param type
     * @param data
     */
    this.send_all = send_all;
    function send_all(type, data) {
        for(var k in userId) {
            var status = user.sendJson(userId[k], type, data);
            if(!status) {
                //TODO: 如果发送失败，即用户掉线，要做的处理
            }
        }
    };

    this.start_game = function () {
        get_dark(true);
    };

    /**
     * 记录当前阶段名
     * @type {string}
     */
    var period = '';
    this.getPeriod = function () {return period;};

    //每个阶段的等待时间(s)
    var guard_time = 10;
    var werewolf_time = 15;
    var witch_rescue_time = 10;
    var witch_poison_time = 10;
    var prophet_time = 10;

    var second = 200;

    //每个阶段最终被锁定的人
    var target = {
        guard_target: -1,
        werewolf_target: -1,
        witch_rescue_target: -1,
        witch_poison_target: -1,
        prophet_target: -1,
        rescue_chosen: false,
        poison_chosen: false,
        wolfchoose: []
    };
    this.target = target; //使得外面对象可以访问target

    function get_dark(is_dark) {
        var data = {
            is_sky_dark: is_dark
        };
        send_all('get_dark', data);
        if(is_dark) {
            //天黑后进入守卫阶段
            start_guard(guard_time);
        } else {
            //天亮后，进行死亡人数统计与发布
            var id1 = -1;
            var id2 = -1;
            if(target.werewolf_target == target.guard_target || target.werewolf_target == target.witch_rescue_target) {
                id1 = -1;
            } else {
                id1 = target.werewolf_target;
            }
            if(target.witch_poison_target >= 0) {
                if(id1 == -1) {
                    id1 = target.witch_poison_target;
                } else {
                    id2 = target.witch_poison_target;
                }
            }
            if(id1 >= 0) {
                var userData = user.getUserData(id1);
                userData.isDead = true;
            }
            if(id2 >= 0) {
                var userData = user.getUserData(id2);
                userData.isDead = true;
            }
            var data = {
                id1: id1,
                id2: id2
            };
            send_all('user_dead', data);
            
            //TODO: 天亮后要做的事情，交给老浴霸啦
        }
    }

    function send_period(period, time) {
        var data = {
            period: period,
            time: time
        };
        send_all('announce_period_started', data);
    }

    function start_guard(wait_time) {
        period = 'guard';
        send_period('guard', wait_time);
        target.guard_target = -1;
        setTimeout(end_guard, wait_time * second);
    }

    function end_guard() {
        //进入狼人杀人阶段
        start_werewolf(werewolf_time);
    }

    function start_werewolf(wait_time) {
        period = 'werewolf';
        target.werewolf_target = -1;
        target.wolfchoose = [];
        send_period('werewolf', wait_time);
        setTimeout(end_werewolf, wait_time * second);
    }

    function end_werewolf() {
        //先统计出最终被狼人杀的user_id
        var vote = [];
        for(var k in target.wolfchoose) {
            var target_id = target.wolfchoose[k];
            if(vote[target_id] == undefined) {
                vote[target_id] = 1;
            } else {
                vote[target_id]++;
            }
        }
        var maxn = 0;
        for(var k in vote) {
            if(vote[k] > maxn) {
                maxn = vote[k];
                target.werewolf_target = k;
            }
        }
        //向所有狼人发送他们最终被决定的人
        var data = {
            id: target.werewolf_target
        };
        console.log('werewolf_target:', target.werewolf_target);
        for(var k in userId) {
            var userData = user.getUserData(userId[k]);
            if(userData.role == 2 && userData.isDead == false) {
                user.sendJson(userId[k], 'user_is_locked', data);
            }
        }
        //进入女巫救人阶段
        start_witch_rescue(witch_rescue_time);
    }

    function start_witch_rescue(wait_time) {
        period = 'witch_rescue';
        target.rescue_chosen = false;
        send_period('witch_rescue', wait_time);
        //给女巫发送要救的人的user_id
        var data = {
            id: target.werewolf_target
        };
        for(var k in userId) {
            var userData = user.getUserData(userId[k]);
            if(userData.role == 4 && userData.isDead == false) {
                user.sendJson(userId[k], 'user_is_locked', data);
            }
        }
        setTimeout(end_witch_rescue, wait_time * second);
    }

    function end_witch_rescue() {
        //确认最终女巫救的人
        if (target.rescue_chosen) {
            target.witch_rescue_target = target.werewolf_target;
            //女巫不得再使用解药
            for(var k in userId) {
                var userData = user.getUserData(userId[k]);
                if(userData.role == 4) {
                    userData.rescue = false;
                }
            }
        } else {
            target.witch_rescue_target = -1;
        }
        //进入女巫毒人阶段
        start_witch_poison(witch_poison_time);
    }

    function start_witch_poison(wait_time) {
        period = 'witch_poison';
        target.poison_chosen = false;
        send_period('witch_poison', wait_time);
        setTimeout(end_witch_poison, wait_time * second);
    }

    function end_witch_poison() {
        //确认最终女巫毒的人
        if(target.poison_chosen == false) {
            target.witch_poison_target = -1;
        }
        //进入预言家阶段
        start_prophet(prophet_time);
    }

    function start_prophet(wait_time) {
        period = 'prophet';
        target.prophet_target = userId[0]; //如果预言家不指定任何人，就查第一个
        send_period('prophet', wait_time);
        setTimeout(end_prophet, wait_time * second);
    }

    function end_prophet() {
        //给预言家发送是否为好人
        var targetData = user.getUserData(target.prophet_target);
        var is_goodman = true;
        if(targetData.role == 2) {
            //如果预言家指定的角色是狼人，则为坏人
            is_goodman = false;
        }
        var data = {
            is_user_a_goodman: is_goodman
        };
        for(var k in userId) {
            var userData = user.getUserData(userId[k]);
            if(userData.role == 3 && userData.isDead == false) {
                user.sendJson(userId[k], 'is_user_goodman', data);
            }
        }
        //进入天亮
        get_dark(false);
    }
}
/**
 * 初始化房间
 * @param room_number
 */
function init_room(room_number) {
    rooms[room_number] = new room_object();
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
        rooms[room_id].add_user(user_id);
    },

    /**
     * 发送文字消息到房间的所有用户
     * @param room_id
     * @param message
     * @param from_id
     * @param from_name
     */
    sendTextMsg: function (room_id, message, from_id, from_name) {
        var data = {
            id: from_id,
            name: from_name,
            message: message
        };
        rooms[room_id].send_all('text_message', data);
    },

    /**
     * 获取房间人数
     * @param room_id
     */
    getRoomSize: function (room_id) {
        return rooms[room_id].getSize();
    },

    /**
     * 获取房间的用户id数组
     * @param room_id
     */
    getRoomUserId: function (room_id) {
        return rooms[room_id].getUserid();
    },

    /**
     * 向房主发送可以开始游戏标识
     * @param room_id
     */
    prepareGame: function (room_id) {
        var master_id = rooms[room_id].getMaster();
        var data = {
            is_game_aviliable: true
        };
        var status = user.sendJson(master_id, 'game_aviliable', data);
        if(!status) {
            //TODO: 发送失败处理
        }
    },

    /**
     * 启动游戏
     * @param room_id
     */
    startGame: function (room_id) {
        rooms[room_id].start_game();
    },

    getRoomPeriod: function (room_id) {
        return rooms[room_id].getPeriod();
    },

    setGuardTarget: function (room_id, target_id) {
        rooms[room_id].target.guard_target = target_id;
    },

    setWolfTarget: function (room_id, user_id, target_id) {
        rooms[room_id].target.wolfchoose[user_id] = target_id;
    },

    getWolfTarget: function (room_id) {
        return rooms[room_id].target.wolfchoose;
    },

    setWitchRescueChosen: function (room_id, is_chosen) {
        rooms[room_id].target.rescue_chosen = is_chosen;
    },

    setWitchPoisonChosen: function (room_id, is_chosen) {
        rooms[room_id].target.poison_chosen = is_chosen;
    },

    setWitchPoisonTarget: function (room_id, target_id) {
        rooms[room_id].target.witch_poison_target = target_id;
    },

    setProphetTarget: function (room_id, target_id) {
        rooms[room_id].target.prophet_target = target_id;
    }

};