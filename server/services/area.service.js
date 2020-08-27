const mysql = require("mysql");

class AreaService {
    constructor() {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: "tmp_program",
        });
        this.connection.connect();
        // this.getList();
    }

    async create(area) {}

    async update(area) {}

    async delete(id) {}

    async getCoordinates() {
        return new Promise((res, rej) => {
            this.connection.query("SELECT * FROM cp_program_zone_gis_coordinates", function (error, results, fields) {
                if (error) rej(error);
                res(results);
            });
        });
    }

    async getList() {
        return new Promise((res, rej) => {
            this.connection.query("SELECT * FROM cp_program_zone_gis", function (error, results, fields) {
                if (error) rej(error);
                res(results);
            });
        });
    }
}

module.exports = { AreaService };
