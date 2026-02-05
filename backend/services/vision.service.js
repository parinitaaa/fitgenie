const axios = require("axios");
const { imageToBase64 } = require("../helpers/image.helper");
const { extractJSON } = require("../helpers/json.helper");

exports.analyze = async (imagePath) => {
  const imageBase64 = imageToBase64(imagePath);

  const prompt = `
Return ONLY JSON:
{
  "skin_tone": "",
  "hair_color": "",
  "visible_clothing_colors": []
}
`;

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "llava:7b",
    prompt,
    images: [imageBase64],
    stream: false
  });

  return extractJSON(res.data.response);
  
};
