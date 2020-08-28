const { ZoneService } = require("./service");

class ZoneController {
    constructor() {
        this.service = new ZoneService();
    }

    getList = async (req, res) => {
        try {
            const zones = await this.service.getList();
            res.json(zones);
        } catch (error) {
            res.status(500);
        }
    };
}

module.exports = { ZoneController };
