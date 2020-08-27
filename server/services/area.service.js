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
    }

    getSqlForCoordinates = (area, insertId) => {
        if (area.shape === "Circle") {
            return `INSERT INTO cp_program_zone_gis_coordinates (id_gis, coordinates_order, coordinates_radius, coordinates_latitude, coordinates_longitude) VALUES ${area.coordinates
                .map((coor, index) => {
                    return `(${insertId}, ${index}, '${coor.radius}', '${coor.lat}', '${coor.lng}')`;
                })
                .join(", ")}
            ;`;
        }
        return `INSERT INTO cp_program_zone_gis_coordinates (id_gis, coordinates_order, coordinates_latitude, coordinates_longitude) VALUES ${area.coordinates
            .map((coor, index) => {
                return `(${insertId}, ${index}, '${coor.lat}', '${coor.lng}')`;
            })
            .join(", ")}
            ;`;
    };

    async create(area) {
        const sqlZones = `INSERT INTO cp_program_zone_gis (id_zone, zone_shape, zone_type_status) VALUES ("${area.zoneId}", "${area.shape}", "Active")`;
        return new Promise((res, rej) => {
            this.connection.query(sqlZones, (error, results) => {
                if (error) rej(error);
                const { insertId } = results;
                let sqlCoordinates = this.getSqlForCoordinates(area, insertId);
                this.connection.query(sqlCoordinates, (error, results) => {
                    if (error) rej(error);
                    res(results);
                });
            });
        });
    }

    async update(area) {
        const areaId = area.id;
        return new Promise((res, rej) => {
            const sqlDeleteCoordinates = `DELETE FROM cp_program_zone_gis_coordinates WHERE id_gis = ${areaId}`;
            this.connection.query(sqlDeleteCoordinates, (error, results) => {
                if (error) rej(error);
                let sqlCoordinates = this.getSqlForCoordinates(area, areaId);
                this.connection.query(sqlCoordinates, (error, results) => {
                    if (error) rej(error);
                    res(results);
                });
            });
        });
    }

    async delete(id) {}

    async getCoordinates() {
        return new Promise((res, rej) => {
            this.connection.query("SELECT * FROM cp_program_zone_gis_coordinates", (error, results) => {
                if (error) rej(error);
                res(results);
            });
        });
    }

    async getList() {
        return new Promise((res, rej) => {
            this.connection.query("SELECT * FROM cp_program_zone_gis", (error, results) => {
                if (error) rej(error);
                res(results);
            });
        });
    }
}

module.exports = { AreaService };
