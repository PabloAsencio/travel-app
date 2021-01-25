/**
 * @jest-environment node
 */
const regeneratorRuntime = require('regenerator-runtime');
const request = require('supertest');
const countryCodeService = require('../src/server/country-code-service');
jest.mock('../src/server/country-code-service.js');
const cacheService = require('../src/server/cache-service');
jest.mock('../src/server/cache-service.js');
const citiesAPI = require('../src/server/cities-api');
jest.mock('../src/server/cities-api.js');
const picturesAPI = require('../src/server/pictures-api');
jest.mock('../src/server/pictures-api.js');
const weatherAPI = require('../src/server/weather-api');
jest.mock('../src/server/weather-api.js');
const app = require('../src/server/server');

const apiCallback = (request, response) => {
    response.send({ message: 'This is fine' });
};

citiesAPI.fetchCitiesWithExactName.mockImplementation(apiCallback);
citiesAPI.fetchCitiesStartingWith.mockImplementation(apiCallback);
picturesAPI.fetchPictures.mockImplementation(apiCallback);
weatherAPI.fetchCurrentWeather.mockImplementation(apiCallback);
weatherAPI.fetchWeatherForecast.mockImplementation(apiCallback);

describe('Testing server.js', () => {
    afterAll(async () => {
        await app.close();
    });
    test('That server is defined', async () => {
        await expect(app).toBeDefined();
    });
    test('That accessing /city results in a call to citiesAPI.fetchCitiesWithExactName', async () => {
        const response = await request(app).get('/city');
        expect(response.statusCode).toBe(200);
        expect(citiesAPI.fetchCitiesWithExactName).toHaveBeenCalled();
    });
    test('That accessing /listCities results in a call to citiesAPI.fetchCitiesStartingWith', async () => {
        const response = await request(app).get('/listCities');
        expect(response.statusCode).toBe(200);
        expect(citiesAPI.fetchCitiesStartingWith).toHaveBeenCalled();
    });
    test('That accessing /pictures results in a call to picturesAPI.fetchPictures', async () => {
        const response = await request(app).get('/pictures');
        expect(response.statusCode).toBe(200);
        expect(picturesAPI.fetchPictures).toHaveBeenCalled();
    });
    test('That accessing /currentWeather results in a call to weatherAPI.fetchCurrentWeather', async () => {
        const response = await request(app).get('/currentWeather');
        expect(response.statusCode).toBe(200);
        expect(weatherAPI.fetchCurrentWeather).toHaveBeenCalled();
    });
    test('That accessing /forecast results in a call to weatherAPI.fetchWeatherForecast', async () => {
        const response = await request(app).get('/forecast');
        expect(response.statusCode).toBe(200);
        expect(weatherAPI.fetchWeatherForecast).toHaveBeenCalled();
    });
});
