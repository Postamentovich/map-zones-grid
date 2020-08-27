const mysql = require("mysql");

class ZoneService {
    constructor() {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: "tmp_program",
        });
        this.connection.connect();
    }

    async getList() {
        return new Promise((res, rej) => {
            this.connection.query("SELECT * FROM cp_program_zones", (error, results) => {
                if (error) rej(error);
                res(results);
            });
        });
    }
}

module.exports = { ZoneService };
