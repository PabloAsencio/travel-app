const axios = require('axios');
const apiBaseURL = 'http://api.geonames.org/search?';
const apiUsername = process.env.GEONAMES_USERNAME;

const citiesAPI = (function () {
    let _countryCodeService;

    function fetchCitiesStartingWith(request, response) {
        const query = getCityQuery(request);

        fetchCities(query, request, response);
    }

    function fetchCitiesWithExactName(request, response) {
        const query = getCityQuery(request, true);

        fetchCities(query, request, response, true);
    }

    function fetchCities(query, request, response, exact = false) {
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
                            if (
                                !exact ||
                                city.name.toLowerCase() ==
                                    request.query.city.toLowerCase()
                            ) {
                                result.cities.push(createCityObject(city));
                            }
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
            query = `${exact ? 'name' : 'name_startsWith'}=${encodeURIComponent(
                request.query.city
            )}${
                request.query.province && request.query.province != 'empty'
                    ? '&q=' + encodeURIComponent(request.query.province)
                    : ''
            }${
                request.query.country
                    ? '&q=' + encodeURIComponent(request.query.country)
                    : ''
            }&cities=cities1000&type=json&maxRows=5&lang=en&searchlang=en&orderby=relevance&username=${apiUsername}`;
        }
        return query;
    }

    function createCityObject(city) {
        const cityName = sanitizeName(capitalize(city.name));
        const province = sanitizeName(capitalize(city.adminName1));
        const country = _countryCodeService.getCountryName(city.countryCode);
        return {
            completeName: `${cityName}${
                city.name != city.adminName1 && city.adminName1
                    ? ', ' + province
                    : ''
            }, ${country}`,
            city: cityName,
            province,
            countryCode: city.countryCode,
            country: sanitizeName(country),
            longitude: city.lng,
            latitude: city.lat,
        };
    }

    // See https://www.digitalocean.com/community/tutorials/js-capitalizing-strings
    function capitalize(name) {
        return name.replace(/\p{Script_Extensions=Latin}[^\s\-]*/gu, (word) =>
            word.replace(/^\p{Script_Extensions=Latin}/u, (firstCharacter) =>
                firstCharacter.toUpperCase()
            )
        );
    }

    function sanitizeName(province) {
        if (!province) {
            return 'empty';
        } else {
            return province
                .replace(/,/g, '')
                .replace(/\((\p{Script_Extensions=Latin})+\)/gu, '')
                .replace(/\[(\p{Script_Extensions=Latin})+\]/gu, '')
                .replace(/\s(\s)+/g, ' ');
        }
    }

    return {
        set countryCodeService(countryCodeService) {
            _countryCodeService = countryCodeService;
        },
        fetchCitiesStartingWith,
        fetchCitiesWithExactName,
    };
})();

module.exports = citiesAPI;
