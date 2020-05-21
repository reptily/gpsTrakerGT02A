const {ClickHouse} = require('clickhouse');
const config = require("../config");

const DB = new ClickHouse(config.db);

module.exports = {
    saveLocation(date, timestamp, lat, lng, speed, course){
        DB.query(`INSERT INTO gps VALUES('${date}', '${timestamp}', '${lat}', '${lng}', '${speed}', '${course}');`).toPromise();
    },
}