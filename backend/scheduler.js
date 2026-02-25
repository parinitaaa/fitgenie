import cron from "node-cron";
import fs from "fs";
import { getHourlyWeather } from "./services/weather.service.js";
import { classifyWeather } from "./utils/weatherClassifier.js";
import { getOutfitRecommendation } from "./services/outfit_recommendation.service.js";
import { createNotificationFromOutfit } from "./services/notification.service.js";

// Runs every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  console.log("⏰ Running daily outfit pipeline...");

  try {
    const dailyWeather = await getHourlyWeather();
    const weatherSummary = classifyWeather(dailyWeather);

    fs.writeFileSync("data/weather_summary.json", JSON.stringify(weatherSummary, null, 2));

    const outfit = await getOutfitRecommendation(weatherSummary);

    // Create notification from saved outfit
    createNotificationFromOutfit();

    console.log("Daily notification generated");
  } catch (err) {
    console.error("Daily pipeline failed:", err.message);
  }
});