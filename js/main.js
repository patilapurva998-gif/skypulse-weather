
import { fetchWeather } from "./api.js";

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const weatherContainer = document.getElementById("weatherContainer");
const heroWeather = document.getElementById("heroWeather");
const detailsGrid = document.getElementById("detailsGrid");
const forecastGrid = document.getElementById("forecastGrid");

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();
    if (!city) return;

    loading.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    weatherContainer.classList.add("hidden");
    searchButton.disabled = true;

    try {
        const weather = await fetchWeather(city);
        renderWeather(weather);
        weatherContainer.classList.remove("hidden");
    } catch (error) {
        errorMessage.textContent = error.message || "Something went wrong.";
        errorMessage.classList.remove("hidden");
        console.error(error);
    } finally {
        loading.classList.add("hidden");
        searchButton.disabled = false;
    }
});

function renderWeather(weather) {
    const current = weather.current;

    heroWeather.innerHTML = `
        <p class="eyebrow">${weather.city}, ${weather.country}</p>
        <h2>${getWeatherDescription(current.weather_code)}</h2>
        <div style="font-size:64px;font-weight:700">
            ${Math.round(current.temperature_2m)}°C
        </div>
        <p>Feels like ${Math.round(current.apparent_temperature)}°C</p>
    `;

    detailsGrid.innerHTML = `
        <article class="detail-card">
            <p>Humidity</p>
            <h3>${current.relative_humidity_2m}%</h3>
        </article>
        <article class="detail-card">
            <p>Wind speed</p>
            <h3>${current.wind_speed_10m} km/h</h3>
        </article>
        <article class="detail-card">
            <p>Feels like</p>
            <h3>${Math.round(current.apparent_temperature)}°C</h3>
        </article>
        <article class="detail-card">
            <p>Temperature</p>
            <h3>${Math.round(current.temperature_2m)}°C</h3>
        </article>
    `;

    forecastGrid.innerHTML = weather.forecast.map(day => `
        <article class="forecast-card">
            <p>${formatDate(day.date)}</p>
            <h3>${getWeatherDescription(day.code)}</h3>
            <p>High ${Math.round(day.max)}° · Low ${Math.round(day.min)}°</p>
            <p>Rain chance: ${day.rain ?? 0}%</p>
        </article>
    `).join("");
}

function getWeatherDescription(code) {
    if (code === 0) return "Clear sky ☀️";
    if ([1, 2].includes(code)) return "Partly cloudy ⛅";
    if (code === 3) return "Overcast ☁️";
    if ([45, 48].includes(code)) return "Foggy 🌫️";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle 🌦️";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy 🌧️";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy ❄️";
    if ([95, 96, 99].includes(code)) return "Thunderstorm ⛈️";
    return "Weather update";
}

function formatDate(date) {
    return new Date(date + "T12:00:00").toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short"
    });
}
