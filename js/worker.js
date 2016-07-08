self.addEventListener('message', function(ev) {
    var obj = {
        beenget: 0,
        h_m: ev.data[0],
        sbmsgid: "0",
        smax_msgid: "0",
        token: ev.data[1]
    }
    getMsgList(obj, ev.data[0]);
})

//根据历史消息生成左侧聊天栏
function getMsgList(obj, h_m) {
    var request = new XMLHttpRequest();
    request.open('POST', 'test.json', true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            var msgs = data.data.ent.msgs;
            var users = data.data.ext.users;
            self.postMessage(msgs[0].smsgid);
            msgs = unique(msgs, h_m);
            for (var i = 0; i < msgs.length; i++) {
                var msg = msgs[i];
                if ((msg.ctype == 1) && (msg.mtype == 1 || msg.mtype == 2 || msg.mtype == 3)) {
                    var uid = msg.uid != h_m ? msg.uid : msg.touid;
                    var userInfo = getUserInfo(uid, users);
                    var obj = extend({}, userInfo, msg);
                    self.postMessage(JSON.stringify(obj));
                } else
                if ((msg.ctype == 2 || msg.ctype == 11) && (msg.mtype == 1 || msg.mtype == 2 || msg.mtype == 3)) {
                    var guid = msg.sdialogid;
                    var sobj = {
                        sdialogid: guid
                    };
                    getGroupInfo(sobj, msg);
                }
            }
//            if (data.data.ent.more) {
//                var g_obj={
//                    token: "85fb70418b53730020dd30714c866fb3",
//                    sbmsgid: data.data.ent.sbmsgid,
//                    beenget: msgs.length,
//                    h_m: 107105,
//                    smax_msgid:'0'
//                }
//                getMsgList(g_obj)
//            } 
        } else {}
    };
    request.send(JSON.stringify(obj));
}
//根据用户id获取对应的信息
function getUserInfo(id, users) {
    var avatar = '';
    for (var i = 0; i < users.length; i++) {
        if (id == users[i].id) {
            avatar = users[i];
            break
        }
    }
    return avatar;
}
//合并msg对象和对应的user用户信息对象
var extend = function(out) {
    out = out || {};
    for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i])
            continue;
        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key))
                out[key] = arguments[i][key];
        }
    }
    return out;
};
//对msgs数组进行筛选(ctype=1/2/11&&mtype=1/2/3)并去重
var unique = function(msgs, h_m) {
    var res = [];
    var json = {};
    for (var i = 0; i < msgs.length; i++) {
        var ele = msgs[i];
        if ((ele.ctype == 1) && (ele.mtype == 1 || ele.mtype == 2 || ele.mtype == 3) || (ele.ctype == 2 || ele.ctype == 11) && (ele.mtype == 1 || ele.mtype == 2 || ele.mtype == 3)) {
            var uid = ele.ctype == 1 ? (ele.uid != h_m ? ele.uid : ele.touid) : ele.sdialogid;
            if (!json[uid]) {
                res.push(ele);
                json[uid] = 1;
            }
        }
    }
    return res;
}
//获取群聊信息，合并msg后，发送数据回主线程
function getGroupInfo(data, msg) {
    var xmlhttp = new XMLHttpRequest();
    if (xmlhttp != null) {
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var data = JSON.parse(xmlhttp.responseText);
                    var gdata = data.data;
                    var ginfo = gdata.info;
                    var gobj = extend({}, ginfo, msg, {
                        dialogid: gdata.dialogid
                    });
                    self.postMessage(JSON.stringify(gobj));
                } else {
                    console.log("Problem retrieving data");
                }
            }
        };
        xmlhttp.open("POST", 'getinfo.json', true);
        xmlhttp.send(JSON.stringify(data));
    }
}
