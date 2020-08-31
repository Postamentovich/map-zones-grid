const mysql = require("mysql");
const { getConfig } = require("./config");

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, DB_PORT } = getConfig();

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
});

connection.connect((err) => {
    if (err) console.error("Failed connect to database");
});

module.exports = connection;
