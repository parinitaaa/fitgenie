const axios = require("axios");

exports.getWeather = async (city) => {
  const url = "http://api.weatherapi.com/v1/current.json";

  const response = await axios.get(url, {
    params: {
      key: process.env.WEATHER_API_KEY,
      q: city,
      aqi: "yes"
    }
  });

  return response.data;
};
