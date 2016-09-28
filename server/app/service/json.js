/**
 * Created by cmlin on 2016/9/28.
 */
var json_encode = function(type, data, msg) {
    msg = msg || '';
    var res = {
        type: type,
        data: data,
        msg: msg
    };
    return JSON.stringify(res);
}

var json_decode = function(str) {
    try {
        return JSON.parse(str);
    }catch (e) {
        return false;
    }
}

module.exports.json_encode = json_encode;
module.exports.json_decode = json_decode;