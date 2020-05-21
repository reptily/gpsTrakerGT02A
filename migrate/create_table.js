const {ClickHouse} = require('clickhouse');
const config = require("../config");

const clickhouse = new ClickHouse(config.db);

const query = [
        `CREATE TABLE IF NOT EXISTS gps (
            date String,
            time DateTime('Europe/Moscow'),
            lat Float64,
            lng Float64,
            speed Float64,        
            course Float64 
        )
        ENGINE = MergeTree() PARTITION BY toYYYYMM(time) ORDER BY (time) SETTINGS index_granularity=8192;`
];

clickhouse.query(query).exec((err, rows) => {
    if(!err) {
        console.info("table is created!");
    } else {
        console.error("count not creating table", err)
    }
});