const API_KEY = "92a338314597621c3c4323ada50956b6";
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const locations = [
    { name: "Boras", country: "se" },
    { name: "Stockholm", country: "se" },
    { name: "Ljung", country: "se" },
    { name: "Tokyo", country: "jp" },
    { name: "London", country: "gb" },
    { name: "New York", country: "us" },
	{ name: "Split", country: "hr" },
	{ name: "Madrid", country: "es" },
    { name: "Reykjavik", country: "is" },
	{ name: "Summit", country: "gro" },
	{ name: "Vostok", country: ".aq" }
	
];

function getWeatherIcon(weatherMain) {
    switch (weatherMain) {
        case "Clear": return "☀️";
        case "Clouds": return "☁️";
        case "Rain": return "🌧️";
        case "Drizzle": return "🌦️";
        case "Thunderstorm": return "⛈️";
        case "Snow": return "❄️";
        case "Fog": return "🌫️";
        default: return "🌡️";
    }
}

async function WeatherData() {
    const container = document.getElementById("weather-container");
    if (!container) return;
    
    container.innerHTML = ""; // Rensa "Laddar..." texten helt

    for (const place of locations) {
        try {
            await sleep(200); 

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place.name},${place.country}&appid=${API_KEY}&units=metric&lang=sv`);

            if (response.status === 429) {
                container.innerHTML += `<p style="color:red; text-align:center;">För många anrop. Vänta en stund...</p>`;
                break; 
            }

            if (!response.ok) throw new Error("Hittade inte staden");

            const data = await response.json();
            const weatherIcon = getWeatherIcon(data.weather[0].main);

            // HÄR ÄR FIXEN: Vi bygger HTML-strukturen så att den matchar din CSS exakt
            container.innerHTML += `
                <div class="weather-card">
                    <div class="city-info">
                        <h2>${data.name}</h2>
                        <p>${weatherIcon} ${data.weather[0].description}</p>
                    </div>
                    
                    <div class="temp-section">
                        <p class="temp-big">${Math.round(data.main.temp)}°C</p>
                        <p class="feels-like">Känns som: ${Math.round(data.main.feels_like)}°C</p>
                    </div>
                </div>
            `;

        } catch (error) {
            console.log("Fel vid hämtning av " + place.name, error);
            container.innerHTML += `
                <div class="weather-card" style="border-left-color: red;">
                    <div class="city-info">
                        <h2>${place.name}</h2>
                        <p style="color:red;">⚠️ Kunde inte hämta data</p>
                    </div>
                </div>
            `;
        }
    }
}

WeatherData();