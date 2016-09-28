/**
 * Created by cmlin on 2016/9/28.
 */
var users = [];
var u_id = 0;
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
    }
};