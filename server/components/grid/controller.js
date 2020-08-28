const { GridService } = require("./service");

class GridController {
    constructor() {
        this.service = new GridService();
    }

    create = async (req, res) => {
        try {
            const { grid } = req.body;
            if (!grid) res.sendStatus(400);
            const zoneId = await this.service.create(grid);
            res.status(200).json(zoneId);
        } catch (error) {
            res.status(500);
        }
    };

    update = async (req, res) => {
        try {
            const { grid } = req.body;
            if (!grid) res.sendStatus(400);
            await this.service.update(grid);
            res.sendStatus(200);
        } catch (error) {
            res.status(500);
        }
    };

    delete = async (req, res) => {
        const { id } = req.params;
        const gridId = Number(id);
        if (typeof gridId !== "number") res.sendStatus(400);
        try {
            await this.service.delete(gridId);
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

module.exports = { GridController };
