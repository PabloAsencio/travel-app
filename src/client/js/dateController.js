const createDateController = (applicationState, viewUpdater) => {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const millisecondsInOneDay = 24 * 3600 * 1000;
    const today = getTodaysDate();
    const tomorrow = new Date(today.getTime() + millisecondsInOneDay);

    function setDateFields() {
        initializeState();
        startDateInput.addEventListener('blur', validateDates);
        endDateInput.addEventListener('blur', validateDates);
        viewUpdater.updateDateView();
    }

    function validateDates(event) {
        const validatedDates = getValidatedDates(event);
        updateState(validatedDates);
        viewUpdater.updateDateView();
        return !validatedDates.hasOwnProperty('error');
    }

    function initializeState() {
        startDateInput.value = getDateAsString(today);
        applicationState.startDate = startDateInput.value;
        endDateInput.value = getDateAsString(tomorrow);
        applicationState.endDate = endDateInput.value;
        applicationState.duration = 1;
        applicationState.daysToTrip = 0;
    }

    function getValidatedDates() {
        let startDate = new Date(startDateInput.value.split('-'));
        let endDate = new Date(endDateInput.value.split('-'));
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
            const duration = getDifferenceInDays(
                newState.startDate,
                newState.endDate
            );
            applicationState.startDate = getDateAsString(newState.startDate);
            applicationState.endDate = getDateAsString(newState.startDate);
            applicationState.daysToTrip = daysToTrip;
            applicationState.duration = duration;
        } else {
            applicationState.startDate = newState.startDate
                ? getDateAsString(newState.startDate)
                : '';
            applicationState.endDate = newState.endDate
                ? getDateAsString(newState.endDate)
                : '';
            applicationState.daysToTrip = 0;
            applicationState.duration = 1;
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
        areDatesValid: validateDates,
    };
};

export { createDateController };
