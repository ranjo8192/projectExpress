var mysql = require('mysql');
exports.dbConnection = function(){
var con = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'nodejs'
});
return con;
};