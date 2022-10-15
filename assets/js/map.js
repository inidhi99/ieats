// ASSIGNMENT CODE
var googleKey = 'AIzaSyDh2jcs3sWSy_5L5y-hdC0bryjDAjOEZTg';
var markers = [];
var place;
var placeMarker;
var cityZoom = 11;
var boroughZoom = 12;
var autocomplete;

// DEPENENCIES 
var locationSelectorContainerEl = document.getElementById('location-selector');
var restaurantContainerEl = document.getElementById('restaurant-container');
const searchBtnEl = document.getElementById('search-btn');
// get the card with custom map controls and search bar
const mapCardEl = document.getElementById('map-card');

// FUNCTIONS

function setMapDisplay() {
  var desktopQuery = window.matchMedia("(min-width: 992px)");
  var tabletQuery = window.matchMedia("(min-width: 768px)");
  // console.log("Is it big screen?", desktopQuery);
  // console.log("Is it tablet screen?", tabletQuery);
  if (desktopQuery.matches) {
    cityZoom = 13;
    boroughZoom = 14;
    searchBtnEl.style.display = 'none';
  } else if (tabletQuery.matches && (!desktopQuery.matches)) {
    console.log("Is it tablet screen?", tabletQuery);
    cityZoom = 13;
    boroughZoom = 14;
    searchBtnEl.style.display = 'none';
  } else {
    cityZoom = 11;
    boroughZoom = 12;
  }
}

function initGoogle() {
  // variable for initial center of map
  var newYorkLatLon = { lat: 40.7127281, lng: -74.0060152 };
  // options for google map
  var options = {
    zoom: cityZoom,
    center: newYorkLatLon,
    disableDefaultUI: true,
    mapTypeControl: false, // remove Map/Satellite buttons
    zoomControl: false,
    fullscreenControl: false,
    draggable: false
  };
  // New map
  const map = new google.maps.Map(document.getElementById("map"), options);

  // lat and lon for specific search areas
  var manhattanLatLon = { lat: 40.7831, lng: -73.9712 };
  var brooklynLatLon = { lat: 40.6782, lng: -73.9442 };
  var queensLatLon = { lat: 40.7282, lng: -73.7949 };

  // need function to change default bounds based on which LatLon variable is passed
  var defaultBounds = {
    north: newYorkLatLon.lat + 0.1,
    south: newYorkLatLon.lat - 0.1,
    east: newYorkLatLon.lng + 0.1,
    west: newYorkLatLon.lng - 0.1,
  };

  // get the search bar element
  const inputEl = document.getElementById('map-input');

  // put custom map controls inside the map
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(mapCardEl);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(searchBtnEl);


  // Add marker at default center
  var centerMarker = new google.maps.Marker({
    position: newYorkLatLon,
    map: map,
    icon: './assets/images/icons/blue-dot.png'
  });

  // click event for radio buttons on custom map controls
  locationSelectorContainerEl.addEventListener('click', (e) => {
    switch (e.target.id) {
      case 'changetype-all':
        // move the center of the map to New York City's lattitude and longitude
        map.setCenter({ lat: newYorkLatLon.lat, lng: newYorkLatLon.lng });
        // match the marker location with the new map center
        centerMarker.setPosition(new google.maps.LatLng(newYorkLatLon.lat, newYorkLatLon.lng));
        // zoom out for view of whole city
        map.setZoom(cityZoom);
        autocomplete.bindTo('bounds', map);
        getWeather(newYorkLatLon.lat, newYorkLatLon.lng);
        break;
        case 'changetype-manhattan':
          // move the center of the map to Manhattan's lattitude and longitude
          map.setCenter({ lat: manhattanLatLon.lat, lng: manhattanLatLon.lng, boroughZoom });
          centerMarker.setPosition(new google.maps.LatLng(manhattanLatLon.lat, manhattanLatLon.lng));
          // zoom in for view of individual boroughs
          map.setZoom(boroughZoom);
          autocomplete.bindTo('bounds', map);
          getWeather(manhattanLatLon.lat, manhattanLatLon.lng);
        break;
      case 'changetype-brooklyn':
        // move the center of the map to Brooklyn's lattitude and longitude
        map.setCenter({ lat: brooklynLatLon.lat, lng: brooklynLatLon.lng, boroughZoom });
        centerMarker.setPosition(new google.maps.LatLng(brooklynLatLon.lat, brooklynLatLon.lng));
        map.setZoom(boroughZoom);
        autocomplete.bindTo('bounds', map);
        getWeather(brooklynLatLon.lat, brooklynLatLon.lng);
        break;
      case 'changetype-queens':
        // move the center of the map to Queens' lattitude and longitude
        map.setCenter({ lat: queensLatLon.lat, lng: queensLatLon.lng, boroughZoom });
        centerMarker.setPosition(new google.maps.LatLng(queensLatLon.lat, queensLatLon.lng));
        map.setZoom(boroughZoom);
        autocomplete.bindTo('bounds', map);
        getWeather(queensLatLon.lat, queensLatLon.lng);
        break;
    }
  })

  // add autocomplete to search bar element
  autocomplete = new google.maps.places.Autocomplete(
    inputEl,
    {
      componentRestrictions: { 'country': ['us'] },
      fields: ['place_id', 'geometry', 'name', 'adr_address'],
      types: ['restaurant', 'cafe'] // specific types: ['restaurant', 'cafe'], general type: ['establishment']
    });

  // restric the bounds of the search to the area visible on the map
  autocomplete.bindTo('bounds', map);

  // Listen for autocomplete selection  
  autocomplete.addListener('place_changed', () => {
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
    // may remove this entirely
    placeMarker.addListener('click', function () {
      toggleSearchCardDisplay();
      placeInfoWindow.open(map, placeMarker);
    });
    placeMarker.disabled = true; // didn't work as expexted need to improve or remove

    let request = {
      placeId: place.place_id,
      fields: ['geometry', 'name', 'adr_address', 'photo', 'price_level', 'dine_in']
    }

    var service = new google.maps.places.PlacesService(map);

    service.getDetails(request, (placeInfo, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(placeInfo);
      }
    })

    var detailsRequestURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=dine_in&key=AIzaSyDh2jcs3sWSy_5L5y-hdC0bryjDAjOEZTg`;

    var seatingOptions = getSeatingOptions(detailsRequestURL);

    //render place data in flex-item cards
    restaurantContainerEl.innerHTML +=
      `
    <div class="restaurant-card">

    <div class="card">
    <div class="card-image waves-effect waves-block waves-light">
    <figure class="img-container">
    Photos Coming Soon!
      </figure> 
      <img class="activator" src="">
    </div>
    <div class="card-content">
      <span class="card-title activator grey-text text-darken-4">${place.name}<i class="material-icons right">more_vert</i></span>
      
    </div>
    <div class="card-reveal">
      <span class="card-title grey-text text-darken-4">${place.adr_address}<i class="material-icons right">close</i></span>
      <p class="seating">Feature coming soon!</p>
    </div>
  </div>
  </div>
    `;
  });
}

function displaySearchCard(){
  var cardDisplay = mapCardEl.style.display;
  
  if (window.getComputedStyle(mapCardEl).display === 'none') {
    mapCardEl.style.display = 'block';
    searchBtnEl.style.display = 'none';
  }
}

function getSeatingOptions(url) {
  var outdoorSeating
  fetch(url).then(response => {
    if (response.ok) {
      throw new Error("Whoops something went wrong");
    }
    return response;
  }).then(seatingData => {
    console.log(seatingData);
  })
}

// get name, ratings, reviews, seating options, price-range

// EVENT LISTNERS
//add modal for search menu when screen gets larger
document.addEventListener('DOMContentLoaded', setMapDisplay);
// call setMapDisplay on resize
searchBtnEl.addEventListener('click', displaySearchCard);