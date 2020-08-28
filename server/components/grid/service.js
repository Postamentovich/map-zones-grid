const { GridRepository } = require("./repository");

class GridService {
    constructor() {
        this.repository = new GridRepository();
    }

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
                    .filter((coor) => coor.id_gis === grid.id)
                    .sort((a, b) => a.coordinates_order - b.coordinates_order)
                    .map((el) => ({
                        lat: el.coordinates_latitude,
                        lng: el.coordinates_longitude,
                        radius: el.coordinates_radius,
                    })),
            };
        });
    }
}

module.exports = { GridService };
