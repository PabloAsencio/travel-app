function createAPIService() {
    // TODO: Remove references to localhost from final version
    const server = 'http://localhost:8082/';
    const citiesEndpoint = 'listCities';
    const currentWeatherEndpoint = 'currentWeather';
    const weatherForecastEndpoint = 'forecast';
    const pictureEndpoint = 'pictures';

    function fetchCities(city, province = '', country = '') {
        const query = prepareCitiesQuery(city, province, country);
        if (query) {
            return fetch(server + citiesEndpoint + query);
        } else {
            return createErrorPromise('No results');
        }
    }

    function fetchCurrentWeather(latitude, longitude) {
        const query = prepareCurrentWeatherQuery(latitude, longitude);
        if (query) {
            return fetch(server + currentWeatherEndpoint + query);
        } else {
            return createErrorPromise('We could not identify your destination');
        }
    }

    function fetchWeatherForecast(latitude, longitude, daysToTrip, duration) {
        const query = prepareWeatherForecastQuery(
            latitude,
            longitude,
            daysToTrip,
            duration
        );
        if (query) {
            return fetch(server + weatherForecastEndpoint + query);
        } else {
            return createErrorPromise('We could not identify your destination');
        }
    }

    function fetchPictures(city, country) {
        const query = preparePicturesQuery(city, country);
        if (query) {
            return fetch(server + pictureEndpoint + query);
        } else {
            return createErrorPromise(
                'Could not retrieve picture: missing city or country parameters'
            );
        }
    }

    function prepareCitiesQuery(city, province, country) {
        let query = '';
        if (city) {
            query = `?city=${encodeURIComponent(city)}${
                province
                    ? '&secondParameter=' + encodeURIComponent(province)
                    : ''
            }${
                country ? '&thirdParameter=' + encodeURIComponent(country) : ''
            }`;
        }
        return query;
    }

    function prepareCurrentWeatherQuery(latitude, longitude) {
        let query = '';
        if (latitude && longitude) {
            query = `?latitude=${encodeURIComponent(
                latitude
            )}&longitude=${encodeURIComponent(longitude)}`;
        }
        return query;
    }

    function prepareWeatherForecastQuery(
        latitude,
        longitude,
        daysToTrip,
        duration
    ) {
        let query = '';

        if (latitude && longitude && daysToTrip && duration) {
            query = `${prepareCurrentWeatherQuery(latitude, longitude)}
                &timeToTrip=${encodeURIComponent(
                    daysToTrip
                )}&duration=${encodeURIComponent(duration)}`;
        }

        return query;
    }

    function preparePicturesQuery(city, country) {
        let query = '';
        if (city && country) {
            query = `?city=${encodeURIComponent(
                city
            )}&country=${encodeURIComponent(country)}`;
        }
        return query;
    }

    function createErrorPromise(errorMessage) {
        return new Promise((resolve, reject) => {
            reject(new Error(errorMessage));
        });
    }

    return {
        fetchCities,
        fetchCurrentWeather,
        fetchWeatherForecast,
        fetchPictures,
    };
}

export { createAPIService };
