// ASSIGNMENT CODE
var targetCity = 'New York City';
var googleKey = 'AIzaSyDh2jcs3sWSy_5L5y-hdC0bryjDAjOEZTg';
var weatherKey = '66b15a5b3951d15de56c5d2c4e2ddcba';
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=40.7127281&lon=-74.0060152&appid=66b15a5b3951d15de56c5d2c4e2ddcba&units=imperial"
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=40.7127281&lon=-74.0060152&appid=66b15a5b3951d15de56c5d2c4e2ddcba&units=imperial"
var markers = [];
var placeMarker;


// get name, ratings, reviews, seating options, price-range


// DEPENDENCIES
var autocomplete;
var weatherWidget = document.querySelector(".weather");
var searchBtnEl = document.getElementById('search-btn');
var mapContainerEl= document.querySelector('.map-card');
var locationSelectorContainerEl = document.getElementById('location-selector');
var restaurantContainerEl = document.getElementById('restaurant-container')

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
  <p>Weather Condition: ${weatherDesc}</p>
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
  <h3>In 3 hours for ${forecastData[3]}</h3>
  <p>Temperature: ${forecastData[0]}</p>
  <p>Feels Like: ${forecastData[1]}</p>
  <p>Weather Conditions: ${forecastData[2]}</p>
  `;
}

// function initAutocomplete() { 
// }

function initGoogle() {
  // variable for initial center of map
  var newYorkLatLon = { lat: 40.7127281, lng: -74.0060152 };
  var cityZoom = 11;
  var boroughZoom = 12;
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
  locationSelectorContainerEl.addEventListener( 'click', (e) => {
    switch ( e.target.id ) {
      case 'changetype-all':
        // move the center of the map to New York City's lattitude and longitude
        map.setCenter({ lat: newYorkLatLon.lat, lng: newYorkLatLon.lng });
        // match the marker location with the new map center
        centerMarker.setPosition( new google.maps.LatLng( newYorkLatLon.lat, newYorkLatLon.lng ));
        // zoom out for view of whole city
        map.setZoom(cityZoom);
        break;
      case 'changetype-manhattan':
        // move the center of the map to Manhattan's lattitude and longitude
        map.setCenter({ lat: manhattanLatLon.lat, lng: manhattanLatLon.lng, boroughZoom });
        centerMarker.setPosition( new google.maps.LatLng( manhattanLatLon.lat, manhattanLatLon.lng ));
        // zoom in for view of individual boroughs
        map.setZoom(boroughZoom);
        break;
      case 'changetype-brooklyn':
        // move the center of the map to Brooklyn's lattitude and longitude
        map.setCenter({ lat: brooklynLatLon.lat, lng: brooklynLatLon.lng, boroughZoom });
        centerMarker.setPosition( new google.maps.LatLng( brooklynLatLon.lat, brooklynLatLon.lng ));
        map.setZoom(boroughZoom);
        break;
      case 'changetype-queens':
        // move the center of the map to Queens' lattitude and longitude
        map.setCenter({ lat: queensLatLon.lat, lng: queensLatLon.lng, boroughZoom });
        centerMarker.setPosition( new google.maps.LatLng( queensLatLon.lat, queensLatLon.lng ));
        map.setZoom(boroughZoom);
        break;
      default:
        // default to New York City settings
        map.setCenter({ lat: newYorkLatLon.lat, lng: newYorkLatLon.lng, cityZoom });
        centerMarker.setPosition( new google.maps.LatLng( newYorkLatLon.lat, newYorkLatLon.lng ));
        map.setZoom(cityZoom);
    }
  })

  // add autocomplete to search bar element
  autocomplete = new google.maps.places.Autocomplete(
    inputEl,
    {
      componentRestrictions: { 'country': ['us'] },
      fields: ['place_id', 'geometry', 'name', 'adr_address', 'photo' ],
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
      <figure class="img-container">
          Photos Coming Soon!
      </figure>
      <h3>${place.name}</h3>
      <p class="address">${place.adr_address}</p>
      <p class="seating">Feature coming soon!</p>
    </div>
    `;
  });
}

function toggleSearchCardDisplay(){
  var cardDisplay = mapContainerEl.style.display;
  if (mapContainerEl.style.display === 'none')
  mapContainerEl.style.display = 'block';
  else
  mapContainerEl.style.display = 'none';
}




getWeather(40.7127281, -74.0060152);
getForecast(40.7127281, -74.0060152);


 //add modal for search menu when screen gets larger
searchBtnEl.addEventListener('click', toggleSearchCardDisplay)
