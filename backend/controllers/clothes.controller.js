// controllers/clothes.controller.js
const fs = require("fs");
const path = require("path");
const { getCachePath } = require("../helpers/cache.helper");
const analyzeClothesJob = require("../background/analyzeClothes.job");

const IMAGE_PATH = path.resolve("assets/clothes/top3.jpg");

exports.analyzeClothes = (req, res) => {
  const cachePath = getCachePath(IMAGE_PATH, "clothes");

  // 1️⃣ Ensure cache file exists
  if (!fs.existsSync(cachePath)) {
    fs.writeFileSync(cachePath, "{}");
    console.log("🆕 Clothes cache file created");
  }

  // 2️⃣ Try reading cache
  try {
    const data = fs.readFileSync(cachePath, "utf-8");

    if (data.trim() && data.trim() !== "{}") {
      console.log("⚡ Clothes cache hit");
      return res.json(JSON.parse(data));
    }

    console.log("⏳ Clothes cache not ready yet");
  } catch (err) {
    console.log("⚠️ Error reading clothes cache:", err.message);
  }

  // 3️⃣ Run background job
  analyzeClothesJob(IMAGE_PATH, cachePath)
    .then(() => console.log("✅ Clothes metadata ready"))
    .catch((err) => console.error("❌ Clothes job failed:", err));

  // 4️⃣ Respond immediately
  res.json({ status: "analyzing clothes" });
};
