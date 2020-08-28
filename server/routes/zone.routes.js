const { Router } = require("express");
const { ZoneController } = require("../components/zone/controller");

const router = Router();
const controller = new ZoneController();

router.get("/", controller.getList);

module.exports = router;
