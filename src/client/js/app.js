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
                weatherForecast: {
                    error:
                        'We can only show a weather forecast for your stay if the start day of your trip lies within the next 16 days.',
                },
            };

            const currentWeather = _apiService.fetchCurrentWeather(
                _applicationState.latitude,
                _applicationState.longitude
            );

            const pictures = _apiService.fetchPictures(
                _applicationState.city,
                _applicationState.province,
                _applicationState.country
            );

            if (_applicationState.daysToTrip < 16) {
                const forecast = _apiService.fetchWeatherForecast(
                    _applicationState.latitude,
                    _applicationState.longitude,
                    _applicationState.daysToTrip.toString(10),
                    _applicationState.duration.toString(10)
                );
                newTripData.weatherForecast = await processApiResult(forecast);
            }

            newTripData.currentWeather = await processApiResult(currentWeather);

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
