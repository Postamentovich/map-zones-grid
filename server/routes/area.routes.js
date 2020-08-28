const { Router } = require("express");
const { AreaController } = require("../components/area/controller");

const router = Router();
const controller = new AreaController();

router.get("/", controller.getList);
router.get("/search", controller.search);
router.post("/", controller.create);
router.put("/", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
