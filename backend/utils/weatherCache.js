const cache = new Map();

const CACHE_TTL = 1000 * 60 * 20; // 20 minutes

const getCachedWeather = (city) => {
  const entry = cache.get(city);
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL;
  if (isExpired) {
    cache.delete(city);
    return null;
  }

  return entry.data;
};

const setCachedWeather = (city, data) => {
  cache.set(city, {
    data,
    timestamp: Date.now(),
  });
};

module.exports = {
  getCachedWeather,
  setCachedWeather,
};
