const fs = require("fs");

exports.imageToBase64 = (imagePath) =>
  fs.readFileSync(imagePath).toString("base64");
//.
