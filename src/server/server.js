const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const { DynamicEntryPlugin } = require('webpack');
const fs = require('fs');
dotenv.config();
/* Global Variables */
const countryCodesFile = fs.readFileSync('src/server/data/country-codes.json');
const countryCodes = JSON.parse(countryCodesFile);
const stateCodesFile = fs.readFileSync(
    'src/server/data/weatherbit-state-codes.json'
);
const stateCodes = JSON.parse(stateCodesFile);
const geonamesBaseURL = 'http://api.geonames.org/search?';
const geonamesUsername = process.env.GEONAMES_USERNAME;
const weatherbitBaseURL = 'https://api.weatherbit.io/v2.0/current?';
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

app.get('/location', (request, response) => {
    const url =
        geonamesBaseURL +
        'name=' +
        request.query.placename +
        '&type=json&username=' +
        geonamesUsername;
    axios
        .get(url)
        .then((geonamesResponse) => {
            const places = geonamesResponse.data;
            response.send(places.geonames[0]);
        })
        .catch((error) => {
            console.log(error);
            response.send({
                placeName: 'No location was found under this name. Try again!',
            });
        });
});

app.get('/weather', (request, response) => {
    let url;
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;
    if (typeof latitude != 'undefined' && typeof longitude != 'undefined') {
        url = `${weatherbitBaseURL}lat=${latitude}&lon=${longitude}&key=${weatherbitApiKey}`;
    } else {
        const city = request.query.city;
        const province = request.query.province;
        const country = request.query.country;
        if (city) {
            url = `${weatherbitBaseURL}city=${city}${
                province ? ',' + province : ''
            }${country ? '&country=' + country : ''}&key=${weatherbitApiKey}`;
        }
    }

    if (url) {
        axios
            .get(url)
            .then((weatherbitResponse) => {
                if (weatherbitResponse.data.count > 0) {
                    const weatherReport = weatherbitResponse.data.data[0];
                    response.send({
                        city: weatherReport.city_name,
                        province: getStateName(
                            weatherReport.country_code,
                            weatherReport.state_code
                        ),
                        country: getCountryName(weatherReport.country_code),
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

app.get('/listCities', (request, response) => {
    const url = `${geonamesBaseURL}name_startsWith=${request.query.city}${
        request.query.secondParameter
            ? '&q=' + request.query.secondParameter
            : ''
    }${
        request.query.thirdParameter ? '&q=' + request.query.thirdParameter : ''
    }&cities=cities15000&type=json&maxRows=5&lang&=en&orderby=relevance&username=${geonamesUsername}`;
    axios
        .get(url)
        .then((geonamesResponse) => {
            const places = geonamesResponse.data.geonames;
            const result = {
                cities: [],
            };
            if (places && places.length > 0) {
                for (const city of places) {
                    result.cities.push({
                        name: city.name,
                        province: city.adminName1,
                        countryCode: city.countryCode,
                        country: getCountryName(city.countryCode),
                        lng: city.lng,
                        lat: city.lat,
                    });
                }
            } else {
                result.cities.push({ error: 'No results' });
            }
            response.send(result);
        })
        .catch((error) => {
            console.log(error);
            response.send({
                cities: { error: 'No results' },
            });
        });
});

function getCountryName(countryCode) {
    return countryCodes[countryCode];
}

function getStateName(countryCode, stateCode) {
    return stateCodes[countryCode][stateCode] || stateCode;
}
