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

/*
 平民      1
 狼人      2
 预言家    3
 女巫      4
 守卫      5
 */
var civilian_role   =   1;
var werewolf_role   =   2;
var prophet_role    =   3;
var witch_role      =   4;
var guard_role      =   5;

function room_object() {
    var userId = [];
    var master = -1;
    var size = 0;
    this.getUserid = function () {return userId;};
    this.getMaster = function () {return master;};
    this.getSize = function () {return size;};

    var speaking = [];
    this.speaking = speaking;

    /**
     * 房间添加用户
     * @param user_id
     */
    this.add_user = function (user_id) {
        userId.push(user_id);
        speaking.push(user_id); // 游戏开始前每个人都可以说话
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
    function send_all(type, data, who) {
        for(var k in userId) {
            if(who != undefined) {
                data.me = false;
                if(typeof who == 'number') {
                    if(userId[k] === who) data.me = true;
                } else {
                    data.ids = undefined;
                    for(var j in who) {
                        if(userId[k] == who[j]) {
                            //给狼人阶段打一个补丁
                            if(data.period == 'werewolf') {
                                data.ids = who;
                            }
                            data.me = true;
                        }
                    }
                }
            }

            var status = user.sendJson(userId[k], type, data);
            if(!status) {
                //TODO: 如果发送失败，即用户掉线，要做的处理
            }
        }
    }

    /**
     * 根据角色获取房间的用户Id（且没有出局）
     * @param role
     * @returns {Array}
     */
    function get_userId_by_role(role) {
        var res = [];
        userId.forEach(function (id) {
            var usrData = user.getUserData(id);
            if(usrData.role == role && usrData.isDead == false) {
                res.push(id);
            }
        });
        return res;
    }

    this.start_game = function () {
        speaking.splice(0); // 游戏开始后不能说话
        get_dark(true);
    };

    /**
     * 记录当前阶段名
     * @type {string}
     */
    var period = '';
    this.getPeriod = function () {return period;};

    //每个阶段的等待时间(s)
    var guard_time = 15;
    var werewolf_time = 20;
    var witch_rescue_time = 15;
    var witch_poison_time = 15;
    var prophet_time = 15;
    var prophet_check_time = 5;
    var last_words_time = 20;
    var discuss_time = 20;
    var vote_time = 20;

    var second = 1000;

    var max_num_last_words = 2; // 允许的最多遗言数量
    var num_last_words = 0; // 已用遗言数量

    //每个阶段最终被锁定的人
    var target = {
        guard_target: -1,
        werewolf_target: -1,
        witch_rescue_target: -1,
        witch_poison_target: -1,
        prophet_target: -1,
        rescue_chosen: false,
        poison_chosen: false,
        wolfchoose: [],
        citizen_choose: {},
        citizen_target: -1,
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
            var deads = announce_deads();

            if(check_game_over()) return;

            // 留遗言
            start_last_words(deads);
        }
    }

    function send_period(period, time, who) {
        var data = {
            period: period,
            time: time
        };
        send_all('announce_period_started', data, who);
    }

    function start_guard(wait_time) {
        period = 'guard';
        var who = get_userId_by_role(guard_role);
        send_period('guard', wait_time, who);
        target.guard_target = -1;
        setTimeout(end_guard, wait_time * second);
    }

    function end_guard() {
        //进入狼人杀人阶段
        start_werewolf(werewolf_time);
    }

    function start_werewolf(wait_time) {
        period = 'werewolf';
        target.werewolf_target = userId[0]; //如果狼人不选择，默认杀第一个人
        target.wolfchoose = [];
        var who = get_userId_by_role(werewolf_role);
        send_period('werewolf', wait_time, who);
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
                target.werewolf_target = parseInt(k);
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
        var who = get_userId_by_role(witch_role);
        if(who.length) {
            var usrData = user.getUserData(who[0]);
            if(usrData.rescue == false) {
                who = -1;
            }
        }
        send_period('witch_rescue', wait_time, who);
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
        var who = get_userId_by_role(witch_role);
        if(who.length) {
            var usrData = user.getUserData(who[0]);
            if(usrData.poison == false) {
                who = -1;
            }
        }
        send_period('witch_poison', wait_time, who);
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
        var who = get_userId_by_role(prophet_role);
        send_period('prophet', wait_time, who);
        setTimeout(end_prophet, wait_time * second);
    }

    function end_prophet() {
        start_prophet_check(prophet_check_time);
    }

    function start_prophet_check(wait_time) {
        period = 'prophet_check';
        var who = get_userId_by_role(prophet_role);
        send_period('prophet_check', wait_time, who);
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
        setTimeout(end_prophet_check, wait_time * second);
    }

    function end_prophet_check() {
        //进入天亮
        get_dark(false);
    }

    function announce_deads() {
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

        return [id1, id2];
    }

    function start_last_words(deads) {
        period = 'last_words';

        var ids = [];
        deads.forEach(function(d) {
            if(d == -1) return;
            if(num_last_words >= max_num_last_words) return;

            num_last_words++;
            ids.push(d);
        });
        next_one();

        function next_one() {
            if (!ids.length) {
                end_last_words();
                return;
            }
            var id = ids[0];
            ids.splice(0, 1);
            announce(id);
        }

        function announce(id) {
            send_period('last_words', last_words_time, id);
            speaking.push(id);

            console.log(id, ' can speak now, speaking list: ', speaking);

            setTimeout(function() {
                speaking.splice(speaking.indexOf(id), 1);
                console.log(id, ' cannot speak now, speaking list: ', speaking);
                next_one();
            }, last_words_time * second);
        }
    }

    function end_last_words() {
        start_discuss();
    }

    function start_discuss() {
        period = 'discuss';

        var ids = [];
        userId.forEach(function(id) {
            if(!user.getUserData(id).isDead) ids.push(id);
        });
        next_one();

        function next_one() {
            if (!ids.length) {
                end_discuss();
                return;
            }
            var id = ids[0];
            ids.splice(0, 1);
            announce(id);
        }

        function announce(id) {
            send_period('discuss', discuss_time, id);
            speaking.push(id);

            setTimeout(function() {
                speaking.splice(speaking.indexOf(id), 1);
                next_one();
            }, discuss_time * second);
        }
    }

    function end_discuss() {
        start_vote();
    }

    this.setCitizenTarget = function(user_id, target_id) {
        if(user.getUserData(target_id).isDead) return;
        target.citizen_choose[user_id] = target_id;
    };

    this.broadcastVote = function() {
        var data = {id: []};
        userId.forEach(function(id) {
            if(target.citizen_choose[id] !== undefined) {
                data.id.push(target.citizen_choose[id]);
            }
        });
        send_all('user_is_chosen', data);
    };

    function start_vote() {
        period = 'vote';

        target.citizen_choose = {};
        target.citizen_target = -1;
        var who = [];
        userId.forEach(function (id) {
            var usrData = user.getUserData(id);
            if(usrData.isDead == false) {
                who.push(id);
            }
        });
        send_period('vote', vote_time, who);

        setTimeout(end_vote, vote_time * second);
    }

    function end_vote() {
        console.log('citizen_choose', target.citizen_choose);
        var vote = {};
        userId.forEach(function(id) {
            var target_id = target.citizen_choose[id];
            if(target_id == undefined) return;

            if(vote[target_id] === undefined) {
                vote[target_id] = 1;
            } else {
                vote[target_id]++;
            }
        });
        console.log('vote', vote);
        var maxn = 0;
        for(var id in vote) {
            console.log(id);
            if(vote[id] > maxn) {
                maxn = vote[id];
                target.citizen_target = id;
            }
        }

        var data = {
            id: target.citizen_target
        };
        console.log('citizen_target:', target.citizen_target);
        send_all('user_out', data);

        if(target.citizen_target != -1) {
            user.getUserData(target.citizen_target).isDead = true;
            if(check_game_over()) return;
        }

        get_dark(true);
    }

    function check_game_over() {
        var bad = [], good = [];

        userId.forEach(function(id) {
            var u = user.getUserData(id);
            if(!u.isDead) {
                if(u.role == 2) bad.push(id); else good.push(id);
            }
        });

        var is_over = bad.length == 0 || good.length == 0;
        if(is_over) {
            if(bad.length) {
                send_all('game_over', {'is_game_over': true, 'id': bad});
            } else {
                send_all('game_over', {'is_game_over': true, 'id': good});
            }
        }

        return is_over;
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
     * 若房间不存在，则创建房间
     * @param room_id
     */
    createRoom: function(room_id) {
        if(rooms[room_id] == undefined) {
            init_room(room_id);
        }
    },
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
     * 向该房间所有人发送API
     * @param room_id
     * @param type
     * @param data
     * @param who
     */
    sendRoom: function(room_id, type, data, who) {
        rooms[room_id].send_all(type, data, who);
    },
    /**
     * 发送文字消息到房间的所有用户
     * @param room_id
     * @param message
     * @param from_id
     * @param from_name
     */
    sendTextMsg: function (room_id, message, from_id, from_name) {
        console.log('from_id: ', from_id, 'room_id', room_id, 'room speaking: ', rooms[room_id].speaking);
        if(rooms[room_id].speaking.indexOf(from_id) != -1) {
            var data = {
                id: from_id,
                name: from_name,
                message: message
            };
            rooms[room_id].send_all('text_message', data);
        }
    },

    getRoom: function(room_id) {
        return rooms[room_id];
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