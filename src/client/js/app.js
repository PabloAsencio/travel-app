import {
    updateCurrentWeather,
    updateWeatherForecast,
    clearWeatherSection,
} from './uiUpdater';

function handleSubmit(event) {
    event.preventDefault();
    // TODO: Remove references to localhost from final versio
    const server = 'http://localhost:8082/';
    const currentWeatherEndpoint = 'currentWeather';
    const forecastEndpoint = 'forecast';
    let query = '?';
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (latitude && longitude) {
        query += `latitude=${encodeURIComponent(
            latitude
        )}&longitude=${encodeURIComponent(longitude)}`;
    } else {
        const [city, province, country] = document
            .getElementById('city')
            .value.split(',')
            .map((word) => word.trim());
        query += `city=${city ? encodeURIComponent(city) : ''}&province=${
            province ? encodeURIComponent(province) : ''
        }&country=${country ? encodeURIComponent(country) : ''}`;
    }

    const currentWeather = fetch(server + currentWeatherEndpoint + query);

    const timeToTrip = document
        .getElementById('time-to-trip')
        .textContent.split(' ')[0];

    const duration = document
        .getElementById('duration')
        .textContent.split(' ')[0];
    query += `&timeToTrip=${encodeURIComponent(
        timeToTrip
    )}&duration=${encodeURIComponent(duration)}`;

    const forecast = fetch(server + forecastEndpoint + query);

    clearWeatherSection();

    // TODO: Show some informative error message in the UI instead of logging it
    currentWeather
        .then((response) => response.json())
        .then((weather) => updateCurrentWeather(weather))
        .catch((error) => console.log(error));
    forecast
        .then((response) => response.json())
        .then((forecast) => updateWeatherForecast(forecast))
        .catch((error) => console.log(error));
}

export { handleSubmit };
