const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
// *** COMPONENT INITIALIZATION AND SETUP ***
const countryInfoService = require('./country-info-service');
const cacheService = require('./cache-service');
const geonamesAPI = require('./geonames-api');
const weatherAPI = require('./weather-api');
const pictureAPI = require('./picture-api');
cacheService.load('src/server/data/pixabay-cache.json');
const pixabay = pictureAPI.createAPI(cacheService);
geonamesAPI.countryInfoService = countryInfoService;
weatherAPI.countryInfoService = countryInfoService;

// *** APPLICATION SETUP ***
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));

// *** SERVER START ***
const port = 8082;
const server = app.listen(port, () => {
    console.log(`running on localhost: ${port}`);
});

// *** SERVER ROUTES ***
app.get('/', (request, response) => {
    response.sendFile('dist/index.html');
});

app.get('/currentWeather', weatherAPI.fetchCurrentWeather);

app.get('/forecast', weatherAPI.fetchWeatherForecast);

app.get('/pictures', pixabay.retrievePicture);

app.get('/listCities', geonamesAPI.fetchCityList);

// *** SERVER SHUTDOWN ***
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
