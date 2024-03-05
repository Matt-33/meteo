const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');

// coordonnées de l'utilisateur
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather);
    } else {
        weatherInfo.innerHTML = '<p>La géolocalisation n\'est pas supportée par ce navigateur.</p>';
    }
}


function showWeather(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b6d001f00f8a9b9d91c33f6c12b50173`;

    axios.get(URL)
        .then((response) => {
            const weatherData = response.data;
            const cityName = weatherData.name;
            const temperature = (weatherData.main.temp - 273.15).toFixed(2); 

            weatherInfo.innerHTML = `
                <h2>Météo de votre ville</h2>
                <p>Ville: ${cityName}</p>
                <p>Température actuelle: ${temperature} °C</p>
            `;

            //localStorage
            const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
            history.push({ city: cityName, temperature: temperature });
            localStorage.setItem('weatherHistory', JSON.stringify(history));
        })
        .catch((error) => {
            console.log(error);
            weatherInfo.innerHTML = '<p>Erreur lors de la récupération des données météorologiques</p>';
        });
}
//formulaire meteo
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value;
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b6d001f00f8a9b9d91c33f6c12b50173`;

    axios.get(URL)
        .then((response) => {
            const weatherData = response.data;
            const cityName = weatherData.name;
            const temperature = (weatherData.main.temp - 273.15).toFixed(2);
            const minTemperature = (weatherData.main.temp_min - 273.15).toFixed(2);
            const maxTemperature = (weatherData.main.temp_max - 273.15).toFixed(2);

            weatherInfo.innerHTML = `
                <h2>${cityName}</h2>
                <p>Température actuelle: ${temperature} °C</p>
                <p>Température minimale: ${minTemperature} °C</p>
                <p>Température maximale: ${maxTemperature} °C</p>
            `;
        })
        .catch((error) => {
            console.log(error);
            weatherInfo.innerHTML = '<p>Erreur lors de la récupération des données météorologiques</p>';
        });
});

getUserLocation();