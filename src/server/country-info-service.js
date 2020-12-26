const fs = require('fs');

const countryInfoService = (function () {
    const countryCodesFile = fs.readFileSync(
        'src/server/data/country-codes.json'
    );
    const countryCodes = JSON.parse(countryCodesFile);
    const stateCodesFile = fs.readFileSync(
        'src/server/data/weatherbit-state-codes.json'
    );
    const stateCodes = JSON.parse(stateCodesFile);
    function getCountryName(countryCode) {
        return countryCodes[countryCode];
    }

    function getStateName(countryCode, stateCode) {
        return stateCodes[countryCode][stateCode] || stateCode;
    }

    return {
        getCountryName,
        getStateName,
    };
})();

module.exports = countryInfoService;
