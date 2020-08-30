const { ZoneService } = require("./service");
const asyncHandler = require("express-async-handler");
class ZoneController {
    constructor() {
        this.service = new ZoneService();
    }

    getList = asyncHandler(async (req, res) => {
        const zones = await this.service.getList();
        res.json(zones);
    });
}

module.exports = { ZoneController };
