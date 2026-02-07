const fs = require("fs");

exports.imageToBase64 = (imagePath) => {
  const buffer = fs.readFileSync(imagePath);
  return buffer.toString("base64");
};
