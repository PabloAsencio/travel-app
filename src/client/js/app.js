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
                _applicationState.country
            );

            _viewUpdater.clearWeatherSection();

            // TODO: Show some informative error message in the UI instead of logging it
            currentWeather
                .then((response) => response.json())
                .then((weather) => _viewUpdater.updateCurrentWeather(weather))
                .catch((error) => console.log(error.message));
            forecast
                .then((response) => response.json())
                .then((forecast) =>
                    _viewUpdater.updateWeatherForecast(forecast)
                )
                .catch((error) => console.log(error.message));
            pictures
                .then((response) => response.json())
                .then((pictures) => _viewUpdater.updatePicture(pictures))
                .catch((error) => console.log(error.message));
        } else {
            console.log('Something went wrong!');
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
