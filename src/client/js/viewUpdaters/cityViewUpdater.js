const cityViewUpdater = (function () {
    const cityInputElement = document.getElementById('city');

    function createNewCityList() {
        const listFragment = document.createDocumentFragment();
        const cityList = document.createElement('DIV');
        cityList.setAttribute('id', 'city-autocomplete-list');
        cityList.classList.add('autocomplete-items');
        listFragment.appendChild(cityList);

        function createListItem(city, length) {
            const listItem = document.createElement('DIV');
            if (!city.error) {
                const completeName = city.completeName;
                const typedText = document.createElement('SPAN');
                typedText.classList.add('typedText');
                typedText.textContent = completeName.substr(0, length);
                listItem.appendChild(typedText);
                const completedText = document.createElement('SPAN');
                completedText.classList.add('completedText');
                completedText.textContent = completeName.substr(length);
                listItem.appendChild(completedText);
            } else {
                listItem.textContent = city.error;
            }

            cityList.appendChild(listItem);

            return listItem;
        }

        function render() {
            cityInputElement.parentNode.appendChild(listFragment);
        }

        return {
            createListItem,
            render,
        };
    }

    function setActiveCity(cities, index) {
        removeActiveCity(cities);
        cities[index].classList.add('autocomplete-active');
    }

    function removeActiveCity(cities) {
        for (const city of cities) {
            city.classList.remove('autocomplete-active');
        }
    }

    function clearCityList() {
        const autocompleteLists = document.getElementsByClassName(
            'autocomplete-items'
        );

        for (let index = 0; index < autocompleteLists.length; index++) {
            autocompleteLists[index].parentNode.removeChild(
                autocompleteLists[index]
            );
        }
    }

    function showCityError(message) {
        const errorContainer = document.getElementById(
            'tripSelection__error--city'
        );
        errorContainer.textContent = message;
    }

    function clearCityError() {
        const errorContainer = document.getElementById(
            'tripSelection__error--city'
        );
        errorContainer.textContent = '';
    }

    return {
        createNewCityList,
        setActiveCity,
        clearCityList,
        clearCityError,
        showCityError,
    };
})();

export { cityViewUpdater };
