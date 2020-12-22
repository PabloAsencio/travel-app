// TODO: Replace direct import with injected component
import { updateDate } from './uiUpdater';

const createDateController = (appState) => {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const millisecondsInOneDay = 24 * 3600 * 1000;
    const today = getTodaysDate();
    const tomorrow = new Date(today.getTime() + millisecondsInOneDay);

    function setDateFields() {
        initializeState();
        startDateInput.addEventListener('blur', handleDateChange);
        endDateInput.addEventListener('blur', handleDateChange);
    }

    function handleDateChange(event) {
        const validatedDates = getValidatedDates(event);
        updateState(validatedDates);
    }

    function initializeState() {
        startDateInput.value = getDateAsString(today);
        appState.startDate = startDateInput.value;
        endDateInput.value = getDateAsString(tomorrow);
        appState.endDate = endDateInput.value;
        appState.duration = 1;
        appState.daysToTrip = 0;
        updateDate(0, 1); // Update the ui with the initial values for daysToTrip and duration
    }

    function getValidatedDates(event) {
        let startDate = new Date(startDateInput.value.split('-'));
        let endDate = new Date(endDateInput.value.split('-'));

        if (startDate.getTime() < today.getTime()) {
            startDate = today;
        }
        if (endDate.getTime() < startDate.getTime()) {
            if (
                event.target === startDateInput ||
                endDate.getTime() < today.getTime()
            ) {
                endDate = new Date(startDate.getTime() + millisecondsInOneDay);
            } else {
                startDate = new Date(endDate.getTime() - millisecondsInOneDay);
            }
        }

        return {
            startDate: getDateAsString(startDate),
            endDate: getDateAsString(endDate),
        };
    }

    function updateState(newState) {
        const startDate = new Date(newState.startDate);
        const endDate = new Date(newState.endDate);
        const daysToTrip = getDifferenceInDays(today, startDate);
        const duration = getDifferenceInDays(startDate, endDate);
        startDateInput.value = newState.startDate;
        endDateInput.value = newState.endDate;
        appState.startDate = newState.startDate;
        appState.endDate = newState.startDate;
        appState.daysToTrip = daysToTrip;
        appState.duration = duration;
        updateDate(daysToTrip, duration);
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
