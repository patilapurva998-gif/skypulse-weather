
const codes = {
  0: ["Clear sky", "☀️", "sunny"],
  1: ["Mostly clear", "🌤️", "sunny"],
  2: ["Partly cloudy", "⛅", "cloudy"],
  3: ["Overcast", "☁️", "cloudy"],
  45: ["Foggy", "🌫️", "cloudy"],
  48: ["Foggy", "🌫️", "cloudy"],
  51: ["Light drizzle", "🌦️", "rainy"],
  53: ["Drizzle", "🌦️", "rainy"],
  55: ["Heavy drizzle", "🌧️", "rainy"],
  61: ["Light rain", "🌦️", "rainy"],
  63: ["Rain", "🌧️", "rainy"],
  65: ["Heavy rain", "🌧️", "rainy"],
  71: ["Light snow", "🌨️", "cloudy"],
  73: ["Snow", "❄️", "cloudy"],
  75: ["Heavy snow", "❄️", "cloudy"],
  80: ["Rain showers", "🌧️", "rainy"],
  81: ["Rain showers", "🌧️", "rainy"],
  82: ["Heavy showers", "⛈️", "rainy"],
  95: ["Thunderstorm", "⛈️", "rainy"],
  96: ["Thunderstorm with hail", "⛈️", "rainy"],
  99: ["Thunderstorm with hail", "⛈️", "rainy"]
};

export function getWeatherInfo(code) {
  return codes[code] || ["Variable conditions", "🌡️", "cloudy"];
}

export function toTemperature(celsius, unit) {
  return Math.round(unit === "F" ? celsius * 9 / 5 + 32 : celsius);
}

export function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

export function getOutfit(current, forecast) {
  const temp = current.temperature_2m;
  const code = current.weather_code;
  const rain = Math.max(...forecast.map(day => day.rain));

  if (rain >= 50 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    return {
      title: "Rain-ready essentials",
      icon: "☂️",
      text: "Carry an umbrella and choose water-resistant footwear. Check the forecast before heading out."
    };
  }

  if (temp >= 30) {
    return {
      title: "Keep it light",
      icon: "🕶️",
      text: "Choose breathable cotton, light colours, and sunglasses. Carry water and limit prolonged midday sun exposure."
    };
  }

  if (temp < 15) {
    return {
      title: "Layer up",
      icon: "🧥",
      text: "A jacket or warm layer will help you stay comfortable in cooler conditions."
    };
  }

  return {
    title: "Perfect for everyday plans",
    icon: "👟",
    text: "Comfortable everyday clothing should work well. Keep an extra layer handy if the weather changes."
  };
}
