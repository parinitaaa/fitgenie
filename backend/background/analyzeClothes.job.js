const fs = require("fs");
const visionService = require("../services/clothesVision.service");

module.exports = async (imagePath, cachePath) => {
  const data = await visionService.analyze(imagePath);
  fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
};
