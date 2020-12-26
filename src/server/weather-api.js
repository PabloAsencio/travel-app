const axios = require('axios');
const weatherbitBaseURL = 'https://api.weatherbit.io/v2.0/';
const weatherbitApiKey = process.env.WEATHERBIT_API_KEY;

const weatherAPI = (function () {
    function fetchCurrentWeather(request, response) {
        const query = getWeatherbitQuery(request);

        if (query) {
            const url = weatherbitBaseURL + 'current?' + query;
            axios
                .get(url)
                .then((weatherbitResponse) => {
                    if (weatherbitResponse.data.count > 0) {
                        const weatherReport = weatherbitResponse.data.data[0];
                        response.send({
                            code: weatherReport.weather.code,
                            description: weatherReport.weather.description,
                            temperature: weatherReport.temp,
                            feelsLike: weatherReport.app_temp,
                            windSpeed: weatherReport.wind_spd,
                            windDirectionInDegrees: weatherReport.wind_dir,
                            windDirectionAsText: weatherReport.wind_cdir,
                        });
                    } else {
                        response.send({
                            error: 'No results were found for this location',
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    response.send({
                        error:
                            'Something went wrong while retrieving the weather report',
                    });
                });
        } else {
            response.send({
                error: 'Not enough data to identify the desired location',
            });
        }
    }

    function fetchWeatherForecast(request, response) {
        const query = getWeatherbitQuery(request);

        if (query) {
            const url = weatherbitBaseURL + 'forecast/daily?' + query;
            axios
                .get(url)
                .then((weatherbitResponse) => {
                    if (weatherbitResponse.data) {
                        const weatherReport = weatherbitResponse.data;
                        const dailyForecasts = weatherReport.data.map(
                            (report) => {
                                return {
                                    date: report.valid_date,
                                    code: report.weather.code,
                                    description: report.weather.description,
                                    windSpeed: report.wind_spd,
                                    windDirectionInDegrees: report.wind_dir,
                                    windDirectionAsText: report.wind_cdir,
                                    maxTemperature: report.max_temp,
                                    minTemperature: report.min_temp,
                                    maxfeelsLike: report.app_max_temp,
                                    minfeelsLike: report.app_min_temp,
                                };
                            }
                        );
                        response.send({
                            dailyForecasts: dailyForecasts,
                        });
                    } else {
                        response.send({
                            error: 'No results were found for this location',
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    response.send({
                        error:
                            'Something went wrong while retrieving the weather report',
                    });
                });
        } else {
            response.send({
                error: 'Not enough data to identify the desired location',
            });
        }
    }

    function getWeatherbitQuery(request) {
        let query = '';
        const latitude = request.query.latitude;
        const longitude = request.query.longitude;
        if (latitude && longitude) {
            query += `lat=${encodeURIComponent(
                latitude
            )}&lon=${encodeURIComponent(longitude)}`;
            const timeToTrip = request.query.timeToTrip;
            const duration = request.query.duration;
            if (timeToTrip && duration) {
                const days = parseInt(timeToTrip, 10) + parseInt(duration, 10);
                query += `&days=${encodeURIComponent(days)}`;
            }
            query += `&key=${weatherbitApiKey}`;
        }
        return query;
    }

    return {
        fetchCurrentWeather,
        fetchWeatherForecast,
    };
})();

module.exports = weatherAPI;
