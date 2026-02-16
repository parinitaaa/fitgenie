export function classifyWeather(dailyWeather) {
  const temps = dailyWeather.hourly.map(h => h.temp);//[ {temp:18}, {temp:20}, {temp:22} ] final-[18, 20, 22]
  const avgTemp = temps.reduce((a,b) => a+b,0) / temps.length;//adds/3 i.e average

  let classification = "moderate";
  if (avgTemp < 18) classification = "cold";
  else if (avgTemp > 30) classification = "hot";

  const sunExposure = dailyWeather.hourly.some(h => h.condition.includes("clear"))
    ? "high" : "moderate";

  const rainProbability = dailyWeather.hourly.filter(h => h.condition.includes("rain")).length * 10;

  const summary = {
    classification,
    avgTemp: Math.round(avgTemp),
    sunExposure,
    rainProbability
  };

  return summary;
}