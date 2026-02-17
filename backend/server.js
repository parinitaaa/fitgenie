import express from "express";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });
let lastClothingResult = null;
let lastSkinResult = null;

function tryMergeAndSave() {
  if (lastClothingResult && lastSkinResult) {
    const mergedData = {
      ...lastClothingResult,
      ...lastSkinResult
    };
    if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
    }

    fs.writeFileSync(
      "data/user_analysis.json",
      JSON.stringify(mergedData, null, 2)
    );

    console.log("Merged & saved:", mergedData);

    // Optional: reset after save
    lastClothingResult = null;
    lastSkinResult = null;
  }
}


app.post("/analyze-clothing", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");

    const prompt = `
Analyze the clothing in the image.

Return ONLY valid JSON in this exact format:
{
  "color": "",
  "pattern": "",
  "sleeves": "",
  "type": "shirt",
  "style": "baggy",
  "fit": "oversized"
}
Rules:
- color = main clothing color
- pattern = solid, striped, floral, checked, printed
- sleeves = sleeveless, short, three-quarter, long
- type = shirt, t-shirt, pants, jeans, dress, kurta, hoodie, jacket, skirt, shorts, top
- style = casual, baggy, formal, sporty, traditional, streetwear
- fit = slim, regular, oversized

No explanation.
Do not add text.
Return only JSON.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: req.file.mimetype,
                    data: base64Image
                  }
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates.length) {
     return res.status(500).json({ error: "No candidates from Gemini", raw: data });
}
    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);

    lastClothingResult = parsed;
    tryMergeAndSave();

    fs.unlinkSync(req.file.path);
    res.json(parsed);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image analysis failed" });
  }
});

app.post("/analyze-skin", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");

    const prompt = `
Analyze the person's face in the image.

Return ONLY valid JSON in this exact format:
{
  "skinTone": ""
}

Rules:
- skinTone must be one of:
very fair, fair, light, medium, warm medium, tan, dark

No explanation.
No extra text.
Return only JSON.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: req.file.mimetype,
                    data: base64Image
                  }
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("SKIN GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates.length) {
      return res.status(500).json({ error: "No candidates from Gemini", raw: data });
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanText = text
     .replace(/```json/g, "")
     .replace(/```/g, "")
     .trim();

    const parsed = JSON.parse(cleanText);


    lastSkinResult = parsed;
    tryMergeAndSave();

    fs.unlinkSync(req.file.path);


    res.json(parsed);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Skin tone analysis failed", details: err.message });
  }
});



app.listen(5005, () => {
  console.log("Server running on http://localhost:5005");
});
