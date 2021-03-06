const fs = require('fs');

const countryCodeService = (function () {
    const countryCodesFile = fs.readFileSync(
        'src/server/data/country-codes.json'
    );
    const countryCodes = JSON.parse(countryCodesFile);
    function getCountryName(countryCode) {
        return countryCodes[countryCode];
    }

    return {
        getCountryName,
    };
})();

module.exports = countryCodeService;
