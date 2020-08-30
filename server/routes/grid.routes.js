const { Router } = require("express");
const { GridController } = require("../components/grid/controller");

const router = Router();
const controller = new GridController();

router.get("/", controller.getList);
router.post("/", controller.create);
router.put("/", controller.update);
router.delete("/:id", controller.delete);
router.get("/search", controller.search);

module.exports = router;
