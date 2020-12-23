import logo from '../../assets/images/pixabay-logo.svg';

const createViewUpdater = function (appState) {
    function updateDateView() {
        document.getElementById('daysToTrip').textContent =
            appState.daysToTrip +
            ' day' +
            (appState.daysToTrip != 1 ? 's' : '');
        document.getElementById('duration').textContent =
            appState.duration +
            1 +
            ' day' +
            (appState.duration + 1 != 1 ? 's' : '');
    }
    return { updateDateView };
};

const weatherSection = document.getElementById('weather');

function updateCurrentWeather(currentWeather) {
    if (currentWeather.error) {
        showErrorMessage(currentWeather.error);
    } else {
        createLocationCard(currentWeather);
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

function updatePicture(photos) {
    const photo = photos['pictures'][0]; // In the future all pictures should be shown in a carrousel
    const figure = document.getElementById('photo');
    const picture = figure.getElementsByTagName('picture')[0];
    const img = picture.getElementsByTagName('img')[0];
    const caption = document.getElementById('caption');
    const source = document.createElement('SOURCE');
    source.setAttribute(
        'srcset',
        `${photo.imageURL} 1x, ${photo.largeImageURL} 2x`
    );
    source.setAttribute('type', 'image/jpeg');
    img.parentNode.prepend(source);
    img.setAttribute('src', photo.imageURL);
    img.setAttribute('alt', photo.subject);
    caption.innerHTML = `${photo.subject}. Photo by <a href="${photo.userURL}">${photo.user}</a> at <a href="${photo.pageURL}"><img src="${logo}" alt="Pixabay"></a>`;
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

function createLocationCard(currentWeather) {
    const fragment = document.createDocumentFragment();
    const card = document.createElement('ARTICLE');
    card.setAttribute('id', 'weather__location');
    card.classList.add('weather__location');
    const city = document.createElement('P');
    city.textContent = currentWeather.city;
    card.appendChild(city);
    const provinceAndCountry = document.createElement('P');
    provinceAndCountry.textContent =
        currentWeather.province + ', ' + currentWeather.country;
    card.appendChild(provinceAndCountry);
    fragment.appendChild(card);
    weatherSection.appendChild(fragment);
}

export {
    updateCurrentWeather,
    updateWeatherForecast,
    clearWeatherSection,
    updatePicture,
    createViewUpdater,
};
