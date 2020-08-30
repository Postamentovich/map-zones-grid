const { AreaRepository } = require("./repository");
const turf = require("@turf/turf");
class AreaService {
    constructor() {
        this.repository = new AreaRepository();
    }

    isPointInArea = (area, lat, lng) => {
        const point = turf.point([lng, lat]);
        if (area.shape === "Circle") {
            const coor = area.coordinates[0];
            if (!coor) return;
            const center = turf.point([coor.lng, coor.lat]);
            const radius = coor.radius;
            const distance = turf.distance(point, center) * 1000;
            return distance < radius;
        } else if (area.shape === "Polygon") {
            const coordinates = area.coordinates.map((el) => [el.lng, el.lat]);
            if (coordinates.length && coordinates.length < 4) coordinates.push(coordinates[coordinates.length - 1]);
            const line = turf.lineString(coordinates);
            const polygon = turf.lineToPolygon(line);
            return turf.booleanPointInPolygon(point, polygon);
        }
    };

    search = async (lat, lng) => {
        const list = await this.getList();
        return list.filter((area) => this.isPointInArea(area, lat, lng));
    };

    create = async (area) => {
        return await this.repository.create(area);
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
        return this.mapCoordinatesToArea(coordinates, areas);
    };

    mapAreaCoordiantes(area, coordinates) {
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
    }

    mapCoordinatesToArea(coordinates, areas) {
        return areas.map((area) => this.mapAreaCoordiantes(area, coordinates));
    }
}

module.exports = { AreaService };
