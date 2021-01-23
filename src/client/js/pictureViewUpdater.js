import logo from '../../assets/images/pixabay-logo.svg';
const pictureViewUpdater = (function () {
    function updatePicture(photos) {
        clearPictureError();
        if (photos.error) {
            showPictureError(photos.error);
        } else {
            const photo = photos['pictures'][0]; // In the future all pictures should be shown in a carrousel
            console.log(photo.imageURL);
            const noSuffixImageURL = photo.imageURL.substring(
                0,
                photo.imageURL.length - 8
            );
            console.log(noSuffixImageURL);
            const photoContainer = document.getElementById('newTrip__photo');
            const img = photoContainer.getElementsByTagName('IMG')[0];
            const caption = document.getElementById('newTrip__photo--caption');
            img.setAttribute(
                'srcset',
                `${noSuffixImageURL + '_340.jpg'} 340w, ${
                    photo.imageURL
                } 640w, ${photo.largeImageURL} 1280w`
            );
            img.setAttribute(
                'sizes',
                '(min-width:1444px) calc(2 * (80vw - 1rem) / 3), 80vw'
            );
            img.setAttribute('src', photo.largeImageURL);
            img.setAttribute('alt', photo.subject);
            img.setAttribute('type', 'image/jpeg');
            caption.innerHTML = `${photo.subject}. Photo by <a href="${photo.userURL}">${photo.user}</a> at <a href="${photo.pageURL}" aria-labelledby="pixabay">${logo}</a>`;
        }
    }

    function showPictureError(message) {
        const error = document.getElementById('newTrip__photo--error');
        error.textContent = message;
    }

    function clearPictureError() {
        const error = document.getElementById('newTrip__photo--error');
        error.textContent = '';
    }
    return {
        updatePicture,
    };
})();

export { pictureViewUpdater };
