module.exports = {
    getHandShake(runningNO) {
        let buf = [0x28] //start bit
            .concat(Array.from(runningNO))
            .concat([0x41, 0x50, 0x30, 0x31]) //AP01
            .concat([0x48, 0x53, 0x4f]) //HSO
            .concat([0x29]);

        return new Buffer.from(buf);
    },
    toHex(buf) {
        return buf.toString('hex').match(/.{2}/g).join(" ");
    },
    getLocation(buf) {
        const regex = /^(\d{2})(\d{2})(\d{2})([AV]{1})(.{9})([NS]{1})(.{10})([EW])(.{5})(\d{2})(\d{2})(\d{2})(.{6})(.{8})L(.{8})$/g;
        let data = buf.toString();

        return data.split(regex);
    },
    DMM2DD(coordinate, direction){
        let coors = [];

        if(coordinate[4] == ".") {
            coors = coordinate.split(/^(\d{2})(.*)/);
        } else {
            coors = coordinate.split(/^(\d{3})(.*)/);
        }

        let dd = parseInt(coors[1]) + (parseFloat(coors[2])/60);

        if (direction == "S" || direction == "W") {
            dd = dd * -1;
        } // Don't do anything for N or E
        return dd;
    },
    getDate(year, month, day, hour, minute, second) {
        return new Date(month + "-" + day + "-20" + year + "-" + hour + ":" + minute + ":" + second);
    },
}