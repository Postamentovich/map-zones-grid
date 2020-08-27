const { Router } = require("express");
const { AreaController } = require("../controllers/area.controller");

const areaRouter = Router();
const controller = new AreaController();

areaRouter.get("/", controller.getList);
areaRouter.post("/", controller.create);
areaRouter.put("/", controller.update);
areaRouter.delete("/:id", controller.delete);

module.exports = areaRouter;
