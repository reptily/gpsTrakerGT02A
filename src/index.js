const net = require('net');
const lib = require('./lib');
const DB = require('./db');
const WS = require('./ws');

const config = require("../config");

const startBit = 0x28;
const stopBit = 0x29;

let server = net.createServer(function (socket) {
    console.log('client connected');

    socket.on('data', data => {

        if(data[0] != startBit && data[data.length-1] != stopBit) {
            console.log("ERROR PROTOCOL, close connection");
            socket.end();
        }

        let command = String.fromCharCode(data[13], data[14], data[15], data[16]);
        let runningNO = data.slice(1, 13);

        console.log("read", command, lib.toHex(data));

        switch (command) {
            case "BP00":
            case "BP05":
                let buf = lib.getHandShake(runningNO);
                console.log("write", lib.toHex(buf));
                socket.write(buf);
                break;
            case "BR00":
            case "BR01":
                let dataLoc = data.slice(17,data.length-1);
                let locations = lib.getLocation(dataLoc);

                let lat = lib.DMM2DD(locations[5], locations[6]);
                let lng = lib.DMM2DD(locations[7], locations[8]);

                let date = lib.getDate(locations[1], locations[2], locations[3], locations[10], locations[11], locations[12]);

                let speed =  locations[9];

                let course = locations[13];

                console.log(date, lat, lng, speed, course);

                DB.saveLocation(date.getDate(), parseInt(date.getTime()/1000), lat, lng, speed, course);
                WS.sendLocation(date.getDate(), parseInt(date.getTime()/1000), lat, lng, speed, course);
                break;
        }

    });
});

server.listen(config.port);
console.log("Server starting");
