/**
 * @jest-environment node
 */
const regeneratorRuntime = require('regenerator-runtime');
const axios = require('axios');
jest.mock('axios');
const weatherAPI = require('../src/server/weather-api');

// Set up mock dependencies
axios.get.mockImplementation((url) => {
    if (url.includes('current')) {
        return Promise.resolve({
            data: {
                data: [
                    {
                        rh: 63,
                        pod: 'd',
                        lon: -77.04,
                        pres: 1024.2,
                        timezone: 'America/New_York',
                        ob_time: '2021-01-24 14:30',
                        country_code: 'US',
                        clouds: 45,
                        ts: 1611498636,
                        solar_rad: 351.1,
                        state_code: 'DC',
                        city_name: 'Farragut Square',
                        wind_spd: 0.89,
                        wind_cdir_full: 'north-northeast',
                        wind_cdir: 'NNE',
                        slp: 1026.8,
                        vis: 5,
                        h_angle: -54,
                        sunset: '22:21',
                        dni: 737.39,
                        dewpt: -7.3,
                        snow: 0,
                        uv: 2.71543,
                        precip: 0,
                        wind_dir: 32,
                        sunrise: '12:19',
                        ghi: 370.77,
                        dhi: 86.21,
                        aqi: 33,
                        lat: 38.9,
                        weather: {
                            icon: 'c01d',
                            code: 800,
                            description: 'Clear sky',
                        },
                        datetime: '2021-01-24:14',
                        temp: -1.1,
                        station: 'F1402',
                        elev_angle: 23.28,
                        app_temp: -1.8,
                    },
                ],
                count: 1,
            },
        });
    } else {
        return Promise.resolve({
            data: {
                data: [
                    {
                        moonrise_ts: 1611513465,
                        wind_cdir: 'WSW',
                        rh: 60,
                        pres: 1023.6458,
                        high_temp: 1.9,
                        sunset_ts: 1611526904,
                        ozone: 351.57956,
                        moon_phase: 0.882252,
                        wind_gust_spd: 10,
                        snow_depth: 0,
                        clouds: 34,
                        ts: 1611464460,
                        sunrise_ts: 1611490810,
                        app_min_temp: -12.3,
                        wind_spd: 2.0277064,
                        pop: 0,
                        wind_cdir_full: 'west-southwest',
                        slp: 1024.7291,
                        moon_phase_lunation: 0.4,
                        valid_date: '2021-01-24',
                        app_max_temp: -2.5,
                        vis: 24.096,
                        dewpt: -8.9,
                        snow: 0,
                        uv: 3.470809,
                        weather: {
                            icon: 'c02d',
                            code: 802,
                            description: 'Scattered clouds',
                        },
                        wind_dir: 255,
                        max_dhi: null,
                        clouds_hi: 5,
                        precip: 0,
                        low_temp: -5.9,
                        max_temp: 1.9,
                        moonset_ts: 1611481905,
                        datetime: '2021-01-24',
                        temp: -1.8,
                        min_temp: -5.9,
                        clouds_mid: 19,
                        clouds_low: 28,
                    },
                    {
                        moonrise_ts: 1611602513,
                        wind_cdir: 'ENE',
                        rh: 75,
                        pres: 1017.4583,
                        high_temp: 3.5,
                        sunset_ts: 1611613374,
                        ozone: 329.34375,
                        moon_phase: 0.940554,
                        wind_gust_spd: 8.1953125,
                        snow_depth: 0,
                        clouds: 85,
                        ts: 1611550860,
                        sunrise_ts: 1611577169,
                        app_min_temp: -6.1,
                        wind_spd: 2.1786084,
                        pop: 90,
                        wind_cdir_full: 'east-northeast',
                        slp: 1018.7292,
                        moon_phase_lunation: 0.43,
                        valid_date: '2021-01-25',
                        app_max_temp: -0.5,
                        vis: 18.376333,
                        dewpt: -3.2,
                        snow: 0,
                        uv: 1.8281018,
                        weather: {
                            icon: 'r01d',
                            code: 500,
                            description: 'Light rain',
                        },
                        wind_dir: 64,
                        max_dhi: null,
                        clouds_hi: 53,
                        precip: 8.1875,
                        low_temp: -0.9,
                        max_temp: 3.7,
                        moonset_ts: 1611571734,
                        datetime: '2021-01-25',
                        temp: 0.9,
                        min_temp: -0.9,
                        clouds_mid: 59,
                        clouds_low: 66,
                    },
                ],
                city_name: 'Farragut Square',
                lon: -77.04,
                timezone: 'America/New_York',
                lat: 38.9,
                country_code: 'US',
                state_code: 'DC',
            },
        });
    }
});

// Set up mock parameters
const mockRequest = {
    query: {
        longitude: '-77.03637',
        latitude: '38.89511',
    },
};
const mockResponse = (function () {
    let _data = {};
    return {
        send: jest.fn().mockImplementation((data) => {
            _data = data;
        }),
        get data() {
            return _data;
        },
    };
})();

// Result
const expectedResultCurrent = {
    code: 'c01d',
    description: 'Clear sky',
    temperature: -1.1,
    feelsLike: -1.8,
    windSpeed: 0.89,
    windDirectionInDegrees: 32,
    windDirectionAsText: 'north-northeast',
};

const expectedResultForecast = {
    dailyForecasts: [
        {
            date: '2021-01-24',
            code: 802,
            description: 'Scattered clouds',
            windSpeed: 2.0277064,
            windDirectionInDegrees: 255,
            windDirectionAsText: 'west-southwest',
            maxTemperature: 1.9,
            minTemperature: -5.9,
            maxfeelsLike: -2.5,
            minfeelsLike: -12.3,
        },
        {
            date: '2021-01-25',
            code: 500,
            description: 'Light rain',
            windSpeed: 2.1786084,
            windDirectionInDegrees: 64,
            windDirectionAsText: 'east-northeast',
            maxTemperature: 3.7,
            minTemperature: -0.9,
            maxfeelsLike: -0.5,
            minfeelsLike: -6.1,
        },
    ],
};

// *** TESTS ***
describe('Testing weather-api.js', () => {
    test('Test that weatherAPI is defined', () => {
        expect(weatherAPI).toBeDefined();
    });
    test('Test that fetchCurrentWeather calls response.send', async () => {
        await weatherAPI.fetchCurrentWeather(mockRequest, mockResponse);
        expect(mockResponse.send).toHaveBeenCalled();
    });
    test('Test that fetchCurrentWeather returns correct results', async () => {
        await weatherAPI.fetchCurrentWeather(mockRequest, mockResponse);
        expect(mockResponse.data).toEqual(expectedResultCurrent);
    });
    test('Test that fetchWeatherForecast calls response.send', async () => {
        mockRequest.query.daysToTrip = 0;
        mockRequest.query.duration = 2;
        await weatherAPI.fetchWeatherForecast(mockRequest, mockResponse);
        expect(mockResponse.send).toHaveBeenCalled();
        delete mockRequest.query.daysToTrip;
        delete mockRequest.query.duration;
    });
    test('Test that fetchWeatherForecast returns correct results', async () => {
        mockRequest.query.daysToTrip = 0;
        mockRequest.query.duration = 2;
        await weatherAPI.fetchWeatherForecast(mockRequest, mockResponse);
        expect(mockResponse.data).toEqual(expectedResultForecast);
        delete mockRequest.query.daysToTrip;
        delete mockRequest.query.duration;
    });
});
