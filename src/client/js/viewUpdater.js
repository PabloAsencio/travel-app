import logo from '../../assets/images/pixabay-logo.svg';

const viewUpdater = (function () {
    let _applicationState;
    const cityInputElement = document.getElementById('city');

    function updateDateView() {
        document.getElementById('daysToTrip').textContent =
            _applicationState.daysToTrip +
            ' day' +
            (_applicationState.daysToTrip != 1 ? 's' : '');
        document.getElementById('duration').textContent =
            _applicationState.duration +
            1 +
            ' day' +
            (_applicationState.duration + 1 != 1 ? 's' : '');
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
        createNewCityList,
        setActiveCity,
        clearCityList,
        updateDateView,
        updatePicture,
        updateCurrentWeather,
        updateWeatherForecast,
        clearWeatherSection,
    };
})();

export { viewUpdater };
