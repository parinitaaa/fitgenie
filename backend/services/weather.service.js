const axios = require("axios");

const normalizeWeather = (data) => {
  return {
    city: data.location.name,
    country: data.location.country,

    temp: data.current.temp_c,
    feelsLike: data.current.feelslike_c,

    condition: data.current.condition.text,
    conditionCode: data.current.condition.code,

    humidity: data.current.humidity,
    wind: data.current.wind_kph,
    rain: data.current.precip_mm,
    uv: data.current.uv,

    aqi: data.current.air_quality["us-epa-index"],

    isCold: data.current.feelslike_c < 15,
    isRainy: data.current.precip_mm > 0,
    isFoggy: data.current.condition.text.toLowerCase().includes("fog"),
  };
};


const getWeatherByCity = async (city) => {
  const url = "https://api.weatherapi.com/v1/current.json";

  const response = await axios.get(url, {
    params: {
      key: process.env.WEATHER_API_KEY,
      q: `${city},IN`,
      aqi: "yes"
    }
  });

  return normalizeWeather(response.data);;
};

module.exports = {
  getWeatherByCity,
};