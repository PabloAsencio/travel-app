const axios = require('axios');
const pixabayAPIKey = process.env.PIXABAY_API_KEY;
const pixabayBaseURL = `https://pixabay.com/api/?key=${pixabayAPIKey}`;

const pictureAPI = (function () {
    function createAPI(cacheService) {
        const cache = cacheService;
        const suffix = '-picture';

        function retrievePicture(request, response) {
            if (request.query.city && request.query.country) {
                const city = `${request.query.city} ${request.query.country}`;
                if (cache.hasKey(city + suffix)) {
                    response.send(cache.get(city + suffix));
                } else {
                    axios
                        .get(makeURL(city))
                        .then((cityAPIResponse) => {
                            if (cityAPIResponse.data.total > 0) {
                                handleSuccess(
                                    cityAPIResponse,
                                    makeSubject(
                                        request.query.country,
                                        request.query.city
                                    ),
                                    city,
                                    response
                                );
                            } else {
                                axios
                                    .get(makeURL(request.query.country))
                                    .then((countryAPIResponse) => {
                                        if (countryAPIResponse.data.total > 0) {
                                            handleSuccess(
                                                countryAPIResponse,
                                                makeSubject(
                                                    request.query.country
                                                ),
                                                city,
                                                response
                                            );
                                        } else {
                                            response.status(404).send({
                                                error:
                                                    'No results found for the given location',
                                            });
                                        }
                                    });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            response.status(500).send({
                                error: 'Internal Server Error',
                            });
                        });
                }
            } else {
                response.status(400).send({
                    error: 'Bad Request: missing parameters',
                });
            }
        }

        function handleSuccess(apiResponse, subject, key, response) {
            const result = makeResponseObject(apiResponse.data, subject);
            cache.set(key + suffix, result);
            response.send(result);
        }

        function makeURL(query) {
            return `${pixabayBaseURL}&q=${encodeURIComponent(
                query
            )}&image_type=photo&category=places&per_page=3&safesearch=true&orientation=horizontal`;
        }

        function makeSubject(country, city = '') {
            return `${city ? city + ', ' : ''}${country}`;
        }

        function makeResponseObject(responseData, subject) {
            return {
                pictures: responseData.hits.map((hit) =>
                    makePictureObject(hit, subject)
                ),
            };
        }

        function makePictureObject(rawObject, subject) {
            return {
                subject,
                imageURL: rawObject.webformatURL,
                largeImageURL: rawObject.largeImageURL,
                user: rawObject.user,
                userURL: `https://pixabay.com/users/${rawObject.user}-${rawObject.user_id}/`,
                userImageURL: rawObject.userImageURL,
            };
        }

        return {
            retrievePicture,
        };
    }

    return {
        createAPI,
    };
})();

module.exports = pictureAPI;
