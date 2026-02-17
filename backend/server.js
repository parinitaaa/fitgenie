require("dotenv").config();
const express = require("express");
const faceRoutes = require("./routes/face.routes");
const clothesRoutes = require("./routes/clothes.routes");
const weatherRoutes = require("./routes/weather.routes");

const app = express();
const PORT = 5000;

app.use("/analyze/face", faceRoutes);
app.use("/analyze/clothes", clothesRoutes);
app.use("/weather", weatherRoutes);

app.listen(PORT, () => {
  console.log(`🚀 FitGenie running → http://localhost:${PORT}`);
  
});
