const axios = require('axios');
const geonamesBaseURL = 'http://api.geonames.org/search?';
const geonamesUsername = process.env.GEONAMES_USERNAME;

const geonamesAPI = (function () {
    let _countryInfoService;

    function fetchCityList(request, response) {
        const url = `${geonamesBaseURL}name_startsWith=${request.query.city}${
            request.query.secondParameter
                ? '&q=' + request.query.secondParameter
                : ''
        }${
            request.query.thirdParameter
                ? '&q=' + request.query.thirdParameter
                : ''
        }&cities=cities15000&type=json&maxRows=5&lang&=en&orderby=relevance&username=${geonamesUsername}`;
        axios
            .get(url)
            .then((geonamesResponse) => {
                const places = geonamesResponse.data.geonames;
                const result = {
                    cities: [],
                };
                if (places && places.length > 0) {
                    for (const city of places) {
                        result.cities.push({
                            name: city.name,
                            province: city.adminName1,
                            countryCode: city.countryCode,
                            country: _countryInfoService.getCountryName(
                                city.countryCode
                            ),
                            lng: city.lng,
                            lat: city.lat,
                        });
                    }
                } else {
                    result.cities.push({ error: 'No results' });
                }
                response.send(result);
            })
            .catch((error) => {
                console.log(error);
                response.send({
                    cities: { error: 'No results' },
                });
            });
    }

    return {
        set countryInfoService(countryInfoService) {
            _countryInfoService = countryInfoService;
        },
        fetchCityList,
    };
})();

module.exports = geonamesAPI;
