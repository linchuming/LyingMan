/**
 * Created by cmlin on 2016/10/22.
 */


function getWerewolf(number) {
    if(number >=6 && number <=9) {
        return 2;
    }else if(number >=10 && number <=11) {
        return 3;
    }else if(number >=12 && number <=13 ) {
        return 4;
    }else return 0;
}

function getWitch(number) {
    return 1;
}

function getCupid(number) {
    if(number>=8) {
        return 1;
    } else {
        return 0;
    }
}

function getProphet(number) {
    if(number>=10) {
        return 1;
    } else {
        return 0;
    }
}

module.exports = {
    getRoleNumber: function(online_number) {
        online_number--;
        var werewolf = getWerewolf(online_number);
        var witch = getWitch(online_number);
        var cupid = getCupid(online_number);
        var prophet = getProphet(online_number);
        var civilian = online_number - werewolf - witch - cupid - prophet;
        var res = [];
        res[1] = werewolf;
        res[2] = civilian;
        res[3] = witch;
        res[4] = prophet;
        res[5] = cupid;
        return res;
    }
};