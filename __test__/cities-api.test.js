/**
 * @jest-environment node
 */
const regeneratorRuntime = require('regenerator-runtime');
const axios = require('axios');
jest.mock('axios');
const countryCodeService = require('../src/server/country-code-service');
jest.mock('../src/server/country-code-service.js');
const citiesAPI = require('../src/server/cities-api');

// Set up mock dependencies
axios.get.mockImplementation((url) =>
    Promise.resolve({
        data: {
            totalResultsCount: 34,
            geonames: [
                {
                    adminCode1: 'DC',
                    lng: '-77.03637',
                    geonameId: 4140963,
                    toponymName: 'Washington',
                    countryId: '6252001',
                    fcl: 'P',
                    population: 601723,
                    countryCode: 'US',
                    name: 'Washington',
                    fclName: 'city, village,...',
                    adminCodes1: {
                        ISO3166_2: 'DC',
                    },
                    countryName: 'United States',
                    fcodeName: 'capital of a political entity',
                    adminName1: 'Washington, D.C.',
                    lat: '38.89511',
                    fcode: 'PPLC',
                },
            ],
        },
    })
);

countryCodeService.getCountryName.mockImplementation((name) => 'United States');
citiesAPI.countryCodeService = countryCodeService;

// Set up mock parameters
const mockRequest = {
    query: {
        city: 'Washington',
        province: 'Washington D.C.',
        country: 'United States',
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
const expectedResult = {
    cities: [
        {
            completeName: 'Washington, Washington D.C., United States',
            city: 'Washington',
            province: 'Washington D.C.',
            countryCode: 'US',
            country: 'United States',
            longitude: '-77.03637',
            latitude: '38.89511',
        },
    ],
};

// *** TESTS ***
describe('Testing cities-api.js', () => {
    test('Test that citiesAPI is defined', () => {
        expect(citiesAPI).toBeDefined();
    });
    test('Test that fetchCitiesStartingWith calls response.send', async () => {
        await citiesAPI.fetchCitiesStartingWith(mockRequest, mockResponse);
        expect(mockResponse.send).toHaveBeenCalled();
    });
    test('Test that fetchCitiesStartingWith returns correct results', async () => {
        await citiesAPI.fetchCitiesStartingWith(mockRequest, mockResponse);
        expect(mockResponse.data).toEqual(expectedResult);
    });
    test('Test that fetchCitiesWithExactName calls response.send', async () => {
        await citiesAPI.fetchCitiesWithExactName(mockRequest, mockResponse);
        expect(mockResponse.send).toHaveBeenCalled();
    });
    test('Test that fetchCitiesWithExactName returns correct results', async () => {
        await citiesAPI.fetchCitiesWithExactName(mockRequest, mockResponse);
        expect(mockResponse.data).toEqual(expectedResult);
    });
});
