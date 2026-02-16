import express from "express";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
import dailyPipelineRoute from "./routes/dailyPipeline.route.js";
import notificationRoute from "./routes/notification.route.js";


const app = express();
const upload = multer({ dest: "uploads/" });
let lastClothingResult = null;
let lastSkinResult = null;

function ensureDataFolder() {
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }
}

function saveUserProfile(skinData) {
  ensureDataFolder();
  fs.writeFileSync(
    "data/user_profile.json",
    JSON.stringify(skinData, null, 2)
  );
}

function saveWardrobeItem(clothingData) {
  ensureDataFolder();

  let wardrobe = [];

  if (fs.existsSync("data/wardrobe_database.json")) {
    wardrobe = JSON.parse(
      fs.readFileSync("data/wardrobe_database.json", "utf-8")
    );
  }

  const newItem = {
    id: `cloth_${String(wardrobe.length + 1).padStart(3, "0")}`,
    ...clothingData
  };

  wardrobe.push(newItem);

  fs.writeFileSync(
    "data/wardrobe_database.json",
    JSON.stringify(wardrobe, null, 2)
  );

  return newItem;
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
                    mimeType: req.file.mimetype,//This tells Gemini what type of file you uploaded
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
    //without null,2 {"name":"Alex","age":22}
    if (!data.candidates || !data.candidates.length) { //Did Gemini actually send any answers?
    // data
    //└─ candidates[0]
     // └─ content
          // └─ parts[0]
              //  └─ text
     return res.status(500).json({ error: "No candidates from Gemini", raw: data });
}
    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    //This uses regex to grab only:

   //{ 
   //"color": "maroon",
   //"pattern": "solid"
   //}
    const parsed = JSON.parse(jsonMatch[0]);

    const savedItem = saveWardrobeItem(parsed);

    fs.unlinkSync(req.file.path);//Deletes uploaded image from:uploads
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
   /*imageBuffer looks like:

<Buffer ff d8 ff e0 00 10 4a 46 49 46 ...>

(binary junk – computers understand this)

Now:

const base64Image = imageBuffer.toString("base64");

It becomes a string like:

/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUTEhIVFRUVFRUVFRUVFRUVFRUVFRUWFhUVFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFRAQFS0dFR0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQADBgIBB//EADsQAAIBAwIDBgQEBQUAAAAAAAECAwAEEQUSITFBBhMiUWEycYGRMkKhsRQjQlJywdHw8RUkYnL/xAAZAQEAAwEBAAAAAAAAAAAAAAAAAQIDBAX/xAAgEQEBAAICAgMBAAAAAAAAAAAAAQIDEQQSITEFEyJR/9oADAMBAAIRAxEAPwD9xooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z

Why base64?
✔ can be sent in JSON
✔ safe for APIs
✔ Gemini understands it
✔ no binary corruption
*/
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
      //Gemini sometimes returns:

          //```json
          //{ "skinTone": "warm medium" }
    const parsed = JSON.parse(cleanText);


    saveUserProfile(parsed);
    console.log("User profile saved:", parsed);

    fs.unlinkSync(req.file.path);


    res.json(parsed);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Skin tone analysis failed", details: err.message });
  }
});

app.use("/run-daily", dailyPipelineRoute);
app.use("/notifications", notificationRoute);

app.listen(5005, () => {
  console.log("Server running on http://localhost:5005");
});
