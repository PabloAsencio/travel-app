const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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
const weatherAPI = require('./weather-api');
weatherAPI.countryInfoService = countryInfoService;
/* Global Variables */

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

app.get('/currentWeather', weatherAPI.fetchCurrentWeather);

app.get('/forecast', weatherAPI.fetchWeatherForecast);

app.get('/pictures', pixabay.retrievePicture);

app.get('/listCities', geonamesAPI.fetchCityList);

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
