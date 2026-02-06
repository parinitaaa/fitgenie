const router = require("express").Router();
const controller = require("../controllers/clothes.controller");

router.get("/", controller.analyzeClothes);
module.exports = router;