const millisecondsInOneDay = 24 * 3600 * 1000;
const now = Date.now();
const today = new Date(now);
const todayString =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const tomorrow = new Date(now + millisecondsInOneDay);
const tomorrowString =
    tomorrow.getFullYear() +
    '-' +
    (tomorrow.getMonth() + 1) +
    '-' +
    tomorrow.getDate();

function setDateFields(startDateInput, endDateInput) {
    startDateInput.value = todayString;
    endDateInput.value = tomorrowString;
    startDateInput.addEventListener('input', updateDuration);
    endDateInput.addEventListener('input', updateDuration);
}

function updateDuration(event) {
    const startDateInputField = document.getElementById('start');
    const endDateInputField = document.getElementById('end');
    let startDate = new Date(startDateInputField.value.split('-'));
    if (startDate.getTime() < today.getTime()) {
        startDateInputField.value = todayString;
        startDate = today;
    }
    let endDate = new Date(endDateInputField.value.split('-'));
    if (endDate.getTime() < startDate.getTime()) {
        if (event.target === startDateInputField) {
            endDate = new Date(startDate.getTime() + millisecondsInOneDay);
            endDateInputField.value =
                endDate.getFullYear() +
                '-' +
                (endDate.getMonth() + 1) +
                '-' +
                endDate.getDate();
        } else {
            startDate = new Date(endDate.getTime() - millisecondsInOneDay);
            startDateInputField.value =
                startDate.getFullYear() +
                '-' +
                (startDate.getMonth() + 1) +
                '-' +
                startDate.getDate();
        }
    }
    const timeUntilTrip = getDifferenceInDays(new Date(), startDate);
    const duration = getDifferenceInDays(startDate, endDate);
    document.getElementById('time-to-trip').textContent =
        timeUntilTrip + ' day' + (timeUntilTrip != 1 ? 's' : '');
    document.getElementById('duration').textContent =
        duration + 1 + ' day' + (duration + 1 != 1 ? 's' : '');
}

function getDifferenceInDays(start, end) {
    return Math.floor((end.getTime() - start.getTime()) / millisecondsInOneDay);
}

export { setDateFields };
