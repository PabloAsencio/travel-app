const axios = require('axios');
const apiKey = process.env.PIXABAY_API_KEY;
const apiBaseURL = `https://pixabay.com/api/?key=${apiKey}`;

const picturesAPI = (function () {
    let _cache;
    const suffix = '-picture';

    async function fetchPictures(request, response) {
        const threshold = 5;
        const city = request.query.city;
        const province = request.query.province;
        const country = request.query.country;
        const searchKey = `${city} ${province} ${country}`;
        let pictures = [];
        let newPictures = [];
        const queries = [
            [city, province, country],
            [city, province],
            [city, country],
            [province, country],
            [country],
        ];

        if (_cache.hasKey(searchKey + suffix)) {
            response.send(_cache.get(searchKey + suffix));
        } else {
            try {
                for (const query of queries) {
                    if (pictures.length < threshold) {
                        const queryKey = query.join(' ') + suffix;
                        if (_cache.hasKey(queryKey)) {
                            newPictures = _cache.get(queryKey).pictures;
                            pictures = pictures.concat(newPictures);
                        } else {
                            newPictures = await queryAPI(query);
                            _cache.set(queryKey, { pictures: newPictures });
                            pictures = pictures.concat(newPictures);
                        }
                    } else {
                        break;
                    }
                }

                if (pictures.length > 0) {
                    if (pictures.length > threshold) {
                        pictures = pictures.slice(0, threshold);
                    }
                    _cache.set(searchKey + suffix, { pictures });
                    response.send({ pictures });
                } else {
                    response.status(404).send({
                        error: 'We found no pictures for this city. Sorry!',
                    });
                }
            } catch (error) {
                handleError(error);
            }

            function queryAPI(query) {
                const pictures = axios
                    .get(makeURL(query.join(' ')))
                    .then((apiResponse) => {
                        return handleSuccess(
                            apiResponse,
                            makeSubjectLine(query)
                        );
                    });
                return pictures;
            }

            function handleError(error) {
                let status;
                let message;
                // See https://github.com/axios/axios#handling-errors
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    if (error.response.status == 429) {
                        status = 429;
                        message =
                            'We have reached our limit of pictures to show. Please try again tomorrow.';
                    } else {
                        status = 500;
                        message =
                            'Something went wrong fetching your picture. Please try again later.';
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    status = 504;
                    message =
                        'The picture server did not respond. Please try again later.';
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    status = 500;
                    message =
                        'Something went wrong fetching your picture. Please try again later.';
                }
                console.log(error.config);

                response.status(status).send({ error: message });
            }
        }
    }

    function handleSuccess(apiResponse, subject) {
        const pictures = apiResponse.data.hits.map((hit) =>
            makePictureObject(hit, subject)
        );
        return pictures;
    }

    function makeURL(query) {
        return `${apiBaseURL}&q=${encodeURIComponent(
            query
        )}&image_type=photo&category=travel+places+building&per_page=3&safesearch=true&orientation=horizontal`;
    }

    function makeSubjectLine(query) {
        return query.join(', ');
    }

    function makePictureObject(picture, subject) {
        return {
            subject,
            pageURL: picture.pageURL,
            imageURL: picture.webformatURL,
            largeImageURL: picture.largeImageURL,
            user: picture.user,
            userURL: `https://pixabay.com/users/${picture.user}-${picture.user_id}/`,
            userImageURL: picture.userImageURL,
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
