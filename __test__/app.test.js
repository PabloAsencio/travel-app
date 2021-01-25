import 'regenerator-runtime/runtime';
import { app } from '../src/client/js/app';

// Set up mock dependencies
const applicationState = {};
applicationState.city = 'Washington';
applicationState.province = 'Washington D.C.';
applicationState.country = 'United States';
applicationState.startDate = '2021-03-28';
applicationState.endDate = '2021-03-29';
applicationState.duration = 2;

const dateController = {
    start: jest.fn(),
    areDatesValid: jest.fn().mockImplementation(() => true),
};

const cityController = {
    start: jest.fn(),
    isValidCity: jest.fn().mockImplementation(() => true),
    fetchCity: jest.fn().mockImplementation(() => Promise.resolve(true)),
};

const apiService = {
    fetchCurrentWeather: jest.fn().mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve({ currentWeather: 'fine' }),
            ok: true,
        })
    ),
    fetchWeatherForecast: jest.fn().mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve({ forecast: 'fine' }),
            ok: true,
        })
    ),
    fetchPictures: jest.fn().mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve({ pictures: 'fine' }),
            ok: true,
        })
    ),
};

const viewUpdater = {
    updateNewTrip: jest.fn(),
};

app.applicationState = applicationState;
app.apiService = apiService;
app.viewUpdater = viewUpdater;
app.cityController = cityController;
app.dateController = dateController;

// Mock results
const newTripWithForecast = {
    destination: {
        city: 'Washington',
        province: 'Washington D.C.',
        country: 'United States',
    },
    time: {
        daysToTrip: 7,
        duration: 2,
        startDate: '2021-03-28',
        endDate: '2021-03-29',
    },
    pictures: { pictures: 'fine' },
    currentWeather: { currentWeather: 'fine' },
    weatherForecast: { forecast: 'fine' },
};
const newTripNoForecast = {
    destination: {
        city: 'Washington',
        province: 'Washington D.C.',
        country: 'United States',
    },
    time: {
        daysToTrip: 30,
        duration: 2,
        startDate: '2021-03-28',
        endDate: '2021-03-29',
    },
    pictures: { pictures: 'fine' },
    currentWeather: { currentWeather: 'fine' },
    weatherForecast: {
        error:
            'We can only show a weather forecast for your stay if the start day of your trip lies within the next 16 days.',
    },
};
describe('Testing app.js', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input type="submit" value="submit" id="submit">
        `;
        apiService.fetchCurrentWeather.mockClear();
        apiService.fetchWeatherForecast.mockClear();
        apiService.fetchPictures.mockClear();
        viewUpdater.updateNewTrip.mockClear();
    });
    test('That app is defined', () => {
        expect(app).toBeDefined();
    });
    test('That the app starts its dependencies correctly', () => {
        app.start();
        expect(dateController.start).toHaveBeenCalled();
        expect(cityController.start).toHaveBeenCalled();
    });
    test('That the app calls all three apiService interfaces when daysToTrip is less than 16', (done) => {
        applicationState.daysToTrip = 5;
        document
            .getElementById('submit')
            .addEventListener('click', async (event) => {
                await app.handleSubmit(event);
                try {
                    expect(apiService.fetchCurrentWeather).toHaveBeenCalled();
                    expect(apiService.fetchWeatherForecast).toHaveBeenCalled();
                    expect(apiService.fetchPictures).toHaveBeenCalled();
                    done();
                } catch (error) {
                    done(error);
                }
            });
        document.getElementById('submit').click();
    });
    test('That the app does not call apiService.fechtWeatherForecast when daysToTrip is greater than or equal to 16', (done) => {
        applicationState.daysToTrip = 16;
        document
            .getElementById('submit')
            .addEventListener('click', async (event) => {
                await app.handleSubmit(event);
                try {
                    expect(
                        apiService.fetchWeatherForecast
                    ).not.toHaveBeenCalled();
                    done();
                } catch (error) {
                    done(error);
                }
            });
        document.getElementById('submit').click();
    });
    test('That newTripViewUpdater.updateNewTrip is called when handleSubmit runs', (done) => {
        applicationState.daysToTrip = 0;
        document
            .getElementById('submit')
            .addEventListener('click', async (event) => {
                await app.handleSubmit(event);
                try {
                    expect(viewUpdater.updateNewTrip).toHaveBeenCalled();
                    done();
                } catch (error) {
                    done(error);
                }
            });
        document.getElementById('submit').click();
    });
    test('That newTripViewUpdater.updateNewTrip is called with the right object when daysToTrip < 16', (done) => {
        applicationState.daysToTrip = 7;
        document
            .getElementById('submit')
            .addEventListener('click', async (event) => {
                await app.handleSubmit(event);
                try {
                    expect(viewUpdater.updateNewTrip).toHaveBeenCalledWith(
                        newTripWithForecast
                    );
                    done();
                } catch (error) {
                    done(error);
                }
            });
        document.getElementById('submit').click();
    });
    test('That newTripViewUpdater.updateNewTrip is called with the right object when daysToTrip >= 16', (done) => {
        applicationState.daysToTrip = 30;
        document
            .getElementById('submit')
            .addEventListener('click', async (event) => {
                await app.handleSubmit(event);
                try {
                    expect(viewUpdater.updateNewTrip).toHaveBeenCalledWith(
                        newTripNoForecast
                    );
                    done();
                } catch (error) {
                    done(error);
                }
            });
        document.getElementById('submit').click();
    });
});
