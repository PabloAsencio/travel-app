const weatherViewUpdater = (function () {
    function updateCurrentWeather(currentWeather) {
        if (currentWeather.error) {
            showErrorMessage(
                currentWeather.error,
                document.getElementById('newTrip__weather--current')
            );
        } else {
            createWeatherCard(currentWeather, true);
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
                createWeatherCard(day, false);
            }
        }
    }

    function showErrorMessage(errorMessage, weatherSection) {
        const fragment = document.createDocumentFragment();
        const error = document.createElement('P');
        error.classList.add('weather__error');
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

    function createWeatherCard(weatherData, isCurrent) {
        const weatherSection = document.getElementById(
            'newTrip__weather--' + (isCurrent ? 'current' : 'forecast')
        );
        const fragment = document.createDocumentFragment();
        const card = document.createElement('ARTICLE');
        card.classList.add('weather__card');
        card.classList.add(
            'weather__card--' + (isCurrent ? 'current' : 'forecast')
        );
        const weatherDescription = makeWeatherDescription(
            weatherData,
            isCurrent
        );

        card.appendChild(weatherDescription);
        const temperature = makeTemperatureSection(weatherData, isCurrent);
        card.appendChild(temperature);
        const wind = makeWindSection(weatherData);
        card.appendChild(wind);
        fragment.appendChild(card);
        weatherSection.appendChild(fragment);
    }

    function makeWeatherDescription(weatherData, isCurrent) {
        const weatherDescription = document.createElement('HEADER');
        weatherDescription.classList.add('weather__header');
        weatherDescription.innerHTML = `
            <div class="weather__descriptionIcon">
                <i class="wi wi-wb-${weatherData.code}" aria-hidden="true"></i>
            </div>
            <h4 class="weather__description">${weatherData.description}</h4>
            <p>${isCurrent ? 'NOW' : makeDate(weatherData)}</p>`;
        return weatherDescription;
    }

    function makeTemperatureSection(weatherData, isCurrent) {
        const temperature = document.createElement('SECTION');
        const temperatureLeft = isCurrent
            ? weatherData.temperature
            : weatherData.minTemperature;
        const temperatureRight = isCurrent
            ? weatherData.feelsLike
            : weatherData.maxTemperature;
        temperature.classList.add('weather__temperature');
        temperature.innerHTML = `
            <h5>Temperature</h5>
            <div class="weather__temperature--left">
                <h6>${isCurrent ? 'Real' : 'Low'}</h6>
                ${makeTemperatureParagraph(temperatureLeft)}
            </div>
            <div class="weather__temperature--right">
                <h6>${isCurrent ? 'Feels like' : 'High'}</h6>
                ${makeTemperatureParagraph(temperatureRight)}
            </div>
        `;
        addEventListenersToIcons(temperature, 'celsius');
        return temperature;
    }

    function makeWindSection(weatherData) {
        const wind = document.createElement('SECTION');
        wind.classList.add('weather__wind');
        wind.innerHTML = `
            <h5>Wind</h5>
            <div class="weather__windDirection">
                <p>
                    <i class="wi wi-wind from-${
                        weatherData.windDirectionInDegrees
                    }-deg" aria-label="${weatherData.windDirectionAsText}"></i>
                </p>
            </div>
            <div class="weather__windSpeed">
                <p>
                    <span class="weather__windSpeed--kmh" hidden aria-hidden="true">${getSpeedInKmH(
                        weatherData.windSpeed
                    )} <span aria-label="kilometers per hour">km/h</span></span>
                    <span class="weather__windSpeed--mph">${getSpeedInMPH(
                        weatherData.windSpeed
                    )} <span aria-label="miles per hour">mph</span></span>
                </p>
            </div>
        `;
        return wind;
    }

    function makeDate(weatherData) {
        const date = new Date(weatherData.date);
        const options = {
            month: 'long',
            day: 'numeric',
        };
        if (date.getFullYear() != new Date().getFullYear()) {
            options.year = 'numeric';
        }
        return date.toLocaleDateString('en-US', options);
    }

    function makeTemperatureParagraph(temperature) {
        return `<p>
                    <span class="weather__temperature--celsius" hidden aria-hidden="true">
                        ${temperature}
                        <span class="screen-reader-only">degrees Celsius</span>
                    </span>
                    <span class="weather__temperature--fahrenheit">
                        ${convertCelsiusToFahrenheit(temperature)}
                        <span class="screen-reader-only">degrees Fahrenheit</span>
                    </span>
                    <span class="weather__icon">
                        <i class="wi wi-celsius weather__icon--active" aria-label="click here to switch to degrees Celsius"></i>
                    </span> |
                    <span class="weather__icon">
                        <i class="wi wi-fahrenheit" aria-hidden="true"></i>
                    </span>
                </p>`;
    }

    function addEventListenersToIcons(temperatureElement, scale) {
        const icons = temperatureElement.getElementsByClassName('wi-' + scale);
        for (let i = 0; i < icons.length; i++) {
            icons[i].addEventListener('click', switchUnits);
        }
    }

    function getSpeedInKmH(speed) {
        return Math.round(speed * 3.6);
    }

    function getSpeedInMPH(speed) {
        const metersPerMile = 1609.34;
        return Math.round((speed * 3600) / metersPerMile);
    }

    function convertCelsiusToFahrenheit(celsius) {
        return Math.round((celsius * 9) / 5 + 32);
    }

    function switchUnits(event) {
        const switchToImperial = event.target.classList.contains(
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

        toggleTemperaturesVisibility(
            celsiusTemperatures,
            fahrenheitTemperatures,
            switchToImperial
        );

        toggleSpeedsVisibility(speedsInKmH, speedsInMPH, switchToImperial);

        toggleIcons(celsiusIcons, fahrenheitIcons, switchToImperial);
    }

    function toggleTemperaturesVisibility(
        celsiusTemperatures,
        fahrenheitTemperatures,
        switchToImperial
    ) {
        for (let i = 0; i < celsiusTemperatures.length; i++) {
            celsiusTemperatures[i].hidden = switchToImperial;
            celsiusTemperatures[i].setAttribute(
                'aria-hidden',
                switchToImperial
            );
            fahrenheitTemperatures[i].hidden = !switchToImperial;
            fahrenheitTemperatures[i].setAttribute(
                'aria-hidden',
                !switchToImperial
            );
        }
    }

    function toggleSpeedsVisibility(
        speedsInKmH,
        speedsInMPH,
        switchToImperial
    ) {
        for (let i = 0; i < speedsInKmH.length; i++) {
            speedsInKmH[i].hidden = switchToImperial;
            speedsInKmH[i].setAttribute('aria-hidden', switchToImperial);
            speedsInMPH[i].hidden = !switchToImperial;
            speedsInMPH[i].setAttribute('aria-hidden', !switchToImperial);
        }
    }

    function toggleIcons(celsiusIcons, fahrenheitIcons, switchToImperial) {
        for (let i = 0; i < celsiusIcons.length; i++) {
            celsiusIcons[i].classList.toggle(
                'weather__icon--active',
                switchToImperial
            );
            celsiusIcons[i].setAttribute('aria-hidden', !switchToImperial);
            fahrenheitIcons[i].classList.toggle(
                'weather__icon--active',
                !switchToImperial
            );
            fahrenheitIcons[i].setAttribute('aria-hidden', switchToImperial);
            if (switchToImperial) {
                celsiusIcons[i].setAttribute(
                    'aria-label',
                    'Click here to switch to degrees Celsius'
                );
                celsiusIcons[i].addEventListener('click', switchUnits);
                fahrenheitIcons[i].removeAttribute('aria-label');
                fahrenheitIcons[i].removeEventListener('click', switchUnits);
            } else {
                celsiusIcons[i].removeAttribute('aria-label');
                celsiusIcons[i].removeEventListener('click', switchUnits);
                fahrenheitIcons[i].setAttribute(
                    'aria-label',
                    'Click here to switch to degrees Fahrenheit'
                );
                fahrenheitIcons[i].addEventListener('click', switchUnits);
            }
        }
    }

    return {
        updateCurrentWeather,
        updateWeatherForecast,
        clearWeatherSection,
    };
})();

export { weatherViewUpdater };
