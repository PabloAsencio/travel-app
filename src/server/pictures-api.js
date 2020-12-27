const axios = require('axios');
const apiKey = process.env.PIXABAY_API_KEY;
const apiBaseURL = `https://pixabay.com/api/?key=${apiKey}`;

const picturesAPI = (function () {
    let _cache;
    const suffix = '-picture';

    function fetchPictures(request, response) {
        if (request.query.city && request.query.country) {
            const city = `${request.query.city} ${request.query.country}`;
            if (_cache.hasKey(city + suffix)) {
                response.send(_cache.get(city + suffix));
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
                                            makeSubject(request.query.country),
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
        _cache.set(key + suffix, result);
        response.send(result);
    }

    function makeURL(query) {
        return `${apiBaseURL}&q=${encodeURIComponent(
            query
        )}&image_type=photo&category=travel+places+building&per_page=3&safesearch=true&orientation=horizontal`;
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
            pageURL: rawObject.pageURL,
            imageURL: rawObject.webformatURL,
            largeImageURL: rawObject.largeImageURL,
            user: rawObject.user,
            userURL: `https://pixabay.com/users/${rawObject.user}-${rawObject.user_id}/`,
            userImageURL: rawObject.userImageURL,
        };
    }

    return {
        set cache(cache) {
            _cache = cache;
        },
        fetchPictures: fetchPictures,
    };
})();

module.exports = picturesAPI;
