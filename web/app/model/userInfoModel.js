(function() {
    var userInfoModel = function() {
        var token = '';
        var name = '';
        var id = '';
        var roomnumber = '';
        var mode = 0;   //用户选择的游戏模式
        var seat = [];  //存储房间里每一个位置的信息
        var role = -1; //本地用户的角色号
        return {
            token: token,
            name: name,
            id: id,
            roomnumber: roomnumber,
            mode: mode,
            seat: seat,
            role: role
        }

    };
    angular.module('lyingman').factory('userInfoModel', userInfoModel);
})();
