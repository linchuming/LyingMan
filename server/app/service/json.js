/**
 * JSON处理模块
 */

/**
 * JSON编码
 * @param type
 * @param data
 * @param msg
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

/**
 * JSON解码
 * @param str
 * @returns {boolean}
 */
var json_decode = function(str) {
    try {
        return JSON.parse(str);
    }catch (e) {
        return false;
    }
}

module.exports.json_encode = json_encode;
module.exports.json_decode = json_decode;