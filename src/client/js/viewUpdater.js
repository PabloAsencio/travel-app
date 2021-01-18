import logo from '../../assets/images/pixabay-logo.svg';

const viewUpdater = (function () {
    let _applicationState;
    const cityInputElement = document.getElementById('city');

    function renderNativeDateInput(id, labelText) {
        const container = document.getElementById(
            'tripSelection__container--' + id
        );
        const fragment = document.createDocumentFragment();
        const label = document.createElement('LABEL');
        label.setAttribute('for', 'tripSelection__' + id);
        label.textContent = labelText;
        fragment.appendChild(label);
        const input = document.createElement('INPUT');
        input.type = 'date';
        input.id = 'tripSelection__' + id;
        fragment.appendChild(input);
        container.appendChild(fragment);
    }

    // This fallback date input is based on
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date#Handling_browser_support
    function renderFallbackDateInput(id, labelText) {
        const container = document.getElementById(
            'tripSelection__container--' + id
        );
        const fragment = document.createDocumentFragment();
        const label = document.createElement('P');
        label.textContent = labelText;
        fragment.appendChild(label);
        const fallBackDateInput = document.createElement('DIV');
        fallBackDateInput.id = 'tripSelection__' + id;
        fallBackDateInput.classList.add('form__date--fallback');
        fallBackDateInput.innerHTML = `
          <span class="form__select">
            <label for="tripSelection__${id}--day">Day:</label>
            <select id="tripSelection__${id}--day"" name="tripSelection__${id}--day"">
            </select>
          </span>
          <span class="form__select">
            <label for="tripSelection__${id}--month">Month:</label>
            <select id="tripSelection__${id}--month" name="tripSelection__${id}--month">
              <option value="01" selected>January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </span>
          <span class="form__select">
            <label for="tripSelection__${id}--year">Year:</label>
            <select id="tripSelection__${id}--year" name="tripSelection__${id}--year">
            </select>
          </span>`;

        fragment.appendChild(fallBackDateInput);
        container.appendChild(fragment);
    }

    function populateYears(id) {
        const yearSelect = document.getElementById(
            `tripSelection__${id}--year`
        );
        const date = new Date();
        const year = date.getFullYear();
        const fragment = document.createDocumentFragment();

        // Make this year, and the 4 years after it available in the year <select>
        for (let offset = 0; offset < 5; offset++) {
            const option = document.createElement('OPTION');
            option.textContent = year + offset;
            option.value = year + offset;
            fragment.appendChild(option);
        }

        yearSelect.appendChild(fragment);
    }

    function populateDays(id, previousDay) {
        const year = document.getElementById(`tripSelection__${id}--year`)
            .value;
        const month = document.getElementById(`tripSelection__${id}--month`)
            .value;
        const daySelect = document.getElementById(`tripSelection__${id}--day`);
        clearDayList(daySelect);

        const daysInMonth = computeDaysInMonth(month, year);

        renderDayList(daySelect, daysInMonth);

        restorePreviousDay(daySelect, previousDay);
    }

    function clearDayList(daySelect) {
        // delete the current set of <option> elements out of the
        // day <select>, ready for the next set to be injected
        while (daySelect.firstChild) {
            daySelect.removeChild(daySelect.firstChild);
        }
    }

    function computeDaysInMonth(month, year) {
        let daysInMonth;
        // 31 or 30 days?
        if (
            month === '04' ||
            month === '06' ||
            month === '09' ||
            month === '11'
        ) {
            daysInMonth = 30;
        } else if (month === '02') {
            // If month is February, calculate whether it is a leap year or not
            const isLeapYear = new Date(year, 1, 29).getMonth() == 1;
            isLeapYear ? (daysInMonth = 29) : (daysInMonth = 28);
        } else {
            daysInMonth = 31;
        }
        return daysInMonth;
    }

    function renderDayList(daySelect, daysInMonth) {
        for (let day = 1; day <= daysInMonth; day++) {
            var option = document.createElement('option');
            option.textContent = day;
            option.value = addLeadingZero(day);
            daySelect.appendChild(option);
        }
    }

    function restorePreviousDay(daySelect, previousDay) {
        // if previous day has already been set, set daySelect's value
        // to that day, to avoid the day jumping back to 1 when you
        // change the year
        if (previousDay) {
            daySelect.value = addLeadingZero(previousDay);

            // If the previous day was set to a high number, say 31, and then
            // you chose a month with less total days in it (e.g. February),
            // this part of the code ensures that the highest day available
            // is selected, rather than showing a blank daySelect
            if (daySelect.value === '') {
                daySelect.value = addLeadingZero(previousDay) - 1;
            }

            if (daySelect.value === '') {
                daySelect.value = addLeadingZero(previousDay) - 2;
            }

            if (daySelect.value === '') {
                daySelect.value = addLeadingZero(previousDay) - 3;
            }
        }
    }

    function addLeadingZero(day) {
        return day < 10 ? '0' + day : day;
    }

    function updateDateView() {
        const startDate = new Date(_applicationState.startDate);
        const endDate = new Date(_applicationState.endDate);
        const options = {
            weekday: 'long',
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
            _applicationState.daysToTrip +
            ' day' +
            (_applicationState.daysToTrip != 1 ? 's' : '');
        document.getElementById('newTrip__duration').textContent =
            _applicationState.duration +
            ' day' +
            (_applicationState.duration != 1 ? 's' : '');
    }

    function showDateError(id, message) {
        const errorContainer = document.getElementById(
            'tripSelection__error--' + id
        );
        errorContainer.textContent = message;
    }

    function clearDateErrors() {
        const startDateError = document.getElementById(
            'tripSelection__error--startDate'
        );
        const endDateError = document.getElementById(
            'tripSelection__error--endDate'
        );
        startDateError.textContent = '';
        endDateError.textContent = '';
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
        const photoContainer = document.getElementById('newTrip__photo');
        const picture = photoContainer.getElementsByTagName('picture')[0];
        picture.innerHTML = '';
        const img = document.createElement('IMG');
        img.classList.add('photo__img');
        const caption = document.getElementById('newTrip__photo--caption');
        const source = document.createElement('SOURCE');
        source.setAttribute(
            'srcset',
            `${photo.imageURL} 1x, ${photo.largeImageURL} 2x`
        );
        source.setAttribute('type', 'image/jpeg');
        picture.appendChild(source);
        img.setAttribute('src', photo.imageURL);
        img.setAttribute('alt', photo.subject);
        img.setAttribute('type', 'image/jpeg');
        picture.appendChild(img);
        caption.innerHTML = `${photo.subject}. Photo by <a href="${photo.userURL}">${photo.user}</a> at <a href="${photo.pageURL}"><img src="${logo}" alt="Pixabay" class="photo__logo"></a>`;
    }

    function showPictureError(message) {
        const error = document.getElementById('newTrip__photo--error');
        error.textContent = message;
    }

    function clearPictureError() {
        const error = document.getElementById('newTrip__photo--error');
        error.textContent = '';
    }

    const weatherSection = document.getElementById('newTrip__weather');

    function updateCurrentWeather(currentWeather) {
        if (currentWeather.error) {
            showErrorMessage(currentWeather.error);
        } else {
            createLocationCard();
            createCurrentWeatherCard(currentWeather);
        }
    }

    function updateWeatherForecast(weatherForecast) {
        if (weatherForecast.error) {
            showErrorMessage(weatherForecast.error);
        } else {
            const dailyForecasts = weatherForecast.dailyForecasts;
            for (const day of dailyForecasts) {
                createForecastCard(day);
            }
        }
    }

    function showErrorMessage(errorMessage) {
        const fragment = document.createDocumentFragment();
        const error = document.createElement('P');
        error.textContent = errorMessage;
        fragment.appendChild(error);
        weatherSection.appendChild(fragment);
    }

    function clearWeatherSection() {
        weatherSection.innerHTML = '';
    }

    function createCurrentWeatherCard(currentWeather) {
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
        const fragment = document.createDocumentFragment();
        const card = document.createElement('ARTICLE');
        card.classList.add('weather__card--forecast');
        card.innerHTML = `<dl>
            <dt>Weather Description</dt>
            <dd>${forecastedWeather.description}</dd>
            <dt>Max Temperature</dt>
            <dd>${forecastedWeather.maxTemperature}</dd>
            <dt>Min Temperature</dt>
            <dd>${forecastedWeather.minTemperature}</dd>
            <dt>Wind Speed</dt>
            <dd>${forecastedWeather.windSpeed}</dd>
            <dt>Wind Direction</dt>
            <dd>${forecastedWeather.windDirectionAsText}</dd>
        </dl>`;
        fragment.appendChild(card);
        weatherSection.appendChild(fragment);
    }

    function createLocationCard() {
        const fragment = document.createDocumentFragment();
        const card = document.createElement('ARTICLE');
        card.setAttribute('id', 'weather__location');
        card.classList.add('weather__location');
        const city = document.createElement('P');
        city.textContent = _applicationState.city;
        card.appendChild(city);
        const provinceAndCountry = document.createElement('P');
        provinceAndCountry.textContent =
            _applicationState.province + ', ' + _applicationState.country;
        card.appendChild(provinceAndCountry);
        fragment.appendChild(card);
        weatherSection.appendChild(fragment);
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
