'use strict';

// global variables used to maintain state between functions
let currentImage;
let photoSet;

// init function to get photos from the API, set up the gallery with thumbnails and sets up the toggle buttons.

function init() {
    // photos from the album
    photoSet = getPhotos();
    // populate gallery with thumbnails of the images from the album
    populateGallery(photoSet);
    // add click handlers to previous and next buttons
    setUpToggleButtons();
}

function getPhotos() {
    // flickr key and photoset id
    const flickrKey = '64be1d8cf57f604b23b74346b7e325c1';
    const photosetId = '72157677269263392';

    // setup Flickr API for photoset
    const url = 'https://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=' + flickrKey + '&photoset_id=' + photosetId + '&extras=url_s,url_m&format=json&nojsoncallback=1';
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', url, false);
    xhttp.send();

    // parse response as JSON if return status is success
    if (xhttp.readyState === 4 && xhttp.status === 200) {
        let response = JSON.parse(xhttp.responseText);
        let albumImages = response.photoset;
        return albumImages && albumImages.photo;
    }
    // TODO handle API errors
}

function populateGallery(photoSet) {

    // build DOM structures with images
    for (let i = 0; i < photoSet.length; i++) {
        let galleryItem = document.createElement('div');
        let galleryImage = document.createElement('img');
        galleryImage.id = photoSet[i].id;
        galleryImage.src = photoSet[i].url_m;
        galleryImage.setAttribute('data-title', photoSet[i].title);

        // add click handler for each image
        galleryImage.addEventListener('click', selectImage, false);

        // add each image to a parent container
        galleryItem.appendChild(galleryImage);
        galleryItem.className = 'cell';

        // add all image containers to the main gallery container
        document.getElementById('galleryContainer').appendChild(galleryItem);
    }
}

function setUpToggleButtons() {
    let prevButton = document.getElementById('previousBtn');
    let nextButton = document.getElementById('nextBtn');
    prevButton.addEventListener('click', handlePrev);
    nextButton.addEventListener('click', handleNext);
    document.getElementById('close').addEventListener('click', handleClose);
    // add event listener for keyboard shortcuts
    window.addEventListener('keydown', setUpKeyboardEvents);
}

// Handle keyboard events for next, prev and close buttons
function setUpKeyboardEvents(event) {
    if (event.keyCode === 39) {
        handleNext();
    }
    if (event.keyCode === 37) {
        handlePrev();
    }
    if (event.keyCode === 27) {
        handleClose();
    }
}

// setup the lightbox and handle selection, toggling of images.
function setUpLightbox(id) {
    // clear the 'current' context of the image displayed before change
    if (document.getElementsByClassName('current').length > 0) {
        let prev = document.getElementsByClassName('current')[0];
        prev.className = prev.className.replace( /current/g , '' )
    }

    // add 'current' context to the new image after change
    currentImage = document.getElementById(id);
    currentImage.className += ' current';

    //Make the lightbox element visible
    document.getElementById('lightboxContainer').style.display = 'block';

    // change the image displayed in the lightbox by replacing the image source and the title
    document.getElementById('lightboxImg').src = currentImage.src;
    document.getElementById('lightboxTitle').innerHTML = currentImage.getAttribute('data-title');
    // TODO enhance image size for mobile devices
}

// select image based on the gallery thumbnail clicked
function selectImage(event) {
    setUpLightbox(event.target.id);
    // Stop event from propagating up the DOM
    event.stopPropagation();
}

// handling the next button click
function handleNext() {
    // find index of current image in the list of photos in the album
    let index = photoSet.findIndex(x => x.id === currentImage.id);
    if (index < photoSet.length - 1) {
        //update the current image to the next image in the album
        currentImage = photoSet[index + 1];
    }
    else {
        // If current image is the last image in the album, current image is not updated.
        // Lets the user know they've reached the end of the album
        currentImage = photoSet[index];
    }

    // update ligthbox after change
    setUpLightbox(currentImage.id);
}

function handlePrev() {
    // TODO move to a common function
    let index = photoSet.findIndex(x => x.id === currentImage.id);
    //update the current image to the prev image in the album
    if (index > 0) {
        currentImage = photoSet[index - 1];
    }
    else {
        // If current image is the first image in the album, current image is not updated.
        currentImage = photoSet[0];
    }
    setUpLightbox(currentImage.id);
}

function handleClose() {
    // hide the lightbox
    document.getElementById('lightboxContainer').style.display = 'none';
}

window.onload = init();