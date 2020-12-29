const dateController = (function () {
    let _applicationState;
    let _viewUpdater;
    let _dateInputFactory;
    let startDateInput;
    let endDateInput;
    const millisecondsInOneDay = 24 * 3600 * 1000;
    const today = getTodaysDate();
    const tomorrow = new Date(today.getTime() + millisecondsInOneDay);

    function setDateFields() {
        initializeState();
        startDateInput.addEventListener('blur', validateDates);
        endDateInput.addEventListener('blur', validateDates);
        _viewUpdater.updateDateView();
    }

    function validateDates(event) {
        const validatedDates = getValidatedDates(event);
        updateState(validatedDates);
        _viewUpdater.updateDateView();
        return !validatedDates.hasOwnProperty('error');
    }

    function initializeState() {
        startDateInput = _dateInputFactory.createDateInput(
            'startDate',
            'Start Date'
        );
        startDateInput.value = getDateAsString(today);
        _applicationState.startDate = startDateInput.value;
        endDateInput = _dateInputFactory.createDateInput('endDate', 'End Date');
        endDateInput.value = getDateAsString(tomorrow);
        _applicationState.endDate = endDateInput.value;
        _applicationState.duration = 2;
        _applicationState.daysToTrip = 0;
    }

    function getValidatedDates() {
        let startDate = new Date(startDateInput.value);
        let endDate = new Date(endDateInput.value);
        const result = { startDate, endDate };

        if (startDate.getTime() < today.getTime()) {
            result.error = 'The start date cannot be in the past.';
            result.startDate = '';
        } else if (
            endDate.getTime() < startDate.getTime() ||
            endDate.getTime() < today.getTime()
        ) {
            result.error =
                'The end date cannot be earlier than the start date.';
            result.endDate = '';
        }

        return result;
    }

    function updateState(newState) {
        if (!newState.error) {
            const daysToTrip = getDifferenceInDays(today, newState.startDate);
            const duration =
                getDifferenceInDays(newState.startDate, newState.endDate) + 1;
            _applicationState.startDate = getDateAsString(newState.startDate);
            _applicationState.endDate = getDateAsString(newState.startDate);
            _applicationState.daysToTrip = daysToTrip;
            _applicationState.duration = duration;
        } else {
            _applicationState.startDate = newState.startDate
                ? getDateAsString(newState.startDate)
                : '';
            _applicationState.endDate = newState.endDate
                ? getDateAsString(newState.endDate)
                : '';
            _applicationState.daysToTrip = 0;
            _applicationState.duration = 1;
        }
    }

    function getTodaysDate() {
        const now = Date.now();
        const today = new Date(now);
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        return today;
    }

    function getDateAsString(date) {
        return (
            date.getFullYear() +
            '-' +
            (date.getMonth() < 9 ? '0' : '') +
            (date.getMonth() + 1) +
            '-' +
            (date.getDate() < 10 ? '0' : '') +
            date.getDate()
        );
    }

    function getDifferenceInDays(start, end) {
        return Math.floor(
            (end.getTime() - start.getTime()) / millisecondsInOneDay
        );
    }

    return {
        set applicationState(applicationState) {
            _applicationState = applicationState;
        },
        set viewUpdater(viewUpdater) {
            _viewUpdater = viewUpdater;
        },
        set dateInputFactory(dateInputFactory) {
            _dateInputFactory = dateInputFactory;
        },
        start: () => {
            setDateFields();
        },
        reset: initializeState,
        load: updateState,
        areDatesValid: validateDates,
    };
})();

export { dateController };
