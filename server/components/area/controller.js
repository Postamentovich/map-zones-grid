const { AreaService } = require("./service");
const asyncHandler = require("express-async-handler");
class AreaController {
    constructor() {
        this.service = new AreaService();
    }

    search = asyncHandler(async (req, res) => {
        const { lat, lng } = req.query;
        if (!lat || !lng) res.sendStatus(400);
        const result = await this.service.search(lat, lng);
        res.status(200).json(result);
    });

    create = asyncHandler(async (req, res) => {
        const { area } = req.body;
        if (!area) res.sendStatus(400);
        const zone = await this.service.create(area);
        res.status(200).json(zone);
    });

    update = asyncHandler(async (req, res) => {
        const { area } = req.body;
        if (!area) res.sendStatus(400);
        await this.service.update(area);
        res.sendStatus(200);
    });

    delete = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const areaId = Number(id);
        if (typeof areaId !== "number") res.sendStatus(400);
        await this.service.delete(areaId);
        res.sendStatus(200);
    });

    getList = asyncHandler(async (req, res) => {
        const list = await this.service.getList();
        res.status(200).json(list);
    });
}

module.exports = { AreaController };
