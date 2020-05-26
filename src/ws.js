const WebSocket = require('ws');
const config = require("../config");

const ws_server = new WebSocket.Server(config.ws);

sockets = [];

ws_server.on('connection', ws => {

    ws.slot = sockets.length;
    ws.auth = false;
    sockets.push(ws);

    ws.on('message', message => {
        let obj;

        try {
            obj = JSON.parse(message);
        } catch (e) {
            console.error("Error json");
            return false;
        }

        if (obj.type === "auth") {
            ws = Auth(ws, obj);
        }

    });

    ws.on('close', function close() {
        ws.close();
        sockets = removeSocket(sockets, ws.slot);
    });
});

function Auth(ws, obj) {
    if (obj.token === config.ws.token) {
        ws.auth = true;
    } else {
        ws.auth = false;
    }

    ws.send(JSON.stringify({type:"auth", success: ws.auth}));
    return ws;
}

function removeSocket (arr, indexes) {
    let arrayOfIndexes = [].slice.call(arguments, 1);
    return arr.filter(function (item, index) {
        return arrayOfIndexes.indexOf(index) === -1;
    });
};

module.exports = {
    sendLocation(date, timestamp, lat, lng, speed, course) {
        sockets.forEach(client => {
            if (!client.auth) return;

            if (client.readyState) {
                let packet = {
                    type: "location",
                    date,
                    timestamp,
                    lat,
                    lng,
                    speed,
                    course,
                };

                client.send(JSON.stringify(packet));
            }
        });
    },
}