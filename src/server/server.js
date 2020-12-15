const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
/* Global Variables */
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = process.env.OW_API_KEY;
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

app.get('/weather', (request, response) => {
    const url =
        baseURL +
        request.query.zipcode +
        ',us&appid=' +
        apiKey +
        '&units=imperial';
    axios
        .get(url)
        .then((openWeatherResponse) => {
            const weatherData = openWeatherResponse.data;
            response.send({
                temperature: weatherData.main.temp,
            });
        })
        .catch((error) => {
            console.log(error);
            response.send({
                temperature:
                    'No temperature was found for this location. Try again!',
            });
        });
});
