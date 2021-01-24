/**
 * @jest-environment node
 */
const regeneratorRuntime = require('regenerator-runtime');
const axios = require('axios');
jest.mock('axios');
const cache = require('../src/server/cache-service');
jest.mock('../src/server/cache-service.js');
const picturesAPI = require('../src/server/pictures-api');

// Set up mock dependencies
axios.get.mockImplementation((url) =>
    Promise.resolve({
        data: {
            total: 27,
            totalHits: 27,
            hits: [
                {
                    pageURL: 'https://pixabay.com/photos/photo/',
                    webformatURL:
                        'https://pixabay.com/get/g77116a4422c9ad22480972979342d80b4b38b45c23a92edcc697310e26f284144ee627e4abe6019a80a920ae2c239dc0977f786a7cce106d42aa71bf16315566_640.jpg',
                    largeImageURL:
                        'https://pixabay.com/get/gbbe4f2feb6ebb29e2a75eabb0f58ec358004a41f458f06d9a450d8b49145628aedc7ae170d5f8336c77956c339c59443e9fd87eb5139e528b3ed3eec5dbe76d0_1280.jpg',
                    user: 'user',
                    user_id: 'id',
                    userImageURL: '',
                    imageWidth: '16',
                    imageHeight: '9',
                },
                {
                    pageURL: 'https://pixabay.com/photos/photo/',
                    webformatURL:
                        'https://pixabay.com/get/g1526958120514a42b3c225ce2354c42f8d54f7282b5a815966512baf182f350b47cac63805196f9390274100025608cc57605d452fb67bf9cf39a34da0d0e6cd_640.jpg',
                    largeImageURL:
                        'https://pixabay.com/get/g547ec71f3fe8a648bf729fe352fbbed22e21c075d2a8776ce71400030c32647ecf310472a98dc6a260089c2d63c88ba0b7ddab6556360bdb4da98453fe9bb750_1280.jpg',
                    user: 'user',
                    user_id: 'id',
                    userImageURL: '',
                    imageWidth: '16',
                    imageHeight: '9',
                },
                {
                    pageURL: 'https://pixabay.com/photos/photo/',
                    webformatURL:
                        'https://pixabay.com/get/g1ffe935371003e26b7d33b3fb4f7108394dbe83741a76b6e355e041eb30631f1655fa3e6bb22385df736a368db12f7bae282c0dd76c0c343f5bba539b8424083_640.jpg',
                    largeImageURL:
                        'https://pixabay.com/get/g3d21e85ed7e807d91f43b8df5014373d873a3fa88d5b5a8172bf07ce66cbd2e9982cf0886c89619ab636f5fd6ad12eb680847a9d4cc18b5431d06c750829e483_1280.jpg',
                    user: 'user',
                    user_id: 'id',
                    userImageURL: '',
                    imageWidth: '16',
                    imageHeight: '9',
                },
                {
                    pageURL: 'https://pixabay.com/photos/photo/',
                    webformatURL:
                        'https://pixabay.com/get/g9c238238655bd8c42e95c6557049ef4b3554de334465f1dd232c60d7911d62b111b8b26faa904ed54993a9a40ab4d8436a75002d5ba446914d367140ae617987_640.jpg',
                    largeImageURL:
                        'https://pixabay.com/get/g96d52071aae79cfd40f0cbc95496fd98165799926d368a91d8a4add44fadd363ea9c981cc3aa73fdeafd4da5a183d1552778bd71dd2161ffa7ecec77ad66b519_1280.jpg',
                    user: 'user',
                    user_id: 'id',
                    userURL: 'https://pixabay.com/users/Olichel-529835/',
                    userImageURL: '',
                    imageWidth: '16',
                    imageHeight: '9',
                },
                {
                    pageURL: 'https://pixabay.com/photos/photo/',
                    webformatURL:
                        'https://pixabay.com/get/g2cac285d03cb1ac110dc0128e1b96859db20777348e9407e10a00edbb2fab2b77a9a4ee6367700ca14650a368af678c5_640.jpg',
                    largeImageURL:
                        'https://pixabay.com/get/gc5553782a855c01861d5a0d3032229d301ac3440505db0f20a11958dd52d00743c69165574e44c3e3245f9db95242852027de0288aaeefa361fe1bc9a3e27042_1280.jpg',
                    user: 'user',
                    user_id: 'id',
                    userImageURL: '',
                    imageWidth: '16',
                    imageHeight: '9',
                },
            ],
        },
    })
);

cache.hasKey.mockImplementation((key) => false);
cache.set.mockImplementation((key, value) => {});
picturesAPI.cache = cache;

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
    pictures: [
        {
            subject: 'Washington, Washington D.C., United States',
            pageURL: 'https://pixabay.com/photos/photo/',
            imageURL:
                'https://pixabay.com/get/g77116a4422c9ad22480972979342d80b4b38b45c23a92edcc697310e26f284144ee627e4abe6019a80a920ae2c239dc0977f786a7cce106d42aa71bf16315566_640.jpg',
            largeImageURL:
                'https://pixabay.com/get/gbbe4f2feb6ebb29e2a75eabb0f58ec358004a41f458f06d9a450d8b49145628aedc7ae170d5f8336c77956c339c59443e9fd87eb5139e528b3ed3eec5dbe76d0_1280.jpg',
            user: 'user',
            userURL: 'https://pixabay.com/users/user-id/',
            userImageURL: '',
        },
        {
            subject: 'Washington, Washington D.C., United States',
            pageURL: 'https://pixabay.com/photos/photo/',
            imageURL:
                'https://pixabay.com/get/g1526958120514a42b3c225ce2354c42f8d54f7282b5a815966512baf182f350b47cac63805196f9390274100025608cc57605d452fb67bf9cf39a34da0d0e6cd_640.jpg',
            largeImageURL:
                'https://pixabay.com/get/g547ec71f3fe8a648bf729fe352fbbed22e21c075d2a8776ce71400030c32647ecf310472a98dc6a260089c2d63c88ba0b7ddab6556360bdb4da98453fe9bb750_1280.jpg',
            user: 'user',
            userURL: 'https://pixabay.com/users/user-id/',
            userImageURL: '',
        },
        {
            subject: 'Washington, Washington D.C., United States',
            pageURL: 'https://pixabay.com/photos/photo/',
            imageURL:
                'https://pixabay.com/get/g1ffe935371003e26b7d33b3fb4f7108394dbe83741a76b6e355e041eb30631f1655fa3e6bb22385df736a368db12f7bae282c0dd76c0c343f5bba539b8424083_640.jpg',
            largeImageURL:
                'https://pixabay.com/get/g3d21e85ed7e807d91f43b8df5014373d873a3fa88d5b5a8172bf07ce66cbd2e9982cf0886c89619ab636f5fd6ad12eb680847a9d4cc18b5431d06c750829e483_1280.jpg',
            user: 'user',
            userURL: 'https://pixabay.com/users/user-id/',
            userImageURL: '',
        },
        {
            subject: 'Washington, Washington D.C., United States',
            pageURL: 'https://pixabay.com/photos/photo/',
            imageURL:
                'https://pixabay.com/get/g9c238238655bd8c42e95c6557049ef4b3554de334465f1dd232c60d7911d62b111b8b26faa904ed54993a9a40ab4d8436a75002d5ba446914d367140ae617987_640.jpg',
            largeImageURL:
                'https://pixabay.com/get/g96d52071aae79cfd40f0cbc95496fd98165799926d368a91d8a4add44fadd363ea9c981cc3aa73fdeafd4da5a183d1552778bd71dd2161ffa7ecec77ad66b519_1280.jpg',
            user: 'user',
            userURL: 'https://pixabay.com/users/user-id/',
            userImageURL: '',
        },
        {
            subject: 'Washington, Washington D.C., United States',
            pageURL: 'https://pixabay.com/photos/photo/',
            imageURL:
                'https://pixabay.com/get/g2cac285d03cb1ac110dc0128e1b96859db20777348e9407e10a00edbb2fab2b77a9a4ee6367700ca14650a368af678c5_640.jpg',
            largeImageURL:
                'https://pixabay.com/get/gc5553782a855c01861d5a0d3032229d301ac3440505db0f20a11958dd52d00743c69165574e44c3e3245f9db95242852027de0288aaeefa361fe1bc9a3e27042_1280.jpg',
            user: 'user',
            userURL: 'https://pixabay.com/users/user-id/',
            userImageURL: '',
        },
    ],
};

// *** TESTS ***
describe('Testing pictures-api.js', () => {
    test('Test that picturesAPI is defined', () => {
        expect(picturesAPI).toBeDefined();
    });
    test('Test that fetchPictures calls response.send', async () => {
        await picturesAPI.fetchPictures(mockRequest, mockResponse);
        expect(mockResponse.send).toHaveBeenCalled();
    });
    test('Test that fetchPictures returns correct results', async () => {
        await picturesAPI.fetchPictures(mockRequest, mockResponse);
        expect(mockResponse.data).toEqual(expectedResult);
    });
    test('Test that fetchPictures calls cache methods', async () => {
        await picturesAPI.fetchPictures(mockRequest, mockResponse);
        expect(cache.set).toHaveBeenCalled();
        expect(cache.hasKey).toHaveBeenCalled();
    });
});
