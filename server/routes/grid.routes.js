const { Router } = require("express");
const { GridController } = require("../components/grid/controller");

const router = Router();
const controller = new GridController();

router.get("/", controller.getCell);
router.post("/", controller.create);
router.put("/", controller.update);
router.delete("/", controller.delete);

module.exports = router;
