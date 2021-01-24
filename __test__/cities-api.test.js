import citiesAPI from '../src/server/cities-api';

describe('Testing cities-api.js', () => {
    test('Test that citiesAPI is defined', () => {
        expect(citiesAPI).toBeDefined();
    });
});
