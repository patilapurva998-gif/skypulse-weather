
import {
  getWeatherInfo,
  toTemperature,
  formatDate,
  getOutfit
} from "./weatherUtils.js";

export function renderHero(data, unit) {
  const current = data.current;
  const [description, icon, theme] = getWeatherInfo(current.weather_code);
  const temp = toTemperature(current.temperature_2m, unit);

  return `
    <div class="hero-copy">
      <p class="eyebrow">CURRENT CONDITIONS</p>
      <h2>${escapeHTML(data.city)}, ${escapeHTML(data.country || "")}</h2>
      <p class="hero-date">${new Date().toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric"
      })}</p>
      <div class="hero-temp">${temp}<span>°${unit}</span></div>
      <p class="hero-condition">${description}</p>
      <p class="feels-like">Feels like ${toTemperature(current.apparent_temperature, unit)}°${unit}</p>
    </div>
    <div class="hero-art ${theme}">
      <span class="hero-weather-icon">${icon}</span>
      <span class="orbit orbit-one"></span>
      <span class="orbit orbit-two"></span>
    </div>
  `;
}

export function renderDetails(current, unit) {
  const feels = toTemperature(current.apparent_temperature, unit);

  const details = [
    { icon: "🌡️", label: "Feels like", value: `${feels}°${unit}` },
    { icon: "💧", label: "Humidity", value: `${current.relative_humidity_2m}%` },
    { icon: "💨", label: "Wind speed", value: `${current.wind_speed_10m} km/h` }
  ];

  return details.map(item => `
    <div class="detail-card">
      <span class="detail-icon">${item.icon}</span>
      <p>${item.label}</p>
      <h3>${item.value}</h3>
    </div>
  `).join("");
}

export function renderForecast(forecast, unit) {
  return forecast.map((day, index) => {
    const [description, icon] = getWeatherInfo(day.code);

    return `
      <div class="forecast-card">
        <p class="forecast-day">${index === 0 ? "Today" : formatDate(day.date)}</p>
        <span class="forecast-icon">${icon}</span>
        <p class="forecast-condition">${description}</p>
        <div class="forecast-temperatures">
          <strong>${toTemperature(day.max, unit)}°</strong>
          <span>${toTemperature(day.min, unit)}°</span>
        </div>
        <div class="rain-chance">
          <span>💧</span> ${day.rain}% chance of rain
        </div>
      </div>
    `;
  }).join("");
}

export function renderLifestyle(current, forecast) {
  const outfit = getOutfit(current, forecast);

  return `
    <div class="outfit-icon">${outfit.icon}</div>
    <div class="outfit-copy">
      <p class="eyebrow">WEATHER-BASED TIP</p>
      <h3>${outfit.title}</h3>
      <p>${outfit.text}</p>
    </div>
    <span class="tip-sparkle">✦</span>
  `;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}
