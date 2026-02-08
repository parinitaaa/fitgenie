const weatherService = require("../services/weather.service");

exports.getWeather = async (req, res) => {
  try {
    const city = req.query.city || "Bangalore";
    const data = await weatherService.getWeather(city);

    res.json({
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        local_time: data.location.localtime
      },
      temperature: {
        celsius: data.current.temp_c,
        feels_like: data.current.feelslike_c
      },
      condition: data.current.condition.text,
      humidity: data.current.humidity,
      wind_kph: data.current.wind_kph,
      air_quality: {
        pm2_5: data.current.air_quality.pm2_5,
        pm10: data.current.air_quality.pm10,
        co: data.current.air_quality.co
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};
