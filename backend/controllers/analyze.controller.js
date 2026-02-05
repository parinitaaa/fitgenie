const fs = require("fs");
const path = require("path");
const { getCachePath } = require("../helpers/cache.helper");
const analyzeImageJob = require("../background/analyzeImage.job");

const IMAGE_PATH = path.resolve("assets/faces/dark_skinned.jpg");

exports.analyzeImage = (req, res) => {
  const cachePath = getCachePath(IMAGE_PATH);

  // ✅ Ensure cache file exists
  if (!fs.existsSync(cachePath)) {
    fs.writeFileSync(cachePath, JSON.stringify({})); // creates empty JSON file
    console.log("⚠️ Cache file created automatically");
  }

  // Try reading cache
  try {
    const data = fs.readFileSync(cachePath, "utf-8");
    if (!data.trim() || data.trim() === "{}") throw new Error("Cache empty");
    
    return res.json(JSON.parse(data)); // return cached data if available
  } catch {
    console.log("⚠️ Cache not ready yet");
  }

  // Run background job to generate real data
  analyzeImageJob(IMAGE_PATH, cachePath)
    .then(() => console.log("✅ Metadata ready"))
    .catch(console.error);

  // Respond instantly
  res.json({ status: "analyzing" });
  
};
