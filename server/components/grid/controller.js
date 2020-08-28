// const { AreaService } = require("../services/area.service");

class GridController {
    constructor() {
        // this.service = new AreaService();
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

    update = async (req, res) => {
        try {
            const { area } = req.body;
            if (!area) res.sendStatus(400);
            this.service.update(area);
            res.sendStatus(200);
        } catch (error) {
            res.status(500);
        }
    };

    delete = async (req, res) => {
        const { id } = req.params;
        const areaId = Number(id);
        if (typeof areaId !== "number") res.sendStatus(400);
        try {
            await this.service.delete(areaId);
            res.sendStatus(200);
        } catch (error) {
            res.status(500);
        }
    };

    getCell = async (req, res) => {
        try {
            const coordinates = await this.service.getCoordinates();
            const areas = await this.service.getList();
            const list = this.mapCoordinatesToArea(coordinates, areas);
            res.status(200).json(list);
        } catch (error) {
            res.status(500);
        }
    };
}

module.exports = { GridController };
