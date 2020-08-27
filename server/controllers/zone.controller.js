const { ZoneService } = require("../services/zone.service");

class ZoneController {
    constructor() {
        this.service = new ZoneService();
    }

    getList = async (req, res) => {
        try {
            const zones = await this.service.getList();
            const result = this.processZones(zones);
            res.json(result);
        } catch (error) {
            res.status(500);
        }
    };

    processZones = (zones) => {
        if (!zones) return [];
        return zones.map((zone) => ({
            id: zone.id,
            title: zone.zone_title,
        }));
    };
}

module.exports = { ZoneController };
