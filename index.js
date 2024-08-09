const cityInput = document.querySelector("#input");
const searchButton = document.querySelector("#search");
const locationButton = document.querySelector("#loc_btn");
const currentWeatherDiv = document.querySelector(".data");
const p1 = document.querySelector(".p1");
const p2 = document.querySelector(".p2");

const API_KEY = "f84d0bd770678bdfa337686675a96058";

const createWeatherCard = (cityName, weatherItem) => {
    console.log(weatherItem.weather[0].main.toLowerCase());
    return `<div class="details">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h5>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h5>
                <h5>Wind: ${weatherItem.wind.speed} M/S</h5>
                <h5>Humidity: ${weatherItem.main.humidity}%</h5>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <h6>${weatherItem.weather[0].description}</h6>
            </div>`
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        
        const one = fiveDaysForecast[0];

        cityInput.value = "";
        p1.style.display = "none";
        p2.style.display = "block";

        const html = createWeatherCard(cityName, one);
        currentWeatherDiv.insertAdjacentHTML("beforeend", html);
         
    }).catch(() => {
        alert("An error occurred while fetching weather forecast");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching coordinates");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name.");
            });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation permission request denied.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

const reset = document.querySelector("#reset");

const re = () => {
    window.location.reload()
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
reset.addEventListener("click", re);