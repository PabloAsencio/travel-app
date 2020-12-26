const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { DynamicEntryPlugin } = require('webpack');
const countryInfoService = require('./country-info-service');
const cacheService = require('./cache-service');
cacheService.load('src/server/data/pixabay-cache.json');
const geonamesAPI = require('./geonames-api');
geonamesAPI.countryInfoService = countryInfoService;
const pictureAPI = require('./picture-api');
const pixabay = pictureAPI.createAPI(cacheService);
/* Global Variables */
const weatherbitBaseURL = 'https://api.weatherbit.io/v2.0/';
const weatherbitApiKey = process.env.WEATHERBIT_API_KEY;
// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
const port = 8082;
const server = app.listen(port, () => {
    console.log(`running on localhost: ${port}`);
});

// Server Routes
app.get('/', (request, response) => {
    response.sendFile('dist/index.html');
});

app.get('/lastEntry', (request, response) => {
    response.send(projectData);
});

app.post('/addData', (request, response) => {
    const data = request.body;
    projectData['date'] = data.date;
    projectData['temperature'] = data.temperature;
    projectData['userResponse'] = data.userResponse;
    response.send(projectData);
});

app.get('/currentWeather', (request, response) => {
    const query = getWeatherbitQuery(request);

    if (query) {
        const url = weatherbitBaseURL + 'current?' + query;
        axios
            .get(url)
            .then((weatherbitResponse) => {
                if (weatherbitResponse.data.count > 0) {
                    const weatherReport = weatherbitResponse.data.data[0];
                    response.send({
                        city: weatherReport.city_name,
                        province: countryInfoService.getStateName(
                            weatherReport.country_code,
                            weatherReport.state_code
                        ),
                        country: countryInfoService.getCountryName(
                            weatherReport.country_code
                        ),
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
});

app.get('/forecast', (request, response) => {
    const query = getWeatherbitQuery(request);

    if (query) {
        const url = weatherbitBaseURL + 'forecast/daily?' + query;
        axios
            .get(url)
            .then((weatherbitResponse) => {
                if (weatherbitResponse.data) {
                    const weatherReport = weatherbitResponse.data;
                    const dailyForecasts = weatherReport.data.map((report) => {
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
                    });
                    response.send({
                        city: weatherReport.city_name,
                        province: countryInfoService.getStateName(
                            weatherReport.country_code,
                            weatherReport.state_code
                        ),
                        country: countryInfoService.getCountryName(
                            weatherReport.country_code
                        ),
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
});

app.get('/pictures', pixabay.retrievePicture);

app.get('/listCities', geonamesAPI.fetchCityList);

function getWeatherbitQuery(request) {
    let query = '';
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;
    if (latitude && longitude) {
        query += `lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(
            longitude
        )}`;
    } else {
        const city = request.query.city;
        const province = request.query.province;
        const country = request.query.country;
        if (city) {
            query += `city=${encodeURIComponent(city)}${
                province ? ',' + encodeURIComponent(province) : ''
            }${country ? '&country=' + encodeURIComponent(country) : ''}`;
        }
    }
    if (query) {
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

// Gracefully close the system and save cache when termination signal is received
// See https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        cacheService.save();
        cacheService.close();
        console.log('HTTP server closed');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        cacheService.save();
        cacheService.close();
        console.log('HTTP server closed');
    });
});
