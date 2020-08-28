const connection = require("../db");

class ZoneService {
    async getList() {
        return new Promise((res, rej) => {
            connection.query("SELECT * FROM cp_program_zones", (error, results) => {
                if (error) rej(error);
                res(results);
            });
        });
    }
}

module.exports = { ZoneService };
