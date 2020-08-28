const mysql = require("mysql");
const { getConfig } = require("./config");

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } = getConfig();
const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});

connection.connect();
console.log("connected");

module.exports = connection;
