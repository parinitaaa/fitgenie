const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.resolve("cache");

exports.getCachePath = (imagePath, category) => {
  const dir = path.join(CACHE_DIR, category);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const file = path.basename(imagePath).replace(/\W/g, "_");
  return path.join(dir, file + ".json");
};
