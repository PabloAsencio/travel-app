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

export { updateCurrentWeather, updateWeatherForecast, clearWeatherSection };
