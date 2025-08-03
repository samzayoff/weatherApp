const apiKey = "72486fa88fe0e0fbdc800da0a51f9c80";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

async function checkWeather(city) {
    try {
        // Show loading state
        document.querySelector(".weather").style.display = "none";
        document.querySelector('.error-message').style.display = 'none';
        document.querySelector(".search button").disabled = true;
        
        const response = await fetch(`${apiUrl}${encodeURIComponent(city)}&appid=${apiKey}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch weather data');
        }
        
        const data = await response.json();
        console.log("API Response:", data);

        // Update weather information
        document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
        document.querySelector(".city").textContent = data.name;
        document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
        document.querySelector(".wind").textContent = `${data.wind.speed} km/h`;
        
        // Update weather icon
        const weatherIcon = document.querySelector(".weather-icon");
        const weatherConditions = {
            Clouds: "clouds",
            Clear: "clear",
            Rain: "rain", 
            Snow: "snow",
            Thunderstorm: "thunderstorm",
            Drizzle: "drizzle",
            Mist: "mist",
            Fog: "mist",
            Haze: "mist"
        };
        const weatherType = weatherConditions[data.weather[0].main] || "clear";
        weatherIcon.src = `./images/${weatherType}.png`;
        weatherIcon.alt = data.weather[0].main;
        
        // Show weather data
        document.querySelector(".weather").style.display = "block";
        
    } catch (error) {
        console.error('Fetch Error:', error);
        const errorElement = document.querySelector('.error-message');
        errorElement.textContent = error.message.includes('404') 
            ? '🌍 City not found. Try another location.'
            : '⚠️ ' + error.message;
        errorElement.style.display = 'block';
    } finally {
        document.querySelector(".search button").disabled = false;
    }
}

// Event listeners
document.querySelector(".search button").addEventListener("click", searchWeather);
document.querySelector(".search input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchWeather();
});

function searchWeather() {
    const city = document.querySelector(".search input").value.trim();
    if (city) {
        checkWeather(city);
    } else {
        document.querySelector('.error-message').textContent = 'Please enter a city name';
        document.querySelector('.error-message').style.display = 'block';
    }
}

// Initialize with default city
checkWeather("Peshawar");