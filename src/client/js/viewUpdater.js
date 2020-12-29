import logo from '../../assets/images/pixabay-logo.svg';

const viewUpdater = (function () {
    let _applicationState;
    const cityInputElement = document.getElementById('city');

    function renderNativeDateInput(id, labelText) {
        const container = document.getElementById(id + '__container');
        const fragment = document.createDocumentFragment();
        const label = document.createElement('LABEL');
        label.setAttribute('for', id);
        label.textContent = labelText;
        fragment.appendChild(label);
        const input = document.createElement('INPUT');
        input.type = 'date';
        input.id = id;
        input.name = id;
        fragment.appendChild(input);
        container.appendChild(fragment);
    }

    // This fallback date input is based on
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date#Handling_browser_support
    function renderFallbackDateInput(id, labelText) {
        const container = document.getElementById(id + '__container');
        const fragment = document.createDocumentFragment();
        const label = document.createElement('P');
        label.textContent = labelText;
        fragment.appendChild(label);
        const fallBackDateInput = document.createElement('DIV');
        fallBackDateInput.id = id;
        fallBackDateInput.innerHTML = `
          <span>
            <label for="${id}__day">Day:</label>
            <select id="${id}__day" name="${id}__day">
            </select>
          </span>
          <span>
            <label for="${id}__month">Month:</label>
            <select id="${id}__month" name="${id}__month">
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
          <span>
            <label for="${id}__year">Year:</label>
            <select id="${id}__year" name="${id}__year">
            </select>
          </span>`;

        fragment.appendChild(fallBackDateInput);
        container.appendChild(fragment);
    }

    function populateYears(id) {
        const yearSelect = document.getElementById(id + '__year');
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
        const year = document.getElementById(id + '__year').value;
        const month = document.getElementById(id + '__month').value;
        const daySelect = document.getElementById(id + '__day');
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
        document.getElementById('daysToTrip').textContent =
            _applicationState.daysToTrip +
            ' day' +
            (_applicationState.daysToTrip != 1 ? 's' : '');
        document.getElementById('duration').textContent =
            _applicationState.duration +
            ' day' +
            (_applicationState.duration != 1 ? 's' : '');
    }

    function showDateError(id, message) {
        const errorContainer = document.getElementById(id + '-error');
        errorContainer.textContent = message;
    }

    function clearDateErrors() {
        const startDateError = document.getElementById('startDate-error');
        const endDateError = document.getElementById('endDate-error');
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
        const errorContainer = document.getElementById('city-error');
        errorContainer.textContent = message;
    }

    function clearCityError() {
        const errorContainer = document.getElementById('city-error');
        errorContainer.textContent = '';
    }

    function updatePicture(photos) {
        const photo = photos['pictures'][0]; // In the future all pictures should be shown in a carrousel
        const figure = document.getElementById('photo');
        const picture = figure.getElementsByTagName('picture')[0];
        const img = document.createElement('IMG');
        const caption = document.getElementById('caption');
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
        caption.innerHTML = `${photo.subject}. Photo by <a href="${photo.userURL}">${photo.user}</a> at <a href="${photo.pageURL}"><img src="${logo}" alt="Pixabay"></a>`;
    }
    const weatherSection = document.getElementById('weather');

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
        card.classList.add('weather__card--current');
        card.innerHTML = `<dl>
            <dt>Weather Description</dt>
            <dd>${currentWeather.description}</dd>
            <dt>Temperature</dt>
            <dd>${currentWeather.temperature}</dd>
            <dt>Feels Like</dt>
            <dd>${currentWeather.feelsLike}</dd>
            <dt>Wind Speed</dt>
            <dd>${currentWeather.windSpeed}</dd>
            <dt>Wind Direction</dt>
            <dd>${currentWeather.windDirectionAsText}</dd>
        </dl>`;
        fragment.appendChild(card);
        weatherSection.appendChild(fragment);
    }

    function createForecastCard(forecastedWeather) {
        const fragment = document.createDocumentFragment();
        const card = document.createElement('ARTICLE');
        card.classList.add('weather__card--current');
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
    return {
        set applicationState(applicationState) {
            _applicationState = applicationState;
        },
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
        updateCurrentWeather,
        updateWeatherForecast,
        clearWeatherSection,
    };
})();

export { viewUpdater };