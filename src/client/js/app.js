import { createDateController } from './dateController';
import { createViewUpdater } from './uiUpdater';
import { createAPIService } from './apiService';
import { autocomplete } from './autocomplete';

let viewUpdater;
let apiService;

function startApplication(applicationState) {
    viewUpdater = createViewUpdater(applicationState);
    apiService = createAPIService();
    createDateController(applicationState, viewUpdater).start();
    // Set functionality and event listener for the dropdown list
    autocomplete(document.getElementById('city'), apiService);
}

function handleSubmit(event) {
    event.preventDefault();
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const [city, province, country] = document
        .getElementById('city')
        .value.split(',')
        .map((word) => word.trim());

    const timeToTrip = document
        .getElementById('daysToTrip')
        .textContent.split(' ')[0];

    const duration = document
        .getElementById('duration')
        .textContent.split(' ')[0];

    const currentWeather = apiService.fetchCurrentWeather(latitude, longitude);
    const forecast = apiService.fetchWeatherForecast(
        latitude,
        longitude,
        timeToTrip,
        duration
    );
    // TODO: Retrieve country name from server if it is missing before making the API call
    const pictures = apiService.fetchPictures(city, country);

    viewUpdater.clearWeatherSection();

    // TODO: Show some informative error message in the UI instead of logging it
    currentWeather
        .then((response) => response.json())
        .then((weather) => viewUpdater.updateCurrentWeather(weather))
        .catch((error) => console.log(error.message));
    forecast
        .then((response) => response.json())
        .then((forecast) => viewUpdater.updateWeatherForecast(forecast))
        .catch((error) => console.log(error.message));
    pictures
        .then((response) => response.json())
        .then((pictures) => viewUpdater.updatePicture(pictures))
        .catch((error) => console.log(error.message));
}

export { handleSubmit, startApplication };
