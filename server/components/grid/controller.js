const { GridService } = require("./service");
const asyncHandler = require("express-async-handler");
class GridController {
    constructor() {
        this.service = new GridService();
    }

    search = asyncHandler(async (req, res) => {
        const { lat, lng } = req.query;
        if (!lat || !lng) res.sendStatus(400);
        const result = await this.service.search(lat, lng);
        res.status(200).json(result);
    });

    create = asyncHandler(async (req, res) => {
        const { grid } = req.body;
        if (!grid) res.sendStatus(400);
        const zoneId = await this.service.create(grid);
        res.status(200).json(zoneId);
    });

    update = asyncHandler(async (req, res) => {
        const { grid } = req.body;
        if (!grid) res.sendStatus(400);
        await this.service.update(grid);
        res.sendStatus(200);
    });

    delete = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const gridId = Number(id);
        if (typeof gridId !== "number") res.sendStatus(400);
        await this.service.delete(gridId);
        res.sendStatus(200);
        res.status(500);
    });

    getList = asyncHandler(async (req, res) => {
        const list = await this.service.getList();
        res.status(200).json(list);
    });
}

module.exports = { GridController };
