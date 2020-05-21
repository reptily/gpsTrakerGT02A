const net = require('net');
const async = require('async');
const WebSocket = require('ws');

const config = require("../config");

const ws = new WebSocket('ws://127.0.0.1:' + config.ws.port);

let client = null;

async.series([
    function connectServer(step) {
        client = net.connect({port: config.port}, function() {
            console.log('connected to server!');
            step();
        });
    },
    function connectWS(step) {
        ws.on('open', function open() {
            console.log('connected to websocket!');
            step();
        });
    },
    function authWS(step) {
        ws.send(JSON.stringify({
            type: "auth",
            token: config.ws.token,
        }));

        step();
    },
    function testWaitAuth(step) {
        ws.on('message', data => {
           console.log('Wait auth response');

           const msg = JSON.parse(data);

            if (msg.type === "auth") {
                if (msg.success) {
                    console.log("Authenticated");
                } else {
                    console.error("unauthenticated");
                }

                ws.removeEventListener('message');
                step();
            }
        });
    },
    function sendHandShake(step) {
        client.write(new Buffer.from([
            0x28, //start bit
            0x30, 0x32, 0x37, 0x30, 0x34, 0x34, 0x35, 0x36, 0x33, 0x36, 0x32, 0x35, //Running NO
            0x42, 0x50, 0x30, 0x30, //BP00
            0x33, 0x35, 0x35, 0x32, 0x32, 0x37, 0x30, 0x34, 0x34, 0x35, 0x36, 0x33, 0x36, 0x32, 0x35, //Device ID
            0x48, 0x53, 0x4f, //HSO
            0x29 //stop bit
        ]));
        console.log('send handshake');
        setTimeout(() => step(), 1000);
    },
    function sendGpsLog(step){
        client.write(new Buffer.from([
            0x28, //start bit
            0x30, 0x32, 0x37, 0x30, 0x34, 0x34, 0x35, 0x36, 0x33, 0x36, 0x32, 0x35, //Running NO
            0x42, 0x52, 0x30, 0x30, //BR00
            0x32, 0x30, //YY
            0x30, 0x35, //MM
            0x32, 0x30, //DD
            0x41, //availability "A" or "V"
            0x34, 0x38, 0x32, 0x39, 0x2e, 0x37, 0x39, 0x36, 0x37, //Latitude
            0x4e, //Latitude indicator
            0x31, 0x31, 0x33, 0x35, 0x38, 0x2e, 0x35, 0x37, 0x30, 0x30, //Longitude
            0x57, //Longitude indicator
            0x30, 0x30, 0x30, 0x2e, 0x30, //Speed
            0x30, 0x37, //HH
            0x30, 0x33, //MM
            0x30, 0x34, //SS
            0x31, 0x32, 0x33, 0x2e, 0x37, 0x39, //Orientation
            0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, //IO State
            0x4c, //Milepost "L" mean Mileage
            0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, //Mile date
            0x29 //stop bit
        ]));
        console.log('send location');
        step();
    },
    function waitPacketWS(step) {
        ws.on('message', data => {
            console.log('Wait location at WS');

            const msg = JSON.parse(data);

            if (msg.type === "location") {

                if(data === '{"type":"location","date":20,"timestamp":1589947384,"lat":55.883496666666666,"lng":37.523376666666664,"speed":"000.0","course":"123.79"}') {
                    console.log("packet is correct")
                } else {
                    console.error("packet not correct");
                }

                console.log(msg);

                ws.removeEventListener('message');
                step();
            }
        });
    },
    function Disconnect() {
        client.end();
        ws.close();
    }
]);