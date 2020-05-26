const dbinterface = require('reptily-dbinterface');
const config = require("../config");

let DB = null;
new dbinterface("mongodb").Connect(config.db, (model, err) => {       
  if (err) throw err;
  DB = model;
});

module.exports = {
    saveLocation(date, timestamp, lat, lng, speed, course){
        DB.location.Insert({
            date,
            timestamp,
            lat,
            lng,
            speed,
            course,
        });
    },
};