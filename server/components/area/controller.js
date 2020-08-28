const { AreaService } = require("./service");

class AreaController {
    constructor() {
        this.service = new AreaService();
    }

    create = async (req, res) => {
        try {
            const { area } = req.body;
            if (!area) res.sendStatus(400);
            const zoneId = await this.service.create(area);
            res.status(200).json(zoneId);
        } catch (error) {
            res.status(500);
        }
    };

    update = async (req, res) => {
        try {
            const { area } = req.body;
            if (!area) res.sendStatus(400);
            await this.service.update(area);
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

    getList = async (req, res) => {
        try {
            const list = await this.service.getList();
            res.status(200).json(list);
        } catch (error) {
            res.status(500);
        }
    };
}

module.exports = { AreaController };
