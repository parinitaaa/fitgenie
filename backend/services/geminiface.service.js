const axios = require("axios");
const { imageToBase64 } = require("../helpers/geminiImage.helper");
const { extractJSON } = require("../helpers/geminiJson.helper");
console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);


const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

exports.analyze = async (imagePath) => {
  const imageBase64 = imageToBase64(imagePath);

  const prompt = `
Return ONLY valid JSON.
No explanation.

{
  "skin_tone": "",
  "hair_color": "",
  "undertone": "",
  "confidence_score": 0
}
`;

  const res = await axios.post(GEMINI_URL, {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: imageBase64
            }
          }
        ]
      }
    ]
  });

  const text = res.data.candidates[0].content.parts[0].text;
  return extractJSON(text);
};
