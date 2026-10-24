
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeather(city) {
  const geoUrl = new URL(GEO_URL);
  geoUrl.search = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json"
  });

  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) throw new Error("City search failed.");

  const geoData = await geoResponse.json();
  const place = geoData.results?.[0];

  if (!place) {
    throw new Error("City not found. Check the spelling and try again.");
  }

  const weatherUrl = new URL(WEATHER_URL);
  weatherUrl.search = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
      "is_day"
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max"
    ].join(","),
    timezone: "auto",
    forecast_days: "3"
  });

  const response = await fetch(weatherUrl);
  if (!response.ok) throw new Error("Weather data is temporarily unavailable.");

  const data = await response.json();

  return {
    city: place.name,
    country: place.country,
    current: data.current,
    forecast: data.daily.time.map((date, i) => ({
      date,
      code: data.daily.weather_code[i],
      max: data.daily.temperature_2m_max[i],
      min: data.daily.temperature_2m_min[i],
      rain: data.daily.precipitation_probability_max[i] ?? 0
    }))
  };
}
