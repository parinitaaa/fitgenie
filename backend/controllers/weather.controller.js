const weatherService = require("../services/weather.service");
const {
  getCachedWeather,
  setCachedWeather,
} = require("../utils/weatherCache");

exports.getWeather = async (req, res) => {
  try {
    const {city} = req.query;
    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

     // Check cache first
    const cached = getCachedWeather(city.toLowerCase());
    if (cached) {
      return res.json({
        source: "cache",
        data: cached,
      });
    }

     //  Fetch fresh data
    const weather = await weatherService.getWeatherByCity(city);

    //  Store in cache
    setCachedWeather(city.toLowerCase(), weather);
    res.json({
      source: "api",
      data: weather,
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};
