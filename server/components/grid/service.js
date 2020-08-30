const turf = require("@turf/turf");
const { GridRepository } = require("./repository");

class GridService {
    constructor() {
        this.repository = new GridRepository();
    }

    numToAlpha = (num) => {
        let alpha = "";
        for (; num >= 0; num = parseInt(num / 26, 10) - 1) {
            alpha = String.fromCharCode((num % 26) + 0x41) + alpha;
        }
        return alpha;
    };

    getCellInGrid = (grid, lat, lng) => {
        const { coordinates, rows, columns } = grid;
        const point = turf.point([lng, lat]);
        const latLngs = coordinates.map((el) => [el.lng, el.lat]);
        const columnCoor = [latLngs[1], latLngs[2]];
        const columnLine = turf.lineString(columnCoor);
        const columnLength = turf.length(columnLine);
        const columnStep = columnLength / columns;
        const rowCoor = [latLngs[1], latLngs[0]];
        const rowLine = turf.lineString(rowCoor);
        const rowLength = turf.length(rowLine);
        const rowStep = rowLength / rows;
        const columnPoint = turf.nearestPointOnLine(columnLine, point);
        const rowPoint = turf.nearestPointOnLine(rowLine, point);
        if (!columnPoint || !rowPoint) return;
        const columnLocation = columnPoint.properties.location;
        const rowLocation = rowPoint.properties.location;
        const columnCell = Math.floor(columnLocation / columnStep);
        const rowCell = Math.floor(rowLocation / rowStep);
        const row = rowCell + 1;
        const column = this.numToAlpha(columnCell);
        return { row, column };
    };

    isPointInGrid = (grid, lat, lng) => {
        const coordinates = grid.coordinates.map((el) => [el.lat, el.lng]);
        if (coordinates.length < 2) return;
        const point = turf.point([lat, lng]);
        const line = turf.lineString(coordinates);
        const polygon = turf.lineToPolygon(line);
        return turf.booleanPointInPolygon(point, polygon);
    };

    search = async (lat, lng) => {
        const list = await this.getList();
        const grid = list.find((area) => this.isPointInGrid(area, lat, lng));
        if (!grid) return;
        const cell = this.getCellInGrid(grid, lat, lng);
        return cell || null;
    };

    create = async (area) => {
        return this.repository.create(area);
    };

    update = async (area) => {
        return this.repository.update(area);
    };

    delete = async (areaId) => {
        return this.repository.delete(areaId);
    };

    getList = async () => {
        const coordinates = await this.repository.getCoordinates();
        const grids = await this.repository.getList();
        const list = this.mapCoordinatesToArea(coordinates, grids);
        return list;
    };

    mapCoordinatesToArea(coordinates, grids) {
        return grids.map((grid) => {
            return {
                id: grid.id,
                title: grid.grid_map_title,
                rows: grid.grid_map_rows,
                columns: grid.grid_map_columns,
                status: grid.grid_map_status,
                coordinates: coordinates
                    .filter((coor) => coor.id_grid_map === grid.id)
                    .sort((a, b) => a.coordinates_order - b.coordinates_order)
                    .map((el) => ({
                        lat: el.coordinates_latitude,
                        lng: el.coordinates_longitude,
                    })),
            };
        });
    }
}

module.exports = { GridService };
