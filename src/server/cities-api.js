const axios = require('axios');
const apiBaseURL = 'http://api.geonames.org/search?';
const apiUsername = process.env.GEONAMES_USERNAME;

const citiesAPI = (function () {
    let _countryCodeService;

    function fetchCityList(request, response) {
        const query = getCityQuery(request);

        if (query) {
            const url = apiBaseURL + query;
            axios
                .get(url)
                .then((apiResponse) => {
                    const cities = apiResponse.data.geonames;
                    const result = {
                        cities: [],
                    };
                    if (cities && cities.length > 0) {
                        for (const city of cities) {
                            result.cities.push(createCityObject(city));
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
            // The province and country parameters are expected to be a province/state name and a country respectively
            // but there is no guarantee that they actually are. Province could be a country and vice versa. That's why
            // they are sent to the api as a q parameter instead of a more specific one.
            query = `${exact ? 'name' : 'name_startsWith'}=${
                request.query.city
            }${request.query.province ? '&q=' + request.query.province : ''}${
                request.query.country ? '&q=' + request.query.country : ''
            }&cities=cities15000&type=json&maxRows=5&lang&=en&orderby=relevance&username=${apiUsername}`;
        }
        return query;
    }

    function createCityObject(city) {
        const country = _countryCodeService.getCountryName(city.countryCode);
        return {
            completeName: `${city.name}${
                city.name != city.adminName1 ? ', ' + city.adminName1 : ''
            }, ${country}`,
            city: city.name,
            province: city.adminName1,
            countryCode: city.countryCode,
            country: country,
            longitude: city.lng,
            latitude: city.lat,
        };
    }

    return {
        set countryCodeService(countryCodeService) {
            _countryCodeService = countryCodeService;
        },
        fetchCityList,
    };
})();

module.exports = citiesAPI;
