import airplane from '../../assets/images/airplane.svg';
import calendar from '../../assets/images/calendar.svg';
import { pictureViewUpdater } from './pictureViewUpdater';
import { weatherViewUpdater } from './weatherViewUpdater';

const newTripViewUpdater = (function () {
    let hasNewTripSection = false;
    // Necessary to make scrolling compatible with old browsers
    // See https://stackoverflow.com/questions/57354064/browser-native-scroll-function-how-to-check-compatibility
    const isSmoothScrollSupported =
        'scrollBehavior' in document.documentElement.style;

    function updateNewTrip(newTripData) {
        if (hasNewTripSection) {
            weatherViewUpdater.clearWeatherSection();
        } else {
            populateNewTripSection();
            hasNewTripSection = true;
        }
        updateHeader(newTripData.destination);
        updateTimeElement(newTripData.time);
        pictureViewUpdater.updatePicture(newTripData.pictures);
        weatherViewUpdater.updateCurrentWeather(newTripData.currentWeather);
        weatherViewUpdater.updateWeatherForecast(newTripData.weatherForecast);
        scrollToNewTrip();
    }

    function populateNewTripSection() {
        document.getElementById('newTrip').innerHTML = `
        <header class="newTrip__header">
            <h2>Your new trip</h2>
        </header>
        <article class="trip">
            <header class="trip__header">
                <h3
                    class="trip__header--destination"
                    id="newTrip__destination"
                >
                    Destination
                </h3>
                <p
                    class="trip__header--country"
                    id="newTrip__country"
                >
                    Province, COUNTRY
                </p>
            </header>
            <div class="photo" id="newTrip__photo">
                <p
                    class="photo__error error"
                    id="newTrip__photo--error"
                ></p>
                <figure class="photo__figure">
                    <img class="photo__img" src="" alt="" />
                    <figcaption
                        class="photo__caption"
                        id="newTrip__photo--caption"
                    ></figcaption>
                </figure>
            </div>
            <section class="time">
                <div
                    class="time__icon time__icon--calendar"
                    aria-hidden="true"
                ></div>
                <p class="time__daysToTrip">
                    Your trip is
                    <span id="newTrip__daysToTrip">in 0 days</span>
                </p>
                <p class="time__date time__date--start">
                    <span class="time__label">From: </span
                    ><span id="newTrip__startDate"></span>
                </p>
                <p class="time__date time__date--end">
                    <span class="time__label">To: </span
                    ><span id="newTrip__endDate"></span>
                </p>
                <p class="time__duration">
                    <span class="time__label"
                        >Duration of the trip:</span
                    >
                    <span id="newTrip__duration">1 day</span>
                </p>
                <div
                    class="time__icon--airplane time__icon"
                    aria-hidden="true"
                ></div>
            </section>
            <section
                id="newTrip__weather--current"
                class="weather weather--current"
            ></section>
            <section
                id="newTrip__weather--forecast"
                class="weather weather--forecast"
            ></section>
            </article>
            <button class="newTrip__button">Start over!</button>`;

        const button = document.querySelector('.newTrip__button');
        button.addEventListener('click', () => {
            const title = document.querySelector('h1');
            const rectangle = title.getBoundingClientRect();
            const scrollOptions = {
                left: 0,
                top: rectangle.y,
                behavior: 'smooth',
            };
            if (isSmoothScrollSupported) {
                window.scrollBy(scrollOptions);
            } else {
                window.scroll(0, scrollOptions.top + window.scrollY);
            }
        });
    }

    function clearNewTrip() {
        document.getElementById('newTrip').innerHTML = '';
    }

    function scrollToNewTrip() {
        const newTrip = document.getElementById('newTrip');
        const rectangle = newTrip.getBoundingClientRect();
        const scrollOptions = {
            left: 0,
            top: rectangle.y,
            behavior: 'smooth',
        };
        if (isSmoothScrollSupported) {
            window.scrollBy(scrollOptions);
        } else {
            window.scroll(0, scrollOptions.top + window.scrollY);
        }
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

    return {
        populateNewTripSection,
        clearNewTrip,
        updateNewTrip,
    };
})();

export { newTripViewUpdater };
