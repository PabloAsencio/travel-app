const dateViewUpdater = (function () {
    function renderNativeDateInput(id, labelText) {
        const container = document.getElementById(
            'tripSelection__container--' + id
        );
        const fragment = document.createDocumentFragment();
        const label = document.createElement('LABEL');
        label.setAttribute('for', 'tripSelection__' + id);
        label.classList.add('form__label');
        label.textContent = labelText;
        fragment.appendChild(label);
        const input = document.createElement('INPUT');
        input.type = 'date';
        input.id = 'tripSelection__' + id;
        fragment.appendChild(input);
        container.appendChild(fragment);
    }

    // This fallback date input is based on
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date#Handling_browser_support
    function renderFallbackDateInput(id, labelText) {
        const container = document.getElementById(
            'tripSelection__container--' + id
        );
        const fragment = document.createDocumentFragment();
        const label = document.createElement('P');
        label.classList.add('form__label');
        label.classList.add('form__label--fallback');
        label.textContent = labelText;
        fragment.appendChild(label);
        const fallBackDateInput = document.createElement('DIV');
        fallBackDateInput.id = 'tripSelection__' + id;
        fallBackDateInput.classList.add('form__date--fallback');
        fallBackDateInput.innerHTML = `
          <span class="form__select">
            <label for="tripSelection__${id}--day" class="screen-reader-only">Day:</label>
            <select id="tripSelection__${id}--day"" name="tripSelection__${id}--day"">
            </select>
          </span>
          <span class="form__select">
            <label for="tripSelection__${id}--month" class="screen-reader-only">Month:</label>
            <select id="tripSelection__${id}--month" name="tripSelection__${id}--month">
              <option value="01" selected>January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </span>
          <span class="form__select">
            <label for="tripSelection__${id}--year" class="screen-reader-only">Year:</label>
            <select id="tripSelection__${id}--year" name="tripSelection__${id}--year">
            </select>
          </span>`;

        fragment.appendChild(fallBackDateInput);
        container.appendChild(fragment);
    }

    function populateYears(id) {
        const yearSelect = document.getElementById(
            `tripSelection__${id}--year`
        );
        const date = new Date();
        const year = date.getFullYear();
        const fragment = document.createDocumentFragment();

        // Make this year, and the 4 years after it available in the year <select>
        for (let offset = 0; offset < 5; offset++) {
            const option = document.createElement('OPTION');
            option.textContent = year + offset;
            option.value = year + offset;
            fragment.appendChild(option);
        }

        yearSelect.appendChild(fragment);
    }

    function populateDays(id, previousDay) {
        const year = document.getElementById(`tripSelection__${id}--year`)
            .value;
        const month = document.getElementById(`tripSelection__${id}--month`)
            .value;
        const daySelect = document.getElementById(`tripSelection__${id}--day`);
        clearDayList(daySelect);

        const daysInMonth = computeDaysInMonth(month, year);

        renderDayList(daySelect, daysInMonth);

        restorePreviousDay(daySelect, previousDay);
    }

    function clearDayList(daySelect) {
        // delete the current set of <option> elements out of the
        // day <select>, ready for the next set to be injected
        while (daySelect.firstChild) {
            daySelect.removeChild(daySelect.firstChild);
        }
    }

    function computeDaysInMonth(month, year) {
        let daysInMonth;
        // 31 or 30 days?
        if (
            month === '04' ||
            month === '06' ||
            month === '09' ||
            month === '11'
        ) {
            daysInMonth = 30;
        } else if (month === '02') {
            // If month is February, calculate whether it is a leap year or not
            const isLeapYear = new Date(year, 1, 29).getMonth() == 1;
            isLeapYear ? (daysInMonth = 29) : (daysInMonth = 28);
        } else {
            daysInMonth = 31;
        }
        return daysInMonth;
    }

    function renderDayList(daySelect, daysInMonth) {
        for (let day = 1; day <= daysInMonth; day++) {
            var option = document.createElement('option');
            option.textContent = day;
            option.value = addLeadingZero(day);
            daySelect.appendChild(option);
        }
    }

    function restorePreviousDay(daySelect, previousDay) {
        // if previous day has already been set, set daySelect's value
        // to that day, to avoid the day jumping back to 1 when you
        // change the year
        if (previousDay) {
            daySelect.value = addLeadingZero(previousDay);

            // If the previous day was set to a high number, say 31, and then
            // you chose a month with less total days in it (e.g. February),
            // this part of the code ensures that the highest day available
            // is selected, rather than showing a blank daySelect
            if (daySelect.value === '') {
                daySelect.value = addLeadingZero(previousDay) - 1;
            }

            if (daySelect.value === '') {
                daySelect.value = addLeadingZero(previousDay) - 2;
            }

            if (daySelect.value === '') {
                daySelect.value = addLeadingZero(previousDay) - 3;
            }
        }
    }

    function addLeadingZero(day) {
        return day < 10 ? '0' + day : day;
    }

    function showDateError(id, message) {
        const errorContainer = document.getElementById(
            'tripSelection__error--' + id
        );
        errorContainer.textContent = message;
    }

    function clearDateErrors() {
        const startDateError = document.getElementById(
            'tripSelection__error--startDate'
        );
        const endDateError = document.getElementById(
            'tripSelection__error--endDate'
        );
        startDateError.textContent = '';
        endDateError.textContent = '';
    }

    return {
        renderNativeDateInput,
        renderFallbackDateInput,
        populateYears,
        populateDays,
        showDateError,
        clearDateErrors,
    };
})();

export { dateViewUpdater };
