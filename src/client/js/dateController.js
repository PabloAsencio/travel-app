const createDateController = (appState) => {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const millisecondsInOneDay = 24 * 3600 * 1000;
    const now = Date.now();
    const today = new Date(now);
    const tomorrow = new Date(now + millisecondsInOneDay);

    function setDateFields() {
        startDateInput.value = getDateAsString(today);
        appState.startDate = getDateAsString(today);
        endDateInput.value = getDateAsString(tomorrow);
        appState.endDate = getDateAsString(tomorrow);
        startDateInput.addEventListener('input', handleDateChange);
        endDateInput.addEventListener('input', handleDateChange);
    }

    function handleDateChange(event) {
        let startDate = new Date(startDateInput.value.split('-'));
        let endDate = new Date(endDateInput.value.split('-'));

        if (startDate.getTime() < today.getTime()) {
            startDateInput.value = getDateAsString(today);
            startDate = today;
        }
        if (endDate.getTime() < startDate.getTime()) {
            if (event.target === startDateInput) {
                endDate = new Date(startDate.getTime() + millisecondsInOneDay);
                endDateInput.value = getDateAsString(endDate);
            } else {
                startDate = new Date(endDate.getTime() - millisecondsInOneDay);
                startDateInput.value = getDateAsString(startDate);
            }
        }
        const daysToTrip = getDifferenceInDays(today, startDate);
        const duration = getDifferenceInDays(startDate, endDate);

        appState.startDate = startDateInput.value;
        appState.endDate = endDateInput.value;
        appState.daysToTrip = daysToTrip;
        appState.duration = duration;

        document.getElementById('daysToTrip').textContent =
            daysToTrip + ' day' + (daysToTrip != 1 ? 's' : '');
        document.getElementById('duration').textContent =
            duration + 1 + ' day' + (duration + 1 != 1 ? 's' : '');
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
    };
};

export { createDateController };
