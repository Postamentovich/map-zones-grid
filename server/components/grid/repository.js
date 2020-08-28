const connection = require("../../db");

class GridRepository {
    gridTable = "cp_program_grid_map";
    coordinatesTable = "cp_program_grid_map_gis";

    getSqlForCoordinates = (grid, insertId) => {
        return `INSERT INTO ${
            this.coordinatesTable
        } (id_grid_map, coordinates_order, coordinates_latitude, coordinates_longitude) VALUES ${grid.coordinates
            .map((coor, index) => {
                return `(${insertId}, ${index}, '${coor.lat}', '${coor.lng}')`;
            })
            .join(", ")}
                ;`;
    };

    create = async (grid) => {
        const { title, rows, columns, status } = grid;
        const sqlTable = `INSERT INTO ${this.gridTable} (grid_map_title, grid_map_rows, grid_map_columns, grid_map_status) VALUES ("${title}", ${rows}, ${columns}, "${status}")`;
        return new Promise((res, rej) => {
            connection.query(sqlTable, (error, results) => {
                if (error) rej(error);
                const { insertId } = results;
                let sqlCoordinates = this.getSqlForCoordinates(grid, insertId);
                connection.query(sqlCoordinates, (error, results) => {
                    if (error) rej(error);
                    res(insertId);
                });
            });
        });
    };

    updateCoordinates(grid) {
        const gridId = grid.id;
        return new Promise((res, rej) => {
            const sqlDeleteCoordinates = `DELETE FROM ${this.coordinatesTable} WHERE id_grid_map = ${gridId}`;
            connection.query(sqlDeleteCoordinates, (error, results) => {
                if (error) rej(error);
                let sqlCoordinates = this.getSqlForCoordinates(grid, gridId);
                connection.query(sqlCoordinates, (error, results) => {
                    if (error) rej(error);
                    res(results);
                });
            });
        });
    }

    updateGrid(grid) {
        const { title, rows, columns, status, id } = grid;
        return new Promise((res, rej) => {
            const sql = `UPDATE ${this.gridTable} SET grid_map_title = "${title}", grid_map_rows = ${rows}, grid_map_columns = ${columns}, grid_map_status = ${status} WHERE id = ${id}`;
            connection.query(sql, (error, results) => {
                if (error) rej(error);
                res(results);
            });
        });
    }

    async update(grid) {
        await this.updateCoordinates(grid);
        await this.updateGrid(grid);
    }

    async delete(gridId) {
        return new Promise((res, rej) => {
            const sqlDeleteCoordinates = `DELETE FROM ${this.coordinatesTable} WHERE id_grid_map = ${gridId}`;
            connection.query(sqlDeleteCoordinates, (error, results) => {
                if (error) rej(error);
                const sqlDeleteArea = `DELETE FROM ${this.gridTable} WHERE id = ${gridId}`;
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
            connection.query(`SELECT * FROM ${this.gridTable}`, (error, results) => {
                if (error) rej(error);
                res(results);
            });
        });
    }
}

module.exports = { GridRepository };
