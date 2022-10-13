// ASSIGNMENT CODE
var targetCity = 'New York City';
var googleKey = 'AIzaSyDh2jcs3sWSy_5L5y-hdC0bryjDAjOEZTg';
var weatherKey = '66b15a5b3951d15de56c5d2c4e2ddcba';
var inputEl = document.getElementById('autocomplete')
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=40.7127281&lon=-74.0060152&appid=66b15a5b3951d15de56c5d2c4e2ddcba&units=imperial"
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=40.7127281&lon=-74.0060152&appid=66b15a5b3951d15de56c5d2c4e2ddcba&units=imperial"
var weatherWidget = document.querySelector(".weather")
var markers = [];
var placeMarker;


// get name, ratings, reviews, seating options, price-range


// DEPENDENCIES
var autocomplete;
var searchBtnEl = document.getElementById('search-btn');
console.dir(searchBtnEl);
var mapContainerEl= document.querySelector('.map-container');

// FUNCTIONS
function getLatLon(city) {
  var geoURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + weatherKey;
  fetch(geoURL).then(response => {
    return response.json()
  }).then(data => {
    console.log(data);
  })
}

// function to get weather 
async function getWeather(weatherUrl) {
  const response = await fetch(weatherUrl);
  var data = await response.json();
  console.log(data);
  var temp = data.main.temp;
  var city = data.name
  var feelsLike = data.main.feels_like;
  var weatherDesc = data.weather[0].main;
  console.log(feelsLike);
  console.log(temp);
  console.log(weatherDesc)
  // document.getElementById('weather').innerHTML = city + "<br>Temperature: " + temp + " <br>Feels Like: " + feelsLike + " <br>Conditions: " + weatherDesc;
  document.getElementById('weather').innerHTML =
  `
  <h3>${city}</h3>
  <p>Temperature: ${temp}</p>
  <p>Feels Like: ${feelsLike}</p>
  <p>Weather Condition: ${weatherDesc}</p>
  `;
}

//get forecast function
async function getForecast(forecastUrl) {
  const response = await fetch(forecastUrl);
  var data = await response.json();
  console.log(data);
  var forecastData = [data.list[0].main.temp, data.list[0].main.feels_like, data.list[0].weather[0].main, data.city.name]
  console.log(forecastData);
  // document.getElementById('forecast').innerHTML = "In 3 Hours the forecast for " + "<br>" + forecastData[3] + "<br>Temperature: " + forecastData[0] + "<br>Feels Like: " + forecastData[1] + " <br>Weather conditions: " + forecastData[2];

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
  var newYorkLatLon = { lat: 40.7127281, lng: -74.0060152 }
  var options = {
    zoom: 12,
    center: newYorkLatLon,
    mapTypeControl: false
  }
  // New map
  const map = new google.maps.Map(document.getElementById("map"), options);

  var manhattanLatLon = { lat: 40.7831, lng: -73.9712 }
  var brooklynLatLon = { lat: 40.6782, lng: -73.9442 }
  var queensLatLon = { lat: 40.7282, lng: -73.7949 }
  var defaultBounds = {
    north: newYorkLatLon.lat + 0.1,
    south: newYorkLatLon.lat - 0.1,
    east: newYorkLatLon.lng + 0.1,
    west: newYorkLatLon.lng - 0.1,
  };

  const card = document.getElementById('map-card');
  const input = document.getElementById('map-input');

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);


  // Add marker
  var newYorkMarker = new google.maps.Marker({
    position: newYorkLatLon,
    map: map,
    icon: './assets/images/icons/blue-dot.png'
  });

  // Add event listener to marker
  newYorkMarker.addListener('click', function () {
    infoWindow.open(map, newYorkMarker);
  });

  autocomplete = new google.maps.places.Autocomplete(
    input,
    {
      bounds: defaultBounds,
      componentRestrictions: { 'country': ['us'] },
      fields: ['place_id', 'geometry', 'name', 'adr_address'],
      types: ['restaurant', 'cafe'] // types: ['restaurant', 'cafe'], types: ['establishment']
    });



  // Listen for autocomplete selection  
  autocomplete.addListener('place_changed', () => {
    var place = autocomplete.getPlace();
    console.log(place)
    placeMarker = new google.maps.Marker({
      placeId: place.place_id,
      address: place.adr_address,
      position: place.geometry.location,
      title: place.name,
      map: map
    });
    console.log(placeMarker)
    var placeInfoWindow = new google.maps.InfoWindow({
      // content: 
      // `
      //   <div style = "z-index: 99">
      //     <h5>${placeMarker.title}</h5>
      //     <p>${placeMarker.address}</p>
      //   </div>
      // `
    })
    placeMarker.addListener('click', function () {
      placeInfoWindow.open(map, placeMarker);
    });
    placeMarker.disabled = true;
  });
}

function displayElement(){
  mapContainerEl.style.display = "block"
  console.log('Hi')
}




getWeather(weatherUrl);
getForecast(forecastUrl);


 //add modal for search menu when screen gets larger
searchBtnEl.addEventListener('click', displayElement)


// ABOUT
var aboutModal = document.getElementById("aboutModal");
var aboutModalButton = document.getElementById("aboutModalButton");
var closeButton = document.getElementsByClassName("aboutModalCloseButton")

aboutModalButton.onclick = function() {
  aboutModal.style.display = "block";
}

closeButton.onclick = function() {
  aboutModal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == aboutModal) {
    aboutModal.style.display = "none"
  }
}
