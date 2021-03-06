const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
// *** COMPONENT INITIALIZATION AND SETUP ***
const countryCodeService = require('./country-code-service');
const cacheService = require('./cache-service');
const citiesAPI = require('./cities-api');
const weatherAPI = require('./weather-api');
const picturesAPI = require('./pictures-api');
cacheService.load('src/server/data/pictures-cache.json');
picturesAPI.cache = cacheService;
citiesAPI.countryCodeService = countryCodeService;

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

app.get('/pictures', picturesAPI.fetchPictures);

app.get('/listCities', citiesAPI.fetchCitiesStartingWith);

app.get('/city', citiesAPI.fetchCitiesWithExactName);

// *** SERVER SHUTDOWN ***
// Gracefully close the system and save cache when termination signal is received
// See https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
app.close = () => {
    server.close(() => {
        cacheService.save();
        cacheService.close();
        console.log('HTTP server closed');
    });
};

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    app.close();
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    app.close();
});

module.exports = app;
