const createDateController = (appState, viewUpdater) => {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const millisecondsInOneDay = 24 * 3600 * 1000;
    const today = getTodaysDate();
    const tomorrow = new Date(today.getTime() + millisecondsInOneDay);

    function setDateFields() {
        initializeState();
        startDateInput.addEventListener('blur', handleDateChange);
        endDateInput.addEventListener('blur', handleDateChange);
        viewUpdater.updateDateView();
    }

    function handleDateChange(event) {
        const validatedDates = getValidatedDates(event);
        updateState(validatedDates);
        viewUpdater.updateDateView();
    }

    function initializeState() {
        startDateInput.value = getDateAsString(today);
        appState.startDate = startDateInput.value;
        endDateInput.value = getDateAsString(tomorrow);
        appState.endDate = endDateInput.value;
        appState.duration = 1;
        appState.daysToTrip = 0;
    }

    function getValidatedDates() {
        let startDate = new Date(startDateInput.value.split('-'));
        let endDate = new Date(endDateInput.value.split('-'));
        const result = { startDate, endDate };

        if (startDate.getTime() < today.getTime()) {
            result.error = 'The start date cannot be in the past.';
            result.startDate = null;
        } else if (
            endDate.getTime() < startDate.getTime() ||
            endDate.getTime() < today.getTime()
        ) {
            result.error =
                'The end date cannot be earlier than the start date.';
            result.endDate = null;
        }

        return result;
    }

    function updateState(newState) {
        if (!newState.error) {
            const daysToTrip = getDifferenceInDays(today, newState.startDate);
            const duration = getDifferenceInDays(
                newState.startDate,
                newState.endDate
            );
            appState.startDate = getDateAsString(newState.startDate);
            appState.endDate = getDateAsString(newState.startDate);
            appState.daysToTrip = daysToTrip;
            appState.duration = duration;
        } else {
            appState.startDate = newState.startDate
                ? getDateAsString(newState.startDate)
                : '';
            appState.endDate = newState.endDate
                ? getDateAsString(newState.endDate)
                : '';
            appState.daysToTrip = 0;
            appState.duration = 1;
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
        start: () => {
            setDateFields();
        },
        reset: initializeState,
        load: updateState,
    };
};

export { createDateController };
