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
                    const completeName = `${city.name}${
                        city.name != city.province ? ', ' + city.province : ''
                    }, ${city.country}`;
                    const listItem = document.createElement('DIV');
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

                    cityList.appendChild(listItem);
                }
                /* This second call is necessary: if the user
                types fast, the call to clearCityList above will
                happen before the list for the previous input
                has had time to be fetched and rendered. For the
                dropdown functionality to work as expected we
                have to make sure that any time we render a new
                list all previous ones are gone.*/
                clearCityList();
                inputElement.parentNode.appendChild(listFragment);
            }
        }
    }

    function navigateList(event) {
        console.log('Keydown event triggered!');
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
                        document.getElementById('tripInfo').submit();
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
    const response = await fetch(
        '/listCities?city=' + encodeURIComponent(userInput)
    );
    try {
        const serverResponse = await response.json();
        return serverResponse.cities;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export { autocomplete };
