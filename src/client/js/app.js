// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Fetch local temperature for the given zip Code from openweathermap.org
const fechtWeatherData = async (url = '', zipCode = '00000') => {
    const response = await fetch(url + '?zipcode=' + zipCode);
    try {
        const weatherData = await response.json();
        return {
            temperature: weatherData.temperature,
        };
    } catch (error) {
        console.log(error);
        return {
            temperature:
                'No temperature was found for this location. Try again!',
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
    console.log('Entering updateUI');
    const temp = document.getElementById('temp');
    const date = document.getElementById('date');
    const content = document.getElementById('content');

    const response = await fetch('/lastEntry', {
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
    const zipCode = document.getElementById('zip').value;
    const userResponse = document.getElementById('feelings').value;
    fechtWeatherData('/weather', zipCode).then((data) => {
        postData('/addData', {
            temperature: data.temperature,
            date: newDate,
            userResponse: userResponse,
        }).then(() => {
            updateUI();
        });
    });
    document.getElementById('zip').value = '';
    document.getElementById('feelings').value = '';
};

export { updateLastEntry };
