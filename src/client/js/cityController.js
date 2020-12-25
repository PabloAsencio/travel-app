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
        const userInput = inputElement.value.trim();
        if (userInput) {
            const city = (await fetchCities(userInput))[0];
            if (city.error) {
                return false;
            } else {
                updateState(city);
                return isValidCity();
            }
        }
        return false;
    }

    async function handleInput() {
        const userInput = inputElement.value.trim();
        clearState();
        _viewUpdater.clearCityList();
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
                            // TODO: Make the server return the complete name as part of the city object
                            const completeName = `${city.name}${
                                city.name != city.province
                                    ? ', ' + city.province
                                    : ''
                            }, ${city.country}`;
                            const cityData = city;
                            listItem.addEventListener('click', () => {
                                inputElement.value = completeName;
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
                        document.forms['tripInfo'].requestSubmit(
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
        _applicationState.city = city.name;
        _applicationState.province = city.province;
        _applicationState.country = city.country;
        _applicationState.countryCode = city.countryCode;
        _applicationState.latitude = city.lat;
        _applicationState.longitude = city.lng;
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
