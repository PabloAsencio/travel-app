import airplane from '../../assets/images/airplane.svg';
import calendar from '../../assets/images/calendar.svg';
import { pictureViewUpdater } from './pictureViewUpdater';
import { weatherViewUpdater } from './weatherViewUpdater';

const viewUpdater = (function () {
    function updateNewTrip(newTripData) {
        weatherViewUpdater.clearWeatherSection();
        updateHeader(newTripData.destination);
        updateTimeElement(newTripData.time);
        updatePicture(newTripData.pictures);
        weatherViewUpdater.updateCurrentWeather(newTripData.currentWeather);
        weatherViewUpdater.updateWeatherForecast(newTripData.weatherForecast);
    }

    function updateHeader(destinationData) {
        const destination = document.getElementById('newTrip__destination');
        const provinceAndCountry = document.getElementById('newTrip__country');
        destination.textContent = destinationData.city.toUpperCase();
        provinceAndCountry.textContent =
            destinationData.province +
            ', ' +
            destinationData.country.toUpperCase();
    }

    function updateTimeElement(time) {
        const startDate = new Date(time.startDate);
        const endDate = new Date(time.endDate);
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
            time.daysToTrip == 0
                ? 'today! Get Ready!'
                : 'in ' +
                  time.daysToTrip +
                  ' day' +
                  (time.daysToTrip != 1 ? 's' : '');
        document.getElementById('newTrip__duration').textContent =
            time.duration + ' day' + (time.duration != 1 ? 's' : '');
        document.querySelector('.time__icon--calendar').innerHTML = calendar;
        document.querySelector('.time__icon--airplane').innerHTML = airplane;
    }

    function updatePicture(pictures) {
        if (pictures.error) {
            pictureViewUpdater.showPictureError(pictures.error);
        } else {
            pictureViewUpdater.updatePicture(pictures);
        }
    }

    return {
        updateNewTrip,
    };
})();

export { viewUpdater };
