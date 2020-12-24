// This script is based on the example at https://www.w3schools.com/howto/howto_js_autocomplete.asp
const cityDropdownListController = (function () {
    let _apiService;
    let _viewUpdater;
    let _appState;
    let _currentFocus;
    const inputElement = document.getElementById('city');

    function setAPIService(apiService) {
        _apiService = apiService;
    }

    function setAppState(appState) {
        _appState = appState;
    }

    function setViewUpdater(viewUpdater) {
        _viewUpdater = viewUpdater;
    }

    function start() {
        if (_viewUpdater && _apiService && _appState) {
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
        return _appState.city &&
            _appState.province &&
            _appState.country &&
            _appState.countryCode &&
            _appState.latitude &&
            _appState.longitude
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
        _appState.city = '';
        _appState.province = '';
        _appState.country = '';
        _appState.countryCode = '';
        _appState.latitude = '';
        _appState.longitude = '';
    }

    function updateState(city) {
        _appState.city = city.name;
        _appState.province = city.province;
        _appState.country = city.country;
        _appState.countryCode = city.countryCode;
        _appState.latitude = city.lat;
        _appState.longitude = city.lng;
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

/* function autocomplete(inputElement, apiService) {
    inputElement.addEventListener('input', handleInput);
    inputElement.addEventListener('keydown', navigateList);
    document.addEventListener('click', clearCityList);

    let currentFocus;

    async function handleInput() {
        const value = inputElement.value.trim();
        const country = document.getElementById('country');
        const latitude = document.getElementById('latitude');
        const longitude = document.getElementById('longitude');

        /* If the value of the city field changes, we cannot be
        sure that the values of the country, latitude and
        longitude fields still match the user choice. We'd
        rather have no data than bad data.
         */
/* country.value = '';
        latitude.value = '';
        longitude.value = '';
        clearCityList();
        if (value) {
            currentFocus = -1;
            const cities = await fetchCities(value);
            if (cities.length > 0) {
                const listFragment = document.createDocumentFragment();
                const cityList = document.createElement('DIV');
                cityList.setAttribute('id', 'city-autocomplete-list');
                cityList.classList.add('autocomplete-items');
                listFragment.appendChild(cityList);

                for (const city of cities) {
                    const listItem = document.createElement('DIV');
                    if (!city.error) {
                        const completeName = `${city.name}${
                            city.name != city.province
                                ? ', ' + city.province
                                : ''
                        }, ${city.country}`;
                        const typedText = document.createElement('SPAN');
                        typedText.classList.add('typedText');
                        typedText.textContent = completeName.substr(
                            0,
                            value.length
                        );
                        listItem.appendChild(typedText);
                        const completedText = document.createElement('SPAN');
                        completedText.classList.add('completedText');
                        completedText.textContent = completeName.substr(
                            value.length
                        );
                        listItem.appendChild(completedText);
                        const hiddenInput = document.createElement('INPUT');
                        hiddenInput.setAttribute('type', 'hidden');
                        hiddenInput.setAttribute('value', completeName);
                        listItem.appendChild(hiddenInput);

                        listItem.addEventListener('click', () => {
                            inputElement.value = hiddenInput.value;
                            country.value = city.countryCode;
                            latitude.value = city.lat;
                            longitude.value = city.lng;
                            clearCityList();
                        });
                    } else {
                        listItem.textContent = city.error;
                        listItem.addEventListener('click', () => {
                            clearCityList();
                        });
                    }

                    cityList.appendChild(listItem);
                }
                /* The value may have become stale since the fetch function was called. Update the UI only if the live value is still the same with which the function was called*/
/* if (value == inputElement.value) {
                    clearCityList();
                    inputElement.parentNode.appendChild(listFragment);
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
                    currentFocus++;
                    addActive(cities);
                    break;
                case 'Up':
                case 'ArrowUp':
                    if (currentFocus > -1) currentFocus--;
                    addActive(cities);
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (currentFocus > -1 && cities.length > currentFocus) {
                        cities[currentFocus].click();
                    } else {
                        document.forms['tripInfo'].requestSubmit(
                            document.getElementById('submit')
                        );
                    }
                    break;
                case 'Escape':
                    clearCityList();
                    break;
            }
        } else {
            if (event.key == 'ArrowDown' || event.key == 'Down') {
                handleInput();
            }
        }
    }

    function addActive(cities) {
        if (cities) {
            removeActive(cities);
            if (currentFocus >= cities.length) {
                currentFocus = 0;
            } else if (currentFocus < 0) {
                currentFocus = cities.length - 1;
            }

            cities[currentFocus].classList.add('autocomplete-active');
        }
    }
    function clearCityList() {
        const autocompleteLists = document.getElementsByClassName(
            'autocomplete-items'
        );
        for (const list of autocompleteLists) {
            list.parentNode.removeChild(list);
        }
    }

    const fetchCities = (userInput) => {
        let cities;
        const [city, province, country] = userInput
            .split(',')
            .map((item) => item.trim());

        cities = apiService
            .fetchCities(city, province, country)
            .then((response) => response.json())
            .then((data) => data.cities)
            .catch((error) => [{ error: error.message }]);
        return cities;
    };
} */

export { cityDropdownListController };
