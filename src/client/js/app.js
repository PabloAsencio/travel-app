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
    const pictureEndpoint = 'pictures';
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const [city, province, country] = document
        .getElementById('city')
        .value.split(',')
        .map((word) => word.trim());

    let weatherQuery = '?';
    if (latitude && longitude) {
        weatherQuery += `latitude=${encodeURIComponent(
            latitude
        )}&longitude=${encodeURIComponent(longitude)}`;
    } else {
        weatherQuery += `city=${
            city ? encodeURIComponent(city) : ''
        }&province=${province ? encodeURIComponent(province) : ''}&country=${
            country ? encodeURIComponent(country) : ''
        }`;
    }

    const currentWeather = fetch(
        server + currentWeatherEndpoint + weatherQuery
    );

    const timeToTrip = document
        .getElementById('time-to-trip')
        .textContent.split(' ')[0];

    const duration = document
        .getElementById('duration')
        .textContent.split(' ')[0];
    weatherQuery += `&timeToTrip=${encodeURIComponent(
        timeToTrip
    )}&duration=${encodeURIComponent(duration)}`;

    const forecast = fetch(server + forecastEndpoint + weatherQuery);

    // TODO: Retrieve country name from server if it is missing before making the API call
    let pictureQuery = `?city=${city}&country=${country || province || ''}`;

    const pictures = fetch(server + pictureEndpoint + pictureQuery);

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
    pictures
        .then((response) => response.json())
        .then((pictures) => console.log(pictures))
        .catch((error) => console.log(error));
}

export { handleSubmit };
