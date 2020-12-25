import { createDateController } from './dateController';
import { createViewUpdater } from './uiUpdater';
import { createAPIService } from './apiService';
import { cityDropdownListController } from './autocomplete';
import { applicationState } from './appState';

let viewUpdater;
let apiService;
let dateController;

function startApplication(applicationState) {
    viewUpdater = createViewUpdater(applicationState);
    apiService = createAPIService();
    dateController = createDateController(applicationState, viewUpdater);
    dateController.start();
    // Set functionality and event listener for the dropdown list
    cityDropdownListController.apiService = apiService;
    cityDropdownListController.appState = applicationState;
    cityDropdownListController.viewUpdater = viewUpdater;
    cityDropdownListController.start();
}

async function handleSubmit(event) {
    event.preventDefault();

    if (
        dateController.areDatesValid() &&
        (cityDropdownListController.isValidCity() ||
            (await cityDropdownListController.fetchCity()))
    ) {
        const currentWeather = apiService.fetchCurrentWeather(
            applicationState.latitude,
            applicationState.longitude
        );
        console.log(applicationState.daysToTrip);
        console.log(applicationState.duration);
        const forecast = apiService.fetchWeatherForecast(
            applicationState.latitude,
            applicationState.longitude,
            applicationState.daysToTrip.toString(10),
            applicationState.duration.toString(10)
        );
        const pictures = apiService.fetchPictures(
            applicationState.city,
            applicationState.country
        );

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
    } else {
        console.log('Something went wrong!');
    }
}

export { handleSubmit, startApplication };
