const express = require("express");
const router = express.Router();
const analyzeController = require("../controllers/analyze.controller");

router.get("/", analyzeController.analyzeImage);

module.exports = router;
