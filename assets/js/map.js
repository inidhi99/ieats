// ASSIGNMENT CODE
var place;
var placeMarker;
var cityZoom = 11;
var boroughZoom = 12;
var autocomplete;
var diningString = '';
var deliveryString = '';

// DEPENENCIES 
var locationSelectorContainerEl = document.getElementById('location-selector');
var restaurantContainerEl = document.getElementById('restaurant-container');
const searchBtnEl = document.getElementById('search-btn');
// get the card with custom map controls and search bar
const mapCardEl = document.getElementById('map-card');
  // get the search bar element
const inputEl = document.getElementById('map-input');

// FUNCTIONS

function setMapDisplay() {
  var desktopQuery = window.matchMedia("(min-width: 992px)");
  var tabletQuery = window.matchMedia("(min-width: 768px)");
  if (desktopQuery.matches) {
    cityZoom = 13;
    boroughZoom = 14;
    searchBtnEl.style.display = 'none';
  } else if (tabletQuery.matches && (!desktopQuery.matches)) {
    cityZoom = 13;
    boroughZoom = 14;
    searchBtnEl.style.display = 'none';
  } else {
    cityZoom = 11;
    boroughZoom = 12;
  }
}

// function setNewBounds(e) {
//   console.log(this);
// }

function initGoogle() {
  // variable for initial center of map
  var newYorkLatLon = { lat: 40.7127281, lng: -74.0060152 };
  // lat and lon for specific search areas
  var manhattanLatLon = { lat: 40.7831, lng: -73.9712 };
  var brooklynLatLon = { lat: 40.6782, lng: -73.9442 };
  var queensLatLon = { lat: 40.7282, lng: -73.7949 };
  var defaultBounds = {
    north: newYorkLatLon.lat + 0.15,
    south: newYorkLatLon.lat - 0.05,
    east: newYorkLatLon.lng + 0.15,
    west: newYorkLatLon.lng - 0.05,
  };
  
  // options for Map constructor
  var options = {
    zoom: cityZoom,
    center: newYorkLatLon,
    LatLngBounds: defaultBounds,
    disableDefaultUI: true,
    mapTypeControl: false, // remove Map/Satellite buttons
    zoomControl: false, // prevent user changing zoom
    fullscreenControl: false, // prevent full screen map
    gestureHandling: 'none' //prevent user from moving the map's viewport
  };

  // New map
  const map = new google.maps.Map(document.getElementById("map"), options);

  // put custom map controls inside the map
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(mapCardEl);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(searchBtnEl);
  displayElement(searchBtnEl);

  // Add marker at default center
  var centerMarker = new google.maps.Marker({
    position: newYorkLatLon,
    map: map,
    icon: './assets/images/icons/blue-dot.png'
  });
  
  // click event for radio buttons on custom map controls
  locationSelectorContainerEl.addEventListener('click', (e) => {
    var newBounds;
    switch (e.target.id) {
      case 'changetype-all':
        // move the center of the map to New York City's lattitude and longitude
        map.setCenter({ lat: newYorkLatLon.lat, lng: newYorkLatLon.lng });

        // match the marker location with the new map center
        centerMarker.setPosition(new google.maps.LatLng(newYorkLatLon.lat, newYorkLatLon.lng));

        // reset the bounds to their original settings
        map.LatLngBounds = defaultBounds;

        // zoom out for view of whole city
        map.setZoom(cityZoom);
        getWeather(newYorkLatLon.lat, newYorkLatLon.lng);
        break;
      case 'changetype-manhattan':
        // move the center of the map to Manhattan's lattitude and longitude
        map.setCenter({ lat: manhattanLatLon.lat, lng: manhattanLatLon.lng, boroughZoom });
        centerMarker.setPosition(new google.maps.LatLng(manhattanLatLon.lat, manhattanLatLon.lng));

        // zoom in for view of individual boroughs
        map.setZoom(boroughZoom);

        // set new north, south, east, west lattitude and longitude
        newBounds = getNewBounds(map);
        map.LatLngBounds = newBounds; // apply new lattitudes and longitudes to the map bounds

        getWeather(manhattanLatLon.lat, manhattanLatLon.lng);
        break;
      case 'changetype-brooklyn':
        // move the center of the map to Brooklyn's lattitude and longitude
        map.setCenter({ lat: brooklynLatLon.lat, lng: brooklynLatLon.lng, boroughZoom });
        centerMarker.setPosition(new google.maps.LatLng(brooklynLatLon.lat, brooklynLatLon.lng));

        map.setZoom(boroughZoom);

        // set new north, south, east, west lattitude and longitude
        newBounds = getNewBounds(map);
        map.LatLngBounds = newBounds; // apply new lattitudes and longitudes to the map bounds

        getWeather(brooklynLatLon.lat, brooklynLatLon.lng);
        break;
      case 'changetype-queens':
        // move the center of the map to Queens' lattitude and longitude
        map.setCenter({ lat: queensLatLon.lat, lng: queensLatLon.lng, boroughZoom });
        centerMarker.setPosition(new google.maps.LatLng(queensLatLon.lat, queensLatLon.lng));
        map.setZoom(boroughZoom);

        // set new north, south, east, west lattitude and longitude
        newBounds = getNewBounds(map);
        map.LatLngBounds = newBounds; // apply new lattitudes and longitudes to the map bounds

        getWeather(queensLatLon.lat, queensLatLon.lng);
        break;
    }
  });

  // options for the Autocomplete constructor
  autocompleteOptions = {
    componentRestrictions: { 'country': ['us'] },
    fields: ['place_id', 'geometry', 'name', 'adr_address', 'photo'],
    types: ['restaurant', 'cafe'] // specific types: ['restaurant', 'cafe'], general type: ['establishment']
  }

  // add autocomplete to search bar element
  autocomplete = new google.maps.places.Autocomplete(
    inputEl, autocompleteOptions);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  // Listen for autocomplete selection  
  autocomplete.addListener('place_changed', async () => { // ascync arrow function awaits dining options fetch request 
    // store place data gathered from autocomplete
    place = autocomplete.getPlace();
    placeMarker = new google.maps.Marker({
      placeId: place.place_id,
      address: place.adr_address,
      title: place.name,
      position: place.geometry.location,
      map: map
    });

    // info Window for search result marker
    var placeInfoWindow = new google.maps.InfoWindow({
      content:
        `
        <div>
          <h5>${placeMarker.title}</h5>
          <p>${placeMarker.address}</p>
        </div>
      `
    })
    // display placeInfoWindow when marker is clicked
    placeMarker.addListener('click', function () {
      displayElement(mapCardEl);
      placeInfoWindow.open(map, placeMarker);
    });

    // routes request through API proxy server
    var detailsRequestURL = `http://45.79.160.76:5001/api/google/?place_id=${place.place_id}&fields=dine_in,delivery`;
    
    // store data from places details request
    var serviceOptions = await fetch(detailsRequestURL)
      .then(response => {
        if (!response.ok) {
          throw new Error('API response was bad');
        }
        return response.json()
      })
      .then(data => {
        var serviceOptions = { dineIn: data.result.dine_in, delivery: data.result.delivery }
        return serviceOptions;
      })
      .catch((error) => {
        console.error('There has been a problem:', error);
      });

    // set strings for rendering
    setServiceOptionsStrings(serviceOptions);
    
    // check if there are already 3 restaurant cards displayed in the restaurantContainerEl
    checkContents(restaurantContainerEl);

    // render place data in flex-item cards
    restaurantContainerEl.innerHTML +=
      `
    <div class="restaurant-card">
    
    <div class="card">
    <div class="card-image waves-effect waves-block waves-light">
    <figure class="img-container">
      <img class="activator" src="${place.photos[0].getUrl()}">
    </figure> 
    </div>
    <div class="card-content">
    <span class="card-title activator">${place.name}<i class="material-icons right">more_vert</i></span>
    
    </div>
    <div class="card-reveal" id="reveal">
    <span class="card-title">${place.adr_address}<i class="material-icons right">close</i></span>
    <span class="seating ">${diningString}</span><br>
    <spanclass="delivery">${deliveryString}</spanclass=>
    </div>
    </div>
    </div>
    `;
  });
}

/**
 * Displays element in DOM
 * 
 * @param {HTML element} element the element whose display property is being altered
 */
function displayElement(element) {
  // check if object is currently being displayed in DOM
  if (window.getComputedStyle(element).display === 'none') {
    element.style.display = 'block'; //display element in DOM
    if (element === mapCardEl) {
      searchBtnEl.style.display = 'none'; // when searchBtnEl click displays map card, hide searchBtnEl
    }
  } else if (element === mapCardEl && element.style.display === 'block') {
    element.style.display = 'none';
  }
}

/**
 * Set values for string objects to be rendered in the DOM
 * 
 * @param {object} serciveOptionsObj place details request data: dine_in, delivery
 */
function setServiceOptionsStrings(serciveOptionsObj) {
  if (serciveOptionsObj.dineIn === true) {
    // global string to be rendered in restaurantContainerElement innerHTML
    diningString = 'Dine in available!';
  } else {
    diningString = 'Dine in unavailable!';
  }

  if (serciveOptionsObj.delivery === true) {
    // global string to be rendered in restaurantContainerElement innerHTML
    deliveryString = 'Delivery available!';
  } else {
    deliveryString = 'Delivery unavailable!';
  }
}

/**
 * Get new map bounds based on current center
 * @param {Map} map the google map object
 * @returns LatLng object
 */
function getNewBounds(map) {
  var bounds = {
    north: map.getCenter().lat() + 0.07,
    south: map.getCenter().lat() - 0.07,
    east: map.getCenter().lng() + 0.7,
    west: map.getCenter().lng() - 0.7,
  }
  return bounds;
}

/**
 * Ensure number of restaurant cards displayed never exceeds 3
 * 
 * @param {HTML element} element container element for rendered restaurant cards
 */
function checkContents(element) {
  if (element.childElementCount === 3)
    element.removeChild(element.firstElementChild);
}

// EVENT LISTNERS
//add modal for search menu when screen gets larger
document.addEventListener('DOMContentLoaded', setMapDisplay);
// call display element with mapCardEl argument on click
searchBtnEl.addEventListener('click', () => {
  displayElement(mapCardEl);
});