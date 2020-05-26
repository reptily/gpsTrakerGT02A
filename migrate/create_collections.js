const dbinterface = require('reptily-dbinterface');
const config = require("../config");

let DB = null;
new dbinterface("mongodb").Connect(config.db, model => {  
  model.Create("location", {}, res => {
     console.log(res);
     model.Disconnect();
  });  
});