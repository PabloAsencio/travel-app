// This script is based on the example at https://www.w3schools.com/howto/howto_js_autocomplete.asp
const cityController = (function () {
    let _apiService;
    let _viewUpdater;
    let _applicationState;
    let _currentFocus;
    const inputElement = document.getElementById('city');

    function setAPIService(apiService) {
        _apiService = apiService;
    }

    function setAppState(applicationState) {
        _applicationState = applicationState;
    }

    function setViewUpdater(viewUpdater) {
        _viewUpdater = viewUpdater;
    }

    function start() {
        if (_viewUpdater && _apiService && _applicationState) {
            inputElement.addEventListener('input', handleInput);
            inputElement.addEventListener('keydown', navigateList);
            document.addEventListener('click', _viewUpdater.clearCityList);
        } else {
            throw new Error(
                'DropdownListController cannot start: missing dependencies'
            );
        }
    }

    function isValidCity() {
        return _applicationState.city &&
            _applicationState.province &&
            _applicationState.country &&
            _applicationState.countryCode &&
            _applicationState.latitude &&
            _applicationState.longitude
            ? true
            : false;
    }

    async function fetchCity() {
        _viewUpdater.clearCityError();
        const userInput = inputElement.value.trim();
        if (userInput) {
            let city;
            const [cityName, province, country] = userInput
                .split(',')
                .map((item) => item.trim());
            city = (
                await _apiService
                    .fetchCity(cityName, province, country)
                    .then((response) => response.json())
                    .then((data) => data.cities)
                    .catch((error) => [{ error: error.message }])
            )[0];

            if (city.error) {
                _viewUpdater.showCityError(city.error);
                return false;
            } else {
                updateState(city);
                return isValidCity();
            }
        }
        _viewUpdater.showCityError('Please enter the name of a city');
        return false;
    }

    async function handleInput() {
        const userInput = inputElement.value.trim();
        clearState();
        _viewUpdater.clearCityList();
        _viewUpdater.clearCityError();
        if (userInput) {
            _currentFocus = -1;
            const cities = await fetchCities(userInput);
            if (cities.length > 0) {
                const cityList = _viewUpdater.createNewCityList();

                for (const city of cities) {
                    const listItem = cityList.createListItem(
                        city,
                        userInput.length
                    );
                    if (!city.error) {
                        // Using an IIFE to prevent appState from being updated with the wrong data
                        (function () {
                            const cityData = city;
                            listItem.addEventListener('click', () => {
                                inputElement.value = cityData.completeName;
                                updateState(cityData);
                                _viewUpdater.clearCityList();
                            });
                        })();
                    } else {
                        listItem.addEventListener('click', () => {
                            _viewUpdater.clearCityList();
                        });
                    }
                }

                if (userInput == inputElement.value.trim()) {
                    cityList.render();
                }
            }
        }
    }

    function navigateList(event) {
        const autocompleteList = document.getElementById(
            'city-autocomplete-list'
        );
        if (autocompleteList) {
            const cities = autocompleteList.getElementsByTagName('div');
            switch (event.key) {
                case 'Down':
                case 'ArrowDown':
                    _currentFocus++;
                    setActiveCity(cities);
                    break;
                case 'Up':
                case 'ArrowUp':
                    if (_currentFocus > -1) _currentFocus--;
                    setActiveCity(cities);
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (_currentFocus > -1 && cities.length > _currentFocus) {
                        cities[_currentFocus].click();
                    } else {
                        document.forms['tripSelection__form'].requestSubmit(
                            document.getElementById('submit')
                        );
                        _viewUpdater.clearCityList();
                    }
                    break;
                case 'Escape':
                    _viewUpdater.clearCityList();
                    break;
            }
        } else {
            if (event.key == 'ArrowDown' || event.key == 'Down') {
                handleInput();
            }
        }
    }
    function clearState() {
        _applicationState.city = '';
        _applicationState.province = '';
        _applicationState.country = '';
        _applicationState.countryCode = '';
        _applicationState.latitude = '';
        _applicationState.longitude = '';
    }

    function updateState(city) {
        _applicationState.city = city.city;
        _applicationState.province = city.province;
        _applicationState.country = city.country;
        _applicationState.countryCode = city.countryCode;
        _applicationState.latitude = city.latitude;
        _applicationState.longitude = city.longitude;
    }

    function setActiveCity(cities) {
        if (cities) {
            if (_currentFocus >= cities.length) {
                _currentFocus = 0;
            } else if (_currentFocus < 0) {
                _currentFocus = cities.length - 1;
            }
            _viewUpdater.setActiveCity(cities, _currentFocus);
        }
    }

    const fetchCities = (userInput) => {
        let cities;
        const [city, province, country] = userInput
            .split(',')
            .map((item) => item.trim());
        cities = _apiService
            .fetchCities(city, province, country)
            .then((response) => response.json())
            .then((data) => data.cities)
            .catch((error) => [{ error: error.message }]);
        return cities;
    };

    return {
        set apiService(apiService) {
            setAPIService(apiService);
        },
        set appState(appState) {
            setAppState(appState);
        },
        set viewUpdater(viewUpdater) {
            setViewUpdater(viewUpdater);
        },
        start,
        isValidCity,
        fetchCity,
    };
})();

export { cityController };
