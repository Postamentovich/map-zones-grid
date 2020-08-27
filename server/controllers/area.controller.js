const { AreaService } = require("../services/area.service");

class AreaController {
    constructor() {
        this.service = new AreaService();
    }

    create = async (req, res) => {
        try {
            const { area } = req.body;
            if (!area) res.sendStatus(400);
            this.service.create(area);
            res.sendStatus(201);
        } catch (error) {
            res.status(500);
        }
    };

    update = async (req, res) => {};

    delete = async (req, res) => {};

    getList = async (req, res) => {
        try {
            const coordinates = await this.service.getCoordinates();
            const areas = await this.service.getList();
            const list = this.mapCoordinatesToArea(coordinates, areas);
            res.status(200).json(list);
        } catch (error) {
            res.status(500);
        }
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

module.exports = { AreaController };
