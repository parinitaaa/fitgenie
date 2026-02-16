import express from "express";
import fs from "fs";
import { getHourlyWeather } from "../services/weather.service.js";
import { classifyWeather } from "../utils/weatherClassifier.js";
import { getOutfitRecommendation } from "../services/outfit_recommendation.service.js";
import { createNotificationFromOutfit } from "../services/notification.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const dailyWeather = await getHourlyWeather();

    const weatherSummary = classifyWeather(dailyWeather);
    fs.writeFileSync(
      "data/weather_summary.json",
      JSON.stringify(weatherSummary, null, 2)
    );

    const outfit = await getOutfitRecommendation(weatherSummary);

    // ✅ CREATE NOTIFICATION AFTER OUTFIT IS READY
    const notification = createNotificationFromOutfit();

    res.json({
      status: "success",
      weather: weatherSummary,
      recommendation: outfit,
      notification: notification
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Pipeline failed" });
  }
});

export default router;