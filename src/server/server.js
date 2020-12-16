const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const { DynamicEntryPlugin } = require('webpack');
dotenv.config();
/* Global Variables */
const baseURL = 'http://api.geonames.org/search?';
const geonamesUsername = process.env.GEONAMES_USERNAME;
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
        baseURL +
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

app.get('/listCities', (request, response) => {
    const url =
        baseURL +
        'name_startsWith=' +
        request.query.city +
        '&cities=cities15000&type=json&maxRows=5&lang=en&username=' +
        geonamesUsername;
    axios
        .get(url)
        .then((geonamesResponse) => {
            const places = geonamesResponse.data.geonames;
            const result = {
                cities: [],
            };
            if (places) {
                for (const city of places) {
                    result.cities.push({
                        name: city.name,
                        countryCode: city.countryCode,
                        country: city.countryName,
                        lng: city.lng,
                        lat: city.lat,
                    });
                }
            }
            response.send(result);
        })
        .catch((error) => {
            console.log(error);
            response.send({
                cities: [],
            });
        });
});
