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

// function room_object() {
//     var userId = [];
//
//     this.add_user = function (user_id) {
//         userId.push(user_id);
//     };
//
//     this.show = function () {
//         console.log(userId);
//     };
// }
//
// r = new room_object();
// r.add_user(1);
// r.show();

// setTimeout(test, 1000);
// function test()
// {
//     var data = {
//         id: [1,2,3]
//     };
//     console.log(JSON.stringify(data));
//     var t = [0];
//     console.log(t[1]+1);
// }

var name = '321';
function test() {
    var name = '123';
    var obj = {
        name: '123'
    };
    this.obj = obj;
    function foo() {
        console.log(obj.name);
    }
    function run() {
        foo();
    }
    this.run = function () {
        foo();
    };
}

var f = new test;
f.obj.name = '1';
f.run();
