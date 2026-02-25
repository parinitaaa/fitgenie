const router = require("express").Router();
const controller = require("../controllers/face.controller");

router.get("/", controller.analyzeFace);
module.exports = router;