const app = (function () {
    let _viewUpdater;
    let _apiService;
    let _dateController;
    let _applicationState;
    let _cityController;

    function start() {
        _dateController.start();
        _cityController.start();
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (
            _dateController.areDatesValid() &&
            (_cityController.isValidCity() ||
                (await _cityController.fetchCity()))
        ) {
            const newTripData = {
                destination: {
                    city: _applicationState.city,
                    province: _applicationState.province,
                    country: _applicationState.country,
                },
                time: {
                    daysToTrip: _applicationState.daysToTrip,
                    duration: _applicationState.duration,
                    startDate: _applicationState.startDate,
                    endDate: _applicationState.endDate,
                },
                pictures: {},
                currentWeather: {},
                weatherForecast: {},
            };

            const currentWeather = _apiService.fetchCurrentWeather(
                _applicationState.latitude,
                _applicationState.longitude
            );
            const forecast = _apiService.fetchWeatherForecast(
                _applicationState.latitude,
                _applicationState.longitude,
                _applicationState.daysToTrip.toString(10),
                _applicationState.duration.toString(10)
            );
            const pictures = _apiService.fetchPictures(
                _applicationState.city,
                _applicationState.province,
                _applicationState.country
            );

            newTripData.currentWeather = await processApiResult(currentWeather);
            newTripData.weatherForecast = await processApiResult(forecast);
            newTripData.pictures = await processApiResult(pictures);

            _viewUpdater.updateNewTrip(newTripData);
        } else {
            console.log('Something went wrong!');
        }

        async function processApiResult(promise) {
            return await promise
                .then(async (response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        const data = await response.json();
                        throw new Error(data.error);
                    }
                })
                .catch((error) => {
                    return { error: error.message };
                });
        }
    }
    return {
        start,
        handleSubmit,
        set applicationState(applicationState) {
            _applicationState = applicationState;
        },
        set viewUpdater(viewUpdater) {
            _viewUpdater = viewUpdater;
        },
        set dateController(dateController) {
            _dateController = dateController;
        },
        set cityController(cityController) {
            _cityController = cityController;
        },
        set apiService(apiService) {
            _apiService = apiService;
        },
    };
})();

export { app };
