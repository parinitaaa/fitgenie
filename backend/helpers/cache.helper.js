const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.resolve("cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

exports.getCachePath = (imagePath) => {
  const file = path.basename(imagePath).replace(/\W/g, "_");
  return path.join(CACHE_DIR, file + ".json");
};
