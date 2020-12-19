function handleSubmit(event) {
    event.preventDefault();
    // TODO: Remove references to localhost from final versio
    const server = 'http://localhost:8082/';
    const currentWeatherEndpoint = 'currentWeather';
    const forecastEndpoint = 'forecast';
    let query = '?';
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (latitude & longitude) {
        query += `latitude=${latitude}&longitude=${longitude}`;
    } else {
        const [city, province, country] = document
            .getElementById('city')
            .value.split[','].map((word) => word.trim());
        query += `city=${city || ''}&province=${province || ''}&country=${
            country || ''
        }`;
    }

    const currentWeather = fetch(server + currentWeatherEndpoint + query);

    const timeToTrip = document
        .getElementById('time-to-trip')
        .textContent.split(' ')[0];

    const duration = document
        .getElementById('duration')
        .textContent.split(' ')[0];
    query += `&timeToTrip=${timeToTrip}&duration=${duration}`;

    const forecast = fetch(server + forecastEndpoint + query);

    currentWeather
        .then((response) => response.json())
        .then((weather) => console.log(weather));
    forecast
        .then((response) => response.json())
        .then((forecast) => console.log(forecast));
}

export { handleSubmit };
