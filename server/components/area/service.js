const { AreaRepository } = require("./repository");

class AreaService {
    constructor() {
        this.repository = new AreaRepository();
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
        const areas = await this.repository.getList();
        const list = this.mapCoordinatesToArea(coordinates, areas);
        return list;
    };

    mapCoordinatesToArea(coordinates, areas) {
        return areas.map((area) => {
            return {
                id: area.id,
                zoneId: area.id_zone,
                shape: area.zone_shape,
                coordinates: coordinates
                    .filter((coor) => coor.id_gis === area.id)
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

module.exports = { AreaService };
