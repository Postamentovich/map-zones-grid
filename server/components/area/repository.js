const connection = require("../../db");

class AreaRepository {
    zoneTable = "cp_program_zone_gis";
    coordinatesTable = "cp_program_zone_gis_coordinates";

    getSqlForCoordinates = (area, insertId) => {
        if (area.shape === "Circle") {
            return `INSERT INTO ${
                this.coordinatesTable
            } (id_gis, coordinates_order, coordinates_radius, coordinates_latitude, coordinates_longitude) VALUES ${area.coordinates
                .map((coor, index) => {
                    return `(${insertId}, ${index}, '${coor.radius}', '${coor.lat}', '${coor.lng}')`;
                })
                .join(", ")}
            ;`;
        }
        return `INSERT INTO ${
            this.coordinatesTable
        } (id_gis, coordinates_order, coordinates_latitude, coordinates_longitude) VALUES ${area.coordinates
            .map((coor, index) => {
                return `(${insertId}, ${index}, '${coor.lat}', '${coor.lng}')`;
            })
            .join(", ")}
            ;`;
    };

    async create(area) {
        const sqlZones = `INSERT INTO ${this.zoneTable} (id_zone, zone_shape, zone_type_status) VALUES ("${area.zoneId}", "${area.shape}", "Active")`;
        return new Promise((res, rej) => {
            connection.query(sqlZones, (error, results) => {
                if (error) rej(error);
                const { insertId } = results;
                let sqlCoordinates = this.getSqlForCoordinates(area, insertId);
                connection.query(sqlCoordinates, (error, results) => {
                    if (error) rej(error);
                    res(insertId);
                });
            });
        });
    }

    async update(area) {
        const areaId = area.id;
        return new Promise((res, rej) => {
            const sqlDeleteCoordinates = `DELETE FROM ${this.coordinatesTable} WHERE id_gis = ${areaId}`;
            connection.query(sqlDeleteCoordinates, (error, results) => {
                if (error) rej(error);
                let sqlCoordinates = this.getSqlForCoordinates(area, areaId);
                connection.query(sqlCoordinates, (error, results) => {
                    if (error) rej(error);
                    res(results);
                });
            });
        });
    }

    async delete(areaId) {
        return new Promise((res, rej) => {
            const sqlDeleteCoordinates = `DELETE FROM ${this.coordinatesTable} WHERE id_gis = ${areaId}`;
            connection.query(sqlDeleteCoordinates, (error, results) => {
                if (error) rej(error);
                const sqlDeleteArea = `DELETE FROM ${this.zoneTable} WHERE id = ${areaId}`;
                connection.query(sqlDeleteArea, (error, results) => {
                    res(results);
                    if (error) rej(error);
                });
            });
        });
    }

    async getCoordinates() {
        return new Promise((res, rej) => {
            connection.query(`SELECT * FROM ${this.coordinatesTable}`, (error, results) => {
                if (error) rej(error);
                res(results);
            });
        });
    }

    async getList() {
        return new Promise((res, rej) => {
            connection.query(`SELECT * FROM ${this.zoneTable}`, (error, results) => {
                if (error) rej(error);
                res(results);
            });
        });
    }
}

module.exports = { AreaRepository };
