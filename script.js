const API_KEY = 'p2dllaxf32czmhhp1zm46zif403qoz1l1kwr0y52';
const BASE_URL = 'https://www.meteosource.com/api/v1/free/point';
const weatherInfo = document.getElementById('weather-info');
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const loadingSpinner = document.createElement('div');
loadingSpinner.id = 'loading-spinner';
document.body.appendChild(loadingSpinner);


// Weather condition to emoji and background mapping
const weatherDetails = {
    clear: { emoji: '☀️', background: 'https://www.thecalifornian.com/gcdn/-mm-/e5c305e00d80354d1c0350948b3ccc39c5d4956e/c=0-202-3867-2377/local/-/media/Salinas/2015/02/24/B9316371807Z.1_20150224104851_000_GAOA20QVE.1-0.jpg?width=660&height=372&fit=crop&format=pjpg&auto=webp' },
    cloudy: { emoji: '☁️', background: 'https://i.pinimg.com/736x/c0/73/ec/c073ec7e37dd8cf6413f60b3d87a4f8d.jpg' },
    sunny: { emoji: '🌤️', background: 'https://i.pinimg.com/736x/c0/73/ec/c073ec7e37dd8cf6413f60b3d87a4f8d.jpg' },
    rain: { emoji: '🌧️', background: 'https://i.pinimg.com/originals/c8/ec/9d/c8ec9dc498a83d1770b1437e36ba4bf5.gif' },
    snow: { emoji: '❄️', background: 'https://i.pinimg.com/originals/5d/0f/63/5d0f6387aa4f4955bca43823f4ffac0d.gif' },
    overcast: { emoji: '🌤️', background: 'https://i.pinimg.com/736x/bd/71/43/bd7143fdbb6aa1853c906f83d0b777c9.jpg' },
    storm: { emoji: '⛈️', background: 'https://i.pinimg.com/originals/73/94/32/739432d532bf90abdadbeea579abc21b.gif' },
    drizzle: { emoji: '🌦️', background: 'https://i.pinimg.com/originals/25/46/af/2546afa4b8f881bf1ab91d1554aa496f.gif' },
    fog: { emoji: '🌫️', background: 'https://i.pinimg.com/736x/40/f8/52/40f852c6ff3d73eb6f8a57b4beac86c4.jpg' },
    "partly clear": { emoji: '🌤️', background: 'https://www.thecalifornian.com/gcdn/-mm-/e5c305e00d80354d1c0350948b3ccc39c5d4956e/c=0-202-3867-2377/local/-/media/Salinas/2015/02/24/B9316371807Z.1_20150224104851_000_GAOA20QVE.1-0.jpg?width=660&height=372&fit=crop&format=pjpg&auto=webp' },
    "mostly cloudy": { emoji: '⛅', background: 'https://i.pinimg.com/736x/4d/7c/c0/4d7cc07b1f5daf2767bb6054bbe8c0f9.jpg' },
    "mostly cloudy": { emoji: '⛅', background: 'https://i.pinimg.com/736x/4d/7c/c0/4d7cc07b1f5daf2767bb6054bbe8c0f9.jpg' },
};

async function fetchWeatherData(city) {
    const url = `${BASE_URL}?place_id=${city}&sections=all&timezone=UTC&language=en&units=metric&key=${API_KEY}`;
    try {
        showLoading(true);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const { current } = data;

        // Determine weather condition
        const condition = current.icon?.toLowerCase() || 'clear';
        const details = 
            weatherDetails[condition] || 
            (condition.includes('partly') ? weatherDetails['partly clear'] : 
            condition.includes('mostly') ? weatherDetails['mostly cloudy'] : 
            { emoji: '🌤️', background: 'default-weather.jpg' });

        updateBackground(details.background);
        displayWeather(city, current, details.emoji);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherInfo.innerHTML = `<p style="color: red;">Unable to fetch weather data. Please try again.</p>`;
    } finally {
        showLoading(false);
    }
}

// Update background based on weather
function updateBackground(image) {
    document.body.style.background = `url('${image}') no-repeat center center fixed`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.transition = 'background 1.5s ease'; // Smooth transition
}

// Display weather information
function displayWeather(city, current, emoji) {
    weatherInfo.innerHTML = `
        <h2>${emoji} Weather in ${capitalize(city)}</h2>
        <p><strong>Temperature:</strong> ${current.temperature} °C</p>
        <p><strong>Condition:</strong> ${current.summary} ${emoji}</p>
        <p><strong>Wind Speed:</strong> ${current.wind.speed} km/h</p>
        <p><strong>Humidity:</strong> ${current.humidity}%</p>
    `;
}

// Show or hide loading spinner
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
}

// Capitalize city name
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Handle form submission
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = cityInput.value.trim().toLowerCase();
    if (city) {
        fetchWeatherData(city);
    } else {
        weatherInfo.innerHTML = `<p style="color: red;">Please enter a city name.</p>`;
    }
});



