// ASSIGNMENT CODE
var targetCity = 'New York City';
var googleKey = 'AIzaSyDh2jcs3sWSy_5L5y-hdC0bryjDAjOEZTg';
var weatherKey = '66b15a5b3951d15de56c5d2c4e2ddcba';
var markers = [];
var placeMarker;
var cityZoom = 11;
var boroughZoom = 12;


// get name, ratings, reviews, seating options, price-range


// DEPENDENCIES
var autocomplete;
var weatherWidget = document.querySelector(".weather");
var searchBtnEl = document.getElementById('search-btn');
var mapContainerEl = document.querySelector('.map-card');
var locationSelectorContainerEl = document.getElementById('location-selector');
var restaurantContainerEl = document.getElementById('restaurant-container');


// FUNCTIONS

// function to get weather 
async function getWeather(lat, lon) {
  var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=66b15a5b3951d15de56c5d2c4e2ddcba&units=imperial"
  const response = await fetch(weatherUrl);
  var data = await response.json();
  var temp = data.main.temp;
  var city = data.name
  var feelsLike = data.main.feels_like;
  var weatherDesc = data.weather[0].main;
  document.getElementById('weather').innerHTML =
    `
  <h3>${city}</h3>
  <p>Temperature: ${temp}</p>
  <p>Feels Like: ${feelsLike}</p>
  <p>Conditions: ${weatherDesc}</p>
  `;
}
//get forecast function
async function getForecast(lat, lon) {
  var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=66b15a5b3951d15de56c5d2c4e2ddcba&units=imperial"
  console.log(forecastUrl);
  const response = await fetch(forecastUrl);
  var data = await response.json();
  var forecastData = [data.list[0].main.temp, data.list[0].main.feels_like, data.list[0].weather[0].main, data.city.name]
  document.getElementById('forecast').innerHTML =
    `
  <h3>In 3 hours</h3>
  <p>Temperature: ${forecastData[0]}</p>
  <p>Feels Like: ${forecastData[1]}</p>
  <p>Conditions: ${forecastData[2]}</p>
  `;
}

function getZoom() {
  var desktopQuery = window.matchMedia("(min-width: 992px)");
  var tabletQuery = window.matchMedia("(min-width: 768px)");
  // console.log("Is it big screen?", desktopQuery);
  // console.log("Is it tablet screen?", tabletQuery);
  if (desktopQuery.matches) {
    console.log(desktopQuery)
    cityZoom = 13;
    boroughZoom = 14;
  } else if (tabletQuery.matches && (!desktopQuery.matches)) {
    console.log("Is it tablet screen?", tabletQuery);
    cityZoom = 13;
    boroughZoom = 14;
  } else {
    cityZoom = 11;
    boroughZoom = 12;
  }
}
//get time
setInterval(function getTime() {
  var time = moment().format(
    `MMM Do, YYYY,
  <p>hh:mm:ss</p>
  `);
  $("#time").text(time);
  document.getElementById('time').innerHTML = time.toString();
}, 1000)


// function initAutocomplete() { 
// 
function initGoogle() {
  // variable for initial center of map
  var newYorkLatLon = { lat: 40.7127281, lng: -74.0060152 };
  // options for google map
  var options = {
    zoom: cityZoom,
    center: newYorkLatLon,
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

  // get the card with custom map controls and search bar
  const card = document.getElementById('map-card');
  // get the search bar element
  const inputEl = document.getElementById('map-input');

  // put custom map controls inside the map
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);


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
        break;
      case 'changetype-manhattan':
        // move the center of the map to Manhattan's lattitude and longitude
        map.setCenter({ lat: manhattanLatLon.lat, lng: manhattanLatLon.lng, boroughZoom });
        centerMarker.setPosition(new google.maps.LatLng(manhattanLatLon.lat, manhattanLatLon.lng));
        // zoom in for view of individual boroughs
        map.setZoom(boroughZoom);
        break;
      case 'changetype-brooklyn':
        // move the center of the map to Brooklyn's lattitude and longitude
        map.setCenter({ lat: brooklynLatLon.lat, lng: brooklynLatLon.lng, boroughZoom });
        centerMarker.setPosition(new google.maps.LatLng(brooklynLatLon.lat, brooklynLatLon.lng));
        map.setZoom(boroughZoom);
        break;
      case 'changetype-queens':
        // move the center of the map to Queens' lattitude and longitude
        map.setCenter({ lat: queensLatLon.lat, lng: queensLatLon.lng, boroughZoom });
        centerMarker.setPosition(new google.maps.LatLng(queensLatLon.lat, queensLatLon.lng));
        map.setZoom(boroughZoom);
        break;
    }
  })

  // add autocomplete to search bar element
  autocomplete = new google.maps.places.Autocomplete(
    inputEl,
    {
      componentRestrictions: { 'country': ['us'] },
      fields: ['place_id', 'geometry', 'name', 'adr_address', 'photo'],
      types: ['restaurant', 'cafe'] // specific types: ['restaurant', 'cafe'], general type: ['establishment']
    });

  // restric the bounds of the search to the area visible on the map
  autocomplete.bindTo('bounds', map);

  // Listen for autocomplete selection  
  autocomplete.addListener('place_changed', () => {
    // store place data gathered from autocomplete
    var place = autocomplete.getPlace();
    console.log(place);
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

function toggleSearchCardDisplay() {
  var cardDisplay = mapContainerEl.style.display;
  if (cardDisplay === 'none')
    cardDisplay = 'block';
  else
    cardDisplay = 'none';
}

//modal script 
$(document).ready(function () {
  $('.modal').modal();
});

// rating script
$(document).ready(function () {
  $('input#input_text, textarea#textarea2').characterCounter();
});

$("#review-Submit").on('change', function () {
  console.log($(this));
});


getWeather(40.7127281, -74.0060152);
getForecast(40.7127281, -74.0060152);


//add modal for search menu when screen gets larger
document.addEventListener('DOMContentLoaded', getZoom);
// window.onresize(getZoom);
document.addEventListener('DOMContentLoaded', getZoom);
// window.onresize(getZoom);
searchBtnEl.addEventListener('click', toggleSearchCardDisplay);