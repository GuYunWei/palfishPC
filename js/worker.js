self.addEventListener('message',function(ev){
    var obj = {
        beenget: 0,
        h_m: ev.data[0],
        sbmsgid: "0",
        smax_msgid: "0",
        token: ev.data[1]
    }
    getMsgList(obj);
})


function getMsgList(obj){
    var request = new XMLHttpRequest();
    request.open('POST', 'test.json', true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            var msgs = data.data.ent.msgs;
            var users = data.data.ext.users;
            for(var i=0; i<msgs.length; i++){
                var ele = msgs[i], id = msgs[i].uid;
                if((ele.ctype == 1) && (ele.mtype == 1 || ele.mtype == 2 || ele.mtype == 3) || (ele.ctype == 2||ele.ctype == 11) && (ele.mtype == 1 || ele.mtype == 2 || ele.mtype == 3)){
//                    for (var j = 0; j < users.length; j++) {
//                        if (id == users[i].id) {
//                            avatar = users[i];
//                            break
//                        }
//                    }
                    var user = Array.prototype.filter.call(users, function(ele){
                        ele.id = id;
                        console.log(ele);
                    });
//                    console.log(users);
//                    self.postMessage(JSON.stringify(ele));
//                    var p = extend({}, objA, objB);
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
        } else {
            
        }
    };
    request.send(JSON.stringify(obj));
}

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