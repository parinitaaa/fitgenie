// TRIALjs using llava and not llave:7b since it seems to be more consistent with vision tasks. Will test both later and compare results.

const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// ---- CONFIG ----
const IMAGE_RELATIVE_PATH = "assets/faces/light.jpg";
const IMAGE_PATH = path.resolve(__dirname, IMAGE_RELATIVE_PATH);

// ---- VALIDATE IMAGE ----
if (!fs.existsSync(IMAGE_PATH)) {
  throw new Error("❌ Image not found at: " + IMAGE_PATH);
}

console.log("🖼️ Using image:", IMAGE_PATH);

// ---- HELPERS ----
function imageToBase64(imagePath) {
  return fs.readFileSync(imagePath).toString("base64");
}

function extractJSON(text) {
  // Remove markdown fences if present
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Extract first JSON block
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found");

  return JSON.parse(match[0]);
}

// ---- ROUTES ----
app.get("/analyze", async (req, res) => {
  try {
    const imageBase64 = imageToBase64(IMAGE_PATH);

    const prompt = `
You are a strict JSON generator.

Return ONLY valid JSON in this exact format:
{
  "skin_tone": "",
  "skin_hex": "",
  "undertone": "",
  "hair_color": "",
  "face_shape": "",
  "visible_clothing_colors": [],
  "confidence": ""
}

Rules:
- No markdown
- No explanations
- No extra text
- Best visual estimate
`;

    console.log("🚀 Sending request to LLaVA");

    console.time("llava");
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llava",
        prompt,
        images: [imageBase64],
        stream: false
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 0 // vision models can be slow
      }
    );
    console.timeEnd("llava");

    console.log("✅ LLaVA responded");

    const rawOutput = response.data.response;

    let json;
    try {
      json = extractJSON(rawOutput);
    } catch (err) {
      return res.status(500).json({
        error: "Invalid JSON from model",
        raw_output: rawOutput
      });
    }

    res.json(json);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "LLaVA failed",
      details: err.response?.data || err.message
    });
  }
});

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`🚀 Server running → http://localhost:${PORT}/analyze`);
});
