const dateInputFactory = (function () {
    let _viewUpdater;
    function createDateInput(id, labelText) {
        // test whether a new date input falls back to a text input or not
        const test = document.createElement('INPUT');

        try {
            test.type = 'date';
        } catch (e) {
            console.log(e.description);
        }

        if (test.type === 'text') {
            return createFallbackDateInput(id, labelText);
        } else {
            return createNativeDateInput(id, labelText);
        }
    }

    function createNativeDateInput(id, labelText) {
        _viewUpdater.renderNativeDateInput(id, labelText);
        const input = document.getElementById('tripSelection__' + id);

        function addEventListener(event, callback) {
            input.addEventListener(event, callback);
        }
        return {
            get value() {
                return input.value;
            },
            set value(value) {
                input.value = value;
            },
            addEventListener,
        };
    }

    // This fallback date input is based on
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date#Handling_browser_support
    function createFallbackDateInput(id, labelText) {
        _viewUpdater.renderFallbackDateInput(id, labelText);
        // define variables
        const fallBackDateInput = document.getElementById(
            'tripSelection__' + id
        );
        const yearSelect = document.getElementById(
            'tripSelection__' + id + '--year'
        );
        const monthSelect = document.getElementById(
            'tripSelection__' + id + '--month'
        );
        const daySelect = document.getElementById(
            'tripSelection__' + id + '--day'
        );
        let previousDay = 1;

        // populate the days and years dynamically
        _viewUpdater.populateYears(id);
        populateDays();

        yearSelect.addEventListener('change', populateDays);
        monthSelect.addEventListener('change', populateDays);
        daySelect.addEventListener('change', () => {
            previousDay = Number.parseInt(daySelect.value, 10);
        });

        function getValue() {
            console.log(
                `${yearSelect.value}-${monthSelect.value}-${daySelect.value}`
            );
            return `${yearSelect.value}-${monthSelect.value}-${daySelect.value}`;
        }

        function setValue(value) {
            const [year, month, day] = value.split('-');
            yearSelect.value = year;
            monthSelect.value = month;
            populateDays();
            daySelect.value = day;
        }

        function addEventListener(event, callback) {
            fallBackDateInput.addEventListener(event, callback, true);
        }

        function populateDays() {
            _viewUpdater.populateDays(id, previousDay);
        }

        return {
            get value() {
                return getValue();
            },
            set value(value) {
                setValue(value);
            },
            addEventListener,
        };
    }

    return {
        set viewUpdater(viewUpdater) {
            _viewUpdater = viewUpdater;
        },
        createDateInput,
    };
})();

export { dateInputFactory };
