const { ZoneRepository } = require("./repository");

class ZoneService {
    constructor() {
        this.repository = new ZoneRepository();
    }

    getList = async () => {
        const zones = await this.repository.getList();
        return this.processZones(zones);
    };

    processZones = (zones) => {
        if (!zones) return [];
        return zones.map((zone) => ({
            id: zone.id,
            title: zone.zone_title,
        }));
    };
}

module.exports = { ZoneService };
