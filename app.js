// OpenWeatherMap API
const API_KEY = "e56942d4971ca7178c636d79cad1a4a8";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherDisplay = document.getElementById("weather-display");


// Search button click
searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if(city === ""){
        alert("Please enter a city name");
        return;
    }

    getWeather(city);

});


// Press ENTER to search
cityInput.addEventListener("keypress", (e) => {

    if(e.key === "Enter"){

        const city = cityInput.value.trim();

        if(city === ""){
            alert("Please enter a city name");
            return;
        }

        getWeather(city);
    }

});


// Fetch current weather
function getWeather(city){

    weatherDisplay.innerHTML = `<p class="loading">Loading weather data...</p>`;

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    axios.get(url)

    .then((response)=>{

        const data = response.data;

        displayWeather(data);

    })

    .catch((error)=>{

        weatherDisplay.innerHTML = `
        <p class="loading">❌ City not found. Try again.</p>
        `;

        console.error(error);

    });

}



// Display current weather
function displayWeather(data){

    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `

        <div class="weather-info">

            <h2 class="city-name">${cityName}</h2>

            <img src="${iconUrl}" alt="${description}" class="weather-icon">

            <div class="temperature">${temperature}°C</div>

            <p class="description">${description}</p>

            <div class="extra-info">
                <p>💧 Humidity: ${data.main.humidity}%</p>
                <p>🌬 Wind: ${data.wind.speed} m/s</p>
            </div>

        </div>

    `;

    weatherDisplay.innerHTML = weatherHTML;

    // Call OOP Forecast
    const forecast = new WeatherForecast(cityName);
    forecast.getForecast();

}



// ------------------------------
// PART 3 - OOP WEATHER FORECAST
// ------------------------------

class WeatherForecast{

    constructor(city){
        this.city = city;
    }


    async getForecast(){

        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=${API_KEY}&units=metric`;

        try{

            const response = await axios.get(forecastURL);

            this.displayForecast(response.data);

        }

        catch(error){

            console.error("Forecast Error:", error);

        }

    }



    displayForecast(data){

        const forecastContainer = document.createElement("div");

        forecastContainer.classList.add("forecast-container");


        // First 5 forecast items
        const forecasts = data.list.slice(0,5);


        forecasts.forEach(item => {

            const temp = Math.round(item.main.temp);

            const time = item.dt_txt.split(" ")[1].slice(0,5);

            const icon = item.weather[0].icon;

            const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;


            const forecastHTML = `

                <div class="forecast-item">

                    <p class="forecast-time">${time}</p>

                    <img src="${iconUrl}" class="forecast-icon">

                    <p class="forecast-temp">${temp}°C</p>

                </div>

            `;

            forecastContainer.innerHTML += forecastHTML;

        });


        weatherDisplay.appendChild(forecastContainer);

    }

}