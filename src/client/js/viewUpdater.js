import airplane from '../../assets/images/airplane.svg';
import calendar from '../../assets/images/calendar.svg';
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
        updateTimeElement();
    }

    function updateTimeElement() {
        const startDate = new Date(_applicationState.startDate);
        const endDate = new Date(_applicationState.endDate);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        document.getElementById(
            'newTrip__startDate'
        ).textContent = startDate.toLocaleDateString('en-US', options);
        document.getElementById(
            'newTrip__endDate'
        ).textContent = endDate.toLocaleDateString('en-US', options);
        document.getElementById('newTrip__daysToTrip').textContent =
            _applicationState.daysToTrip == 0
                ? 'today! Get Ready!'
                : 'in ' +
                  _applicationState.daysToTrip +
                  ' day' +
                  (_applicationState.daysToTrip != 1 ? 's' : '');
        document.getElementById('newTrip__duration').textContent =
            _applicationState.duration +
            ' day' +
            (_applicationState.duration != 1 ? 's' : '');
        document.querySelector('.time__icon--calendar').innerHTML = calendar;
        document.querySelector('.time__icon--airplane').innerHTML = airplane;
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
