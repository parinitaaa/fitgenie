const express = require("express");
const analyzeRoutes = require("./routes/analyze.routes");

const app = express();
const PORT = 5000;

app.use("/analyze", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 FitGenie running → http://localhost:${PORT}`);
});
