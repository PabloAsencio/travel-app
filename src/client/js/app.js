// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Fetch local temperature for the given zip Code from openweathermap.org
const fechtWeatherData = async (url = '', location = '') => {
    const response = await fetch(url + '?placename=' + location);
    try {
        const locationData = await response.json();
        return locationData;
    } catch (error) {
        console.log(error);
        return {
            placeName: 'No location was found under this name. Try again!',
        };
    }
};

// Post a journal entry to the server
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log(error);
    }
};

// Fetch the last journal entry from the server and update the UI with it
const updateUI = async () => {
    const temp = document.getElementById('temp');
    const date = document.getElementById('date');
    const content = document.getElementById('content');
    // TODO: Remove references to localhost from final version
    const response = await fetch('http://localhost:8082/lastEntry', {
        method: 'GET',
        credentials: 'same-origin',
    });
    try {
        const lastEntry = await response.json();
        temp.innerHTML = lastEntry.temperature;
        date.innerHTML = lastEntry.date;
        content.innerHTML = lastEntry.userResponse;
    } catch (error) {
        console.log('error');
    }
};

// Callback to post a new journal entry to the server and update the UI with it
const updateLastEntry = () => {
    const location = document.getElementById('zip').value;
    const userResponse = document.getElementById('feelings').value;
    fechtWeatherData('http://localhost:8082/location', location).then(
        (data) => {
            postData('http://localhost:8082/addData', {
                temperature: data.placeName,
                date: newDate,
                userResponse: userResponse,
            }).then(() => {
                updateUI();
            });
        }
    );
    document.getElementById('zip').value = '';
    document.getElementById('feelings').value = '';
};

export { updateLastEntry };
