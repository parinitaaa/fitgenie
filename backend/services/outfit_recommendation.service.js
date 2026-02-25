import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getOutfitRecommendation() {
  // 1. Load local data
  const weatherSummary = JSON.parse(
    fs.readFileSync("data/weather_summary.json", "utf-8")
  );

  const wardrobe = JSON.parse(
    fs.readFileSync("data/wardrobe_database.json", "utf-8")
  );

  const userProfile = JSON.parse(
    fs.readFileSync("data/user_profile.json", "utf-8")
  );

  // 2. Prompt
  const prompt = `
You are a fashion recommendation engine.

Weather:
${JSON.stringify(weatherSummary)}

User profile:
${JSON.stringify(userProfile)}

Wardrobe (available clothes only):
${JSON.stringify(wardrobe)}

Rules:
- Pick ONLY clothes from wardrobe list
- Choose suitable for weather
- Match skin tone & color theory
- Follow Gen Z fashion trends

Return ONLY valid JSON:
{
  "outfit": {
    "top": "",
    "bottom": "",
    "layer": ""
  },
  "reason": ""
}
`;

  // 3. Gemini call
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // 4. Extract JSON safely
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON returned");

  const parsed = JSON.parse(jsonMatch[0]);

  // 5. Save locally
  fs.writeFileSync(
    "data/outfit_recommendation.json",
    JSON.stringify(parsed, null, 2)
  );

  return parsed;
}