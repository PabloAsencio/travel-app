const axios = require('axios');
const geonamesBaseURL = 'http://api.geonames.org/search?';
const geonamesUsername = process.env.GEONAMES_USERNAME;

const geonamesAPI = (function () {
    let _countryInfoService;

    function fetchCityList(request, response) {
        const query = getCityQuery(request);

        if (query) {
            const url = geonamesBaseURL + query;
            axios
                .get(url)
                .then((geonamesResponse) => {
                    const places = geonamesResponse.data.geonames;
                    const result = {
                        cities: [],
                    };
                    if (places && places.length > 0) {
                        for (const city of places) {
                            const country = _countryInfoService.getCountryName(
                                city.countryCode
                            );
                            result.cities.push({
                                completeName: `${city.name}${
                                    city.name != city.adminName1
                                        ? ', ' + city.adminName1
                                        : ''
                                }, ${country}`,
                                name: city.name,
                                province: city.adminName1,
                                countryCode: city.countryCode,
                                country: country,
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
        } else {
            response.send({
                cities: { error: 'Please enter a city name' },
            });
        }
    }

    function getCityQuery(request, exact = false) {
        const city = request.query.city;
        let query = '';
        if (city) {
            query = `${exact ? 'name' : 'name_startsWith'}=${
                request.query.city
            }${
                request.query.secondParameter
                    ? '&q=' + request.query.secondParameter
                    : ''
            }${
                request.query.thirdParameter
                    ? '&q=' + request.query.thirdParameter
                    : ''
            }&cities=cities15000&type=json&maxRows=5&lang&=en&orderby=relevance&username=${geonamesUsername}`;
        }
        return query;
    }

    return {
        set countryInfoService(countryInfoService) {
            _countryInfoService = countryInfoService;
        },
        fetchCityList,
    };
})();

module.exports = geonamesAPI;
