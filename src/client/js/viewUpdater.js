import { dateViewUpdater } from './dateViewUpdater';
import { cityViewUpdater } from './cityViewUpdater';
import { pictureViewUpdater } from './pictureViewUpdater';
import { weatherViewUpdater } from './weatherViewUpdater';

const viewUpdater = (function () {
    let _applicationState;

    function updateNewTrip() {
        const destination = document.getElementById('newTrip__destination');
        const provinceAndCountry = document.getElementById('newTrip__country');
        destination.textContent = _applicationState.city.toUpperCase();
        provinceAndCountry.textContent =
            _applicationState.province +
            ', ' +
            _applicationState.country.toUpperCase();
    }

    // Forwarding commands to dateViewUpdater
    function renderNativeDateInput(id, labelText) {
        dateViewUpdater.renderNativeDateInput(id, labelText);
    }

    function renderFallbackDateInput(id, labelText) {
        dateViewUpdater.renderFallbackDateInput(id, labelText);
    }

    function populateYears(id) {
        dateViewUpdater.populateYears(id);
    }

    function populateDays(id, previousDay) {
        dateViewUpdater.populateDays(id, previousDay);
    }

    function updateDateView() {
        dateViewUpdater.updateDateView();
    }

    function showDateError(id, message) {
        dateViewUpdater.showDateError(id, message);
    }

    function clearDateErrors() {
        dateViewUpdater.clearDateErrors();
    }

    // Forwarding commands to cityViewUpdater
    function createNewCityList() {
        return cityViewUpdater.createNewCityList();
    }

    function setActiveCity(cities, index) {
        cityViewUpdater.setActiveCity(cities, index);
    }

    function clearCityList() {
        cityViewUpdater.clearCityList();
    }

    function showCityError(message) {
        cityViewUpdater.showCityError(message);
    }

    function clearCityError() {
        cityViewUpdater.clearCityError();
    }

    // Forwarding commands to pictureViewUpdater
    function updatePicture(photos) {
        pictureViewUpdater.updatePicture(photos);
    }

    function showPictureError(message) {
        pictureViewUpdater.showPictureError(message);
    }

    // Forwarding commands to weatherViewUpdater
    function updateCurrentWeather(currentWeather) {
        weatherViewUpdater.updateCurrentWeather(currentWeather);
    }

    function updateWeatherForecast(weatherForecast) {
        weatherViewUpdater.updateWeatherForecast(weatherForecast);
    }

    function clearWeatherSection() {
        weatherViewUpdater.clearWeatherSection();
    }

    return {
        set applicationState(applicationState) {
            _applicationState = applicationState;
            dateViewUpdater.applicationState = applicationState;
        },
        updateNewTrip,
        renderNativeDateInput,
        renderFallbackDateInput,
        populateYears,
        populateDays,
        updateDateView,
        showDateError,
        clearDateErrors,
        createNewCityList,
        setActiveCity,
        clearCityList,
        clearCityError,
        showCityError,
        updatePicture,
        showPictureError,
        updateCurrentWeather,
        updateWeatherForecast,
        clearWeatherSection,
    };
})();

export { viewUpdater };
