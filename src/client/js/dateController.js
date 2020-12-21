const createDateController = (appState) => {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const millisecondsInOneDay = 24 * 3600 * 1000;
    const now = Date.now();
    const today = new Date(now);
    const todayString =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();
    const tomorrow = new Date(now + millisecondsInOneDay);
    const tomorrowString =
        tomorrow.getFullYear() +
        '-' +
        (tomorrow.getMonth() + 1) +
        '-' +
        tomorrow.getDate();

    function setDateFields() {
        startDateInput.value = todayString;
        appState.startDate = todayString;
        endDateInput.value = tomorrowString;
        appState.endDate = tomorrowString;
        startDateInput.addEventListener('input', handleDateChange);
        endDateInput.addEventListener('input', handleDateChange);
    }

    function handleDateChange(event) {
        let startDate = new Date(startDateInput.value.split('-'));
        let endDate = new Date(endDateInput.value.split('-'));

        if (startDate.getTime() < today.getTime()) {
            startDateInput.value = todayString;
            startDate = today;
        }
        if (endDate.getTime() < startDate.getTime()) {
            if (event.target === startDateInput) {
                endDate = new Date(startDate.getTime() + millisecondsInOneDay);
                endDateInput.value =
                    endDate.getFullYear() +
                    '-' +
                    (endDate.getMonth() + 1) +
                    '-' +
                    endDate.getDate();
            } else {
                startDate = new Date(endDate.getTime() - millisecondsInOneDay);
                startDateInput.value =
                    startDate.getFullYear() +
                    '-' +
                    (startDate.getMonth() + 1) +
                    '-' +
                    startDate.getDate();
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
