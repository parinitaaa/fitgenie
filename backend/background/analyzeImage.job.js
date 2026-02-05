const fs = require("fs");
const visionService = require("../services/vision.service");
const enrichMetadata = require("../utils/enrichMetadata");

module.exports = async function analyzeImageJob(imagePath, cachePath) {
  const rawMetadata = await visionService.analyze(imagePath);

  const enriched = enrichMetadata(rawMetadata);

  fs.writeFileSync(cachePath, JSON.stringify(enriched, null, 2));
  
};
