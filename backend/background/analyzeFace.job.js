const fs = require("fs");
const visionService = require("../services/facevision.service");
const enrichMetadata = require("../utils/enrichMetadata");

module.exports = async (imagePath, cachePath) =>{
  const raw = await visionService.analyze(imagePath);

  const enriched = enrichMetadata(raw);

  fs.writeFileSync(cachePath, JSON.stringify(enriched, null, 2));

};
