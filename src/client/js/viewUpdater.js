import logo from '../../assets/images/pixabay-logo.svg';
import dateViewUpdater from './dateViewUpdater';
import cityViewUpdater from './cityViewUpdater';
import pictureViewUpdater from './pictureViewUpdater';
import weatherViewUpdater from './weatherViewUpdater';
console.log(dateViewUpdater);

const viewUpdater = (function () {
    let _applicationState;
    const cityInputElement = document.getElementById('city');

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

    function createNewCityList() {
        const listFragment = document.createDocumentFragment();
        const cityList = document.createElement('DIV');
        cityList.setAttribute('id', 'city-autocomplete-list');
        cityList.classList.add('autocomplete-items');
        listFragment.appendChild(cityList);

        function createListItem(city, length) {
            const listItem = document.createElement('DIV');
            if (!city.error) {
                const completeName = city.completeName;
                const typedText = document.createElement('SPAN');
                typedText.classList.add('typedText');
                typedText.textContent = completeName.substr(0, length);
                listItem.appendChild(typedText);
                const completedText = document.createElement('SPAN');
                completedText.classList.add('completedText');
                completedText.textContent = completeName.substr(length);
                listItem.appendChild(completedText);
            } else {
                listItem.textContent = city.error;
            }

            cityList.appendChild(listItem);

            return listItem;
        }

        function render() {
            cityInputElement.parentNode.appendChild(listFragment);
        }

        return {
            createListItem,
            render,
        };
    }

    function setActiveCity(cities, index) {
        removeActiveCity(cities);
        cities[index].classList.add('autocomplete-active');
    }

    function removeActiveCity(cities) {
        for (const city of cities) {
            city.classList.remove('autocomplete-active');
        }
    }

    function clearCityList() {
        const autocompleteLists = document.getElementsByClassName(
            'autocomplete-items'
        );

        for (let index = 0; index < autocompleteLists.length; index++) {
            autocompleteLists[index].parentNode.removeChild(
                autocompleteLists[index]
            );
        }
    }

    function showCityError(message) {
        const errorContainer = document.getElementById(
            'tripSelection__error--city'
        );
        errorContainer.textContent = message;
    }

    function clearCityError() {
        const errorContainer = document.getElementById(
            'tripSelection__error--city'
        );
        errorContainer.textContent = '';
    }

    function updatePicture(photos) {
        clearPictureError();
        const photo = photos['pictures'][0]; // In the future all pictures should be shown in a carrousel
        console.log(photo.imageURL);
        const noSuffixImageURL = photo.imageURL.substring(
            0,
            photo.imageURL.length - 8
        );
        console.log(noSuffixImageURL);
        const photoContainer = document.getElementById('newTrip__photo');
        const img = photoContainer.getElementsByTagName('IMG')[0];
        const caption = document.getElementById('newTrip__photo--caption');
        img.setAttribute(
            'srcset',
            `${noSuffixImageURL + '_340.jpg'} 340w, ${photo.imageURL} 640w, ${
                photo.largeImageURL
            } 1280w`
        );
        img.setAttribute(
            'sizes',
            '(min-width:1444px) calc(2 * (80vw - 1rem) / 3), 80vw'
        );
        img.setAttribute('src', photo.largeImageURL);
        img.setAttribute('alt', photo.subject);
        img.setAttribute('type', 'image/jpeg');
        caption.innerHTML = `${photo.subject}. Photo by <a href="${photo.userURL}">${photo.user}</a> at <a href="${photo.pageURL}" aria-labelledby="pixabay">${logo}</a>`;
    }

    function showPictureError(message) {
        const error = document.getElementById('newTrip__photo--error');
        error.textContent = message;
    }

    function clearPictureError() {
        const error = document.getElementById('newTrip__photo--error');
        error.textContent = '';
    }

    function updateCurrentWeather(currentWeather) {
        if (currentWeather.error) {
            showErrorMessage(
                currentWeather.error,
                document.getElementById('newTrip__weather--current')
            );
        } else {
            createCurrentWeatherCard(currentWeather);
        }
    }

    function updateWeatherForecast(weatherForecast) {
        if (weatherForecast.error) {
            showErrorMessage(
                weatherForecast.error,
                document.getElementById('newTrip__weather--forecast')
            );
        } else {
            const dailyForecasts = weatherForecast.dailyForecasts;
            for (const day of dailyForecasts) {
                createForecastCard(day);
            }
        }
    }

    function showErrorMessage(errorMessage, weatherSection) {
        const fragment = document.createDocumentFragment();
        const error = document.createElement('P');
        error.textContent = errorMessage;
        fragment.appendChild(error);
        weatherSection.appendChild(fragment);
    }

    function clearWeatherSection() {
        const currentWeatherSection = document.getElementById(
            'newTrip__weather--current'
        );
        const weatherForecastSection = document.getElementById(
            'newTrip__weather--forecast'
        );
        currentWeatherSection.innerHTML = '';
        weatherForecastSection.innerHTML = '';
    }

    function createCurrentWeatherCard(currentWeather) {
        const weatherSection = document.getElementById(
            'newTrip__weather--current'
        );
        const fragment = document.createDocumentFragment();
        const card = document.createElement('ARTICLE');
        card.classList.add('weather__card');
        card.classList.add('weather__card--current');
        const weatherDescription = document.createElement('HEADER');
        weatherDescription.classList.add('weather__header');
        weatherDescription.innerHTML = `
            <div class="weather__descriptionIcon">
                <i class="wi wi-wb-${currentWeather.code}" aria-hidden="true"></i>
            </div>
            <h4 class="weather__description">${currentWeather.description}</h4>`;
        card.appendChild(weatherDescription);
        const temperature = document.createElement('SECTION');
        temperature.classList.add('weather__temperature');
        temperature.innerHTML = `
            <h5>Temperature</h5>
            <div class="weather__temperature--real">
                <h6>Real</h6>
                <p>
                    <span class="weather__temperature--celsius">${
                        currentWeather.temperature
                    }</span>
                    <span class="weather__temperature--fahrenheit" hidden aria-hidden="true">${convertCelsiusToFahrenheit(
                        currentWeather.temperature
                    )}</span>
                    <span><i class="wi wi-celsius" aria-label="degrees Celsius"></i></span> | <span><i class="wi wi-fahrenheit icon--active" aria-label="switch to degrees Fahrenheit"></i></span>
                </p>
            </div>
            <div class="weather__temperature--feels">
                <h6>Feels like</h6>
                <p>
                    <span class="weather__temperature--celsius">${
                        currentWeather.feelsLike
                    }</span>
                    <span class="weather__temperature--fahrenheit" hidden aria-hidden="true">${convertCelsiusToFahrenheit(
                        currentWeather.feelsLike
                    )}</span>
                    <span><i class="wi wi-celsius" aria-label="degrees Celsius"></i></span> | <span><i class="wi wi-fahrenheit icon--active" aria-label="switch to degrees Fahrenheit"></i></span>
                </p>
            </div>
        `;
        card.appendChild(temperature);
        const wind = document.createElement('SECTION');
        wind.classList.add('weather__wind');
        wind.innerHTML = `
            <h5>Wind</h5>
            <div class="weather__windDirection">
                <p>
                    <i class="wi wi-wind from-${
                        currentWeather.windDirectionInDegrees
                    }-deg" aria-label="${
            currentWeather.windDirectionAsText
        }"></i>
                </p>
            </div>
            <div class="weather__windSpeed">
                <p>
                    <span class="weather__windSpeed--kmh">${getSpeedInKmH(
                        currentWeather.windSpeed
                    )} <span aria-label="kilometers per hour">km/h</span></span>
                    <span class="weather__windSpeed--mph" hidden aria-hidden="true">${getSpeedInMPH(
                        currentWeather.windSpeed
                    )} <span aria-label="miles per hour">mph</span></span>
                </p>
            </div>
        `;
        card.appendChild(wind);
        fragment.appendChild(card);
        weatherSection.appendChild(fragment);
        const fahrenheitIcons = document.getElementsByClassName(
            'wi-fahrenheit'
        );
        for (let i = 0; i < fahrenheitIcons.length; i++) {
            fahrenheitIcons[i].addEventListener('click', switchUnits);
        }
    }

    function switchUnits(event) {
        const switchToFahrenheit = event.target.classList.contains(
            'wi-fahrenheit'
        );
        const celsiusIcons = document.getElementsByClassName('wi-celsius');
        const fahrenheitIcons = document.getElementsByClassName(
            'wi-fahrenheit'
        );
        const celsiusTemperatures = document.getElementsByClassName(
            'weather__temperature--celsius'
        );
        const fahrenheitTemperatures = document.getElementsByClassName(
            'weather__temperature--fahrenheit'
        );
        const speedsInKmH = document.getElementsByClassName(
            'weather__windSpeed--kmh'
        );
        const speedsInMPH = document.getElementsByClassName(
            'weather__windSpeed--mph'
        );
        for (let i = 0; i < celsiusTemperatures.length; i++) {
            celsiusTemperatures[i].hidden = switchToFahrenheit;
            celsiusTemperatures[i].setAttribute(
                'aria-hidden',
                switchToFahrenheit
            );
            fahrenheitTemperatures[i].hidden = !switchToFahrenheit;
            fahrenheitTemperatures[i].setAttribute(
                'aria-hidden',
                !switchToFahrenheit
            );
        }
        for (let j = 0; j < speedsInKmH.length; j++) {
            speedsInKmH[j].hidden = switchToFahrenheit;
            speedsInKmH[j].setAttribute('aria-hidden', switchToFahrenheit);
            speedsInMPH[j].hidden = !switchToFahrenheit;
            speedsInMPH[j].setAttribute('aria-hidden', !switchToFahrenheit);
        }
        for (let k = 0; k < celsiusIcons.length; k++) {
            celsiusIcons[k].classList.toggle(
                'icon--active',
                switchToFahrenheit
            );
            celsiusIcons[k].setAttribute(
                'aria-label',
                `${switchToFahrenheit ? 'switch to ' : ''}degrees Celsius`
            );
            fahrenheitIcons[k].classList.toggle(
                'icon--active',
                !switchToFahrenheit
            );
            fahrenheitIcons[k].setAttribute(
                'aria-label',
                `${!switchToFahrenheit ? 'switch to ' : ''}degrees Fahrenheit`
            );
            if (switchToFahrenheit) {
                celsiusIcons[k].addEventListener('click', switchUnits);
                fahrenheitIcons[k].removeEventListener('click', switchUnits);
            } else {
                celsiusIcons[k].removeEventListener('click', switchUnits);
                fahrenheitIcons[k].addEventListener('click', switchUnits);
            }
        }
    }

    function createForecastCard(forecastedWeather) {
        const weatherSection = document.getElementById(
            'newTrip__weather--forecast'
        );
        const date = new Date(forecastedWeather.date);
        const options = {
            month: 'long',
            day: 'numeric',
        };
        if (date.getFullYear() != new Date().getFullYear()) {
            options.year = 'numeric';
        }
        const fragment = document.createDocumentFragment();
        const card = document.createElement('ARTICLE');
        card.classList.add('weather__card');
        card.classList.add('weather__card--forecast');
        const weatherDescription = document.createElement('HEADER');
        weatherDescription.classList.add('weather__header');
        weatherDescription.innerHTML = `
            <div class="weather__descriptionIcon">
                <i class="wi wi-wb-${
                    forecastedWeather.code
                }" aria-hidden="true"></i>
            </div>
            <h4 class="weather__description">${
                forecastedWeather.description
            }</h4>
            <p>${date.toLocaleDateString('en-US', options)}</p>`;
        card.appendChild(weatherDescription);
        const temperature = document.createElement('SECTION');
        temperature.classList.add('weather__temperature');
        temperature.innerHTML = `
            <h5>Temperature</h5>
            <div class="weather__temperature--real">
                <h6>Low</h6>
                <p>
                    <span class="weather__temperature--celsius">${
                        forecastedWeather.minTemperature
                    }</span>
                    <span class="weather__temperature--fahrenheit" hidden aria-hidden="true">${convertCelsiusToFahrenheit(
                        forecastedWeather.minTemperature
                    )}</span>
                    <span><i class="wi wi-celsius" aria-label="degrees Celsius"></i></span> | <span><i class="wi wi-fahrenheit icon--active" aria-label="switch to degrees Fahrenheit"></i></span>
                </p>
            </div>
            <div class="weather__temperature--feels">
                <h6>High</h6>
                <p>
                    <span class="weather__temperature--celsius">${
                        forecastedWeather.maxTemperature
                    }</span>
                    <span class="weather__temperature--fahrenheit" hidden aria-hidden="true">${convertCelsiusToFahrenheit(
                        forecastedWeather.maxTemperature
                    )}</span>
                    <span><i class="wi wi-celsius" aria-label="degrees Celsius"></i></span> | <span><i class="wi wi-fahrenheit icon--active" aria-label="switch to degrees Fahrenheit"></i></span>
                </p>
            </div>
        `;
        card.appendChild(temperature);
        const wind = document.createElement('SECTION');
        wind.classList.add('weather__wind');
        wind.innerHTML = `
            <h5>Wind</h5>
            <div class="weather__windDirection">
                <p>
                    <i class="wi wi-wind from-${
                        forecastedWeather.windDirectionInDegrees
                    }-deg" aria-label="${
            forecastedWeather.windDirectionAsText
        }"></i>
                </p>
            </div>
            <div class="weather__windSpeed">
                <p>
                    <span class="weather__windSpeed--kmh">${getSpeedInKmH(
                        forecastedWeather.windSpeed
                    )} <span aria-label="kilometers per hour">km/h</span></span>
                    <span class="weather__windSpeed--mph" hidden aria-hidden="true">${getSpeedInMPH(
                        forecastedWeather.windSpeed
                    )} <span aria-label="miles per hour">mph</span></span>
                </p>
            </div>
        `;
        card.appendChild(wind);
        fragment.appendChild(card);
        weatherSection.appendChild(fragment);
        const fahrenheitIcons = document.getElementsByClassName(
            'wi-fahrenheit'
        );
        for (let i = 0; i < fahrenheitIcons.length; i++) {
            fahrenheitIcons[i].addEventListener('click', switchUnits);
        }
    }

    function updateNewTrip() {
        const destination = document.getElementById('newTrip__destination');
        const provinceAndCountry = document.getElementById('newTrip__country');
        destination.textContent = _applicationState.city.toUpperCase();
        provinceAndCountry.textContent =
            _applicationState.province +
            ', ' +
            _applicationState.country.toUpperCase();
    }

    function convertCelsiusToFahrenheit(celsius) {
        return Math.round((celsius * 9) / 5 + 32);
    }

    function getSpeedInKmH(speed) {
        return Math.round(speed * 3.6);
    }

    function getSpeedInMPH(speed) {
        const metersPerMile = 1609.34;
        return Math.round((speed * 3600) / metersPerMile);
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
