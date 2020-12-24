const applicationState = (function () {
    let _city = '';
    let _province = '';
    let _country = '';
    let _countryCode = '';
    let _latitude = '';
    let _longitude = '';
    let _startDate = '';
    let _endDate = '';
    let _duration = 1;
    let _daysToTrip = 0;

    function getCity() {
        return _city;
    }

    function setCity(city) {
        if (validatePlaceName(city)) {
            _city = city;
        } else {
            city = '';
        }
    }

    function getProvince() {
        return _province;
    }

    function setProvince(province) {
        if (validatePlaceName(province)) {
            _province = province;
        } else {
            _province = '';
        }
    }

    function getCountry(country) {
        return _country;
    }

    function setCountry(country) {
        if (validatePlaceName(country)) {
            _country = country;
        } else {
            _country = '';
        }
    }

    function getCountryCode(countryCode) {
        return _countryCode;
    }

    function setCountryCode(countryCode) {
        if (validateCountryCode(countryCode)) {
            _countryCode = country;
        } else {
            _countryCode = '';
        }
    }

    function getLatitude() {
        return _latitude;
    }

    function setLatitude(latitude) {
        if (validateCoordinate(latitude)) {
            _latitude = latitude;
        } else {
            _latitude = '';
        }
    }

    function getLongitude() {
        return _longitude;
    }

    function setLongitude(longitude) {
        if (validateCoordinate(longitude)) {
            _longitude = longitude;
        } else {
            _longitude = '';
        }
    }

    function getStartDate() {
        return _startDate;
    }

    function setStartDate(startDate) {
        if (validateDateFormat(startDate)) {
            _startDate = startDate;
        } else {
            _startDate = '';
        }
    }

    function getEndDate() {
        return _endDate;
    }

    function setEndDate(endDate) {
        if (validateDateFormat(endDate)) {
            _endDate = endDate;
        } else {
            _endDate = '';
        }
    }

    function getDuration() {
        return _duration;
    }

    function setDuration(duration) {
        if (Number.isInteger(duration) && duration > 0) {
            _duration = duration;
        } else {
            duration = 1;
        }
    }

    function getDaysToTrip() {
        return _daysToTrip;
    }

    function setDaysToTrip(daysToTrip) {
        if (Number.isInteger(daysToTrip) && duration > 0) {
            _daysToTrip = daysToTrip;
        } else {
            _daysToTrip = 0;
        }
    }

    function validatePlaceName(placeName) {
        return /^[^0-9^\.\\~\$%\\\/(\)\[\]\{\}|@#\*"=\?!+`´\^_:;,<>]*$/.test(
            placeName
        );
    }

    function validateCountryCode(countryCode) {
        return /^[A-Za-z]{2}$/.test(countryCode);
    }

    function validateDateFormat(date) {
        return /^\d{4}-\d{2}-\d{2}$/.test(date);
    }

    function validateCoordinate(coordinate) {
        return /^(-)?(1)?\d{1,2}(\.(\d)+)?$/.test(coordinate);
    }

    function reset() {
        _city = '';
        _province = '';
        _country = '';
        _latitude = '';
        _longitude = '';
        _startDate = '';
        _endDate = '';
        _duration = 1;
        _daysToTrip = 0;
    }

    return {
        get city() {
            return getCity();
        },
        set city(city) {
            setCity(city);
        },
        get province() {
            return getProvince();
        },
        set province(province) {
            setProvince(province);
        },
        get country() {
            return getCountry();
        },
        set country(country) {
            setCountry(country);
        },
        get countryCode() {
            return getCountryCode();
        },
        set countryCode(countryCode) {
            setCountryCode(countryCode);
        },
        get latitude() {
            return getLatitude();
        },
        set latitude(latitude) {
            setLatitude(latitude);
        },
        get longitude() {
            return getLongitude();
        },
        set longitude(longitude) {
            setLongitude(longitude);
        },
        get startDate() {
            return getStartDate();
        },
        set startDate(startDate) {
            setStartDate(startDate);
        },
        get endDate() {
            return getEndDate();
        },
        set endDate(endDate) {
            setEndDate(endDate);
        },
        get duration() {
            return getDuration();
        },
        set duration(duration) {
            return setDuration(duration);
        },
        get daysToTrip() {
            return getDaysToTrip();
        },
        set daysToTrip(daysToTrip) {
            setDaysToTrip(daysToTrip);
        },
        reset,
    };
})();

export { applicationState };
