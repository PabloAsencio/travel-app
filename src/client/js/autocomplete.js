// This script is based on the example at https://www.w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete(inputElement) {
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
        country.value = '';
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
                if (value == inputElement.value) {
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
}

function clearCityList() {
    const autocompleteLists = document.getElementsByClassName(
        'autocomplete-items'
    );
    for (const list of autocompleteLists) {
        list.parentNode.removeChild(list);
    }
}

function removeActive(cities) {
    for (const city of cities) {
        city.classList.remove('autocomplete-active');
    }
}

const fetchCities = async (userInput) => {
    // TODO: Remove references to localhost from final version
    let url = 'http://localhost:8082/listCities?city=';
    const cityInfo = userInput.split(',').map((item) => item.trim());
    let city;
    let secondParameter;
    let thirdParameter;
    if (cityInfo.length > 3) {
        return [
            {
                error: 'No results',
            },
        ];
    } else if (cityInfo.length >= 1) {
        city = encodeURIComponent(cityInfo[0]);
        url += city;
        if (cityInfo.length >= 2) {
            secondParameter = encodeURIComponent(cityInfo[1]);
            url += '&secondParameter=' + secondParameter;
            if (cityInfo.length === 3) {
                thirdParameter = encodeURIComponent(cityInfo[2]);
                url += '&thirdParameter=' + thirdParameter;
            }
        }
    } else {
        return [{}];
    }
    const response = await fetch(url);
    try {
        const serverResponse = await response.json();
        return serverResponse.cities;
    } catch (error) {
        console.log(error);
        return [{ error: 'No results' }];
    }
};

export { autocomplete };
