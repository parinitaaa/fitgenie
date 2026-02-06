// controllers/face.controller.js
const fs = require("fs");
const path = require("path");
const { getCachePath } = require("../helpers/cache.helper");
const analyzeFaceJob = require("../background/analyzeFace.job");

const IMAGE_PATH = path.resolve("assets/faces/dark_skinned.jpg");

exports.analyzeFace = (req, res) => {
  const cachePath = getCachePath(IMAGE_PATH, "faces");

  // 1️⃣ Ensure cache file exists
  if (!fs.existsSync(cachePath)) {
    fs.writeFileSync(cachePath, "{}");
    console.log("🆕 Face cache file created");
  }

  // 2️⃣ Try reading cache
  try {
    const data = fs.readFileSync(cachePath, "utf-8");

    if (data.trim() && data.trim() !== "{}") {
      console.log("⚡ Face cache hit");
      return res.json(JSON.parse(data));
    }

    console.log("⏳ Face cache not ready yet");
  } catch (err) {
    console.log("⚠️ Error reading face cache:", err.message);
  }

  // 3️⃣ Run background job
  analyzeFaceJob(IMAGE_PATH, cachePath)
    .then(() => console.log("✅ Face metadata ready"))
    .catch((err) => console.error("❌ Face job failed:", err));

  // 4️⃣ Respond immediately
  res.json({ status: "analyzing face" });
};
