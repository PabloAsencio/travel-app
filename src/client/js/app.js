function handleSubmit(event) {
    event.preventDefault();
    // TODO: Remove references to localhost from final version
    let url = 'http://localhost:8082/weather?';
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (latitude & longitude) {
        url += `latitude=${latitude}&longitude=${longitude}`;
    } else {
        const [city, province, country] = document
            .getElementById('city')
            .value.split[','].map((word) => word.trim());
        url += `city=${city || ''}&province=${province || ''}&country=${
            country || ''
        }`;
    }

    fetch(url)
        .then((response) => response.json())
        .then((weather) => console.log(weather));
}

export { handleSubmit };
