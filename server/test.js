// var t = require('./models/json');
// var r = t.json_encode('login',{name: '123'});
// console.log(r);
// console.log(t.json_decode('12'));
// console.log(t.json_decode(r));
//
// var user = require('./models/user');
// console.log(user.addUser('123', 1));
// console.log(user.addUser('123', 2));
// var u2 = require('./models/user');
// console.log(u2.addUser('aaa', 2));

// var a = [];
// a[0] = 0;
// a[100] = 1;
//
// var b = a;
// b[0] = 1;
// b[2] = {
//     name: '123'
// };
// console.log(a[2]);
// var t = b[2];
// t.name = '321';
// console.log(a[2]);

var count = 1;
var func = function add() {
    count++;
    console.log(count);
    setTimeout(t, 1000);
};

var t = function () {
  console.log("hello");
};

setTimeout(func, 1000);