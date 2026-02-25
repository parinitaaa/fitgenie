import fetch from "node-fetch";
import fs from "fs";

const WEATHER_URL = (lat, lon) =>
  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

export async function getHourlyWeather() {
  const res = await fetch(WEATHER_URL(12.97, 77.59)); // Bangalore
  const data = await res.json();

  const hourly = data.list.slice(0, 8).map(item => ({ //(array of weather objects every 3 hours) map item-Convert each weather object into a smaller object
    /*Each item becomes:

{
  time: "09:00",
  temp: 18,
  condition: "cloudy"
}*/
    time: item.dt_txt.split(" ")[1].slice(0,5),
    temp: item.main.temp,
    condition: item.weather[0].main.toLowerCase()
  }));

  const dailyWeather = {
    date: new Date().toISOString().split("T")[0],/*.toISOString() → "2026-02-15T10:30:00.000Z"
                                                  .split("T")[0] → "2026-02-15"*/
    hourly
  };

  fs.writeFileSync("data/daily_weather.json", JSON.stringify(dailyWeather, null, 2));

  return dailyWeather;
}