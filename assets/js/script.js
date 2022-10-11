// ASSIGNMENT CODE
var targetCity = 'New York City';
var googleKey = 'AIzaSyDh2jcs3sWSy_5L5y-hdC0bryjDAjOEZTg';
var weatherKey = '66b15a5b3951d15de56c5d2c4e2ddcba';
var markers = [];
var placeMarker;


// DEPENDENCIES
var autocomplete;


// FUNCTIONS
function getLatLon(city) {
  var geoURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + weatherKey;
  fetch(geoURL).then(response => {
    return response.json()
  }).then(data => {
    console.log(data);
  }) 
}


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
  newYorkMarker.addListener('click', function(){
    infoWindow.open(map, newYorkMarker);
  });
  
  autocomplete = new google.maps.places.Autocomplete(
    input,
    {
      bounds: defaultBounds,
      componentRestrictions: {'country': ['us']},
      fields: ['place_id', 'geometry', 'name', 'adr_address'],
      types: ['restaurant', 'cafe'] // types: ['restaurant', 'cafe'], types: ['establishment']
    });
    
  // Listen for autocomplete selection  
  varautocomplete.addListener('place_changed', () => {
    var place = autocomplete.getPlace();
    placeMarker = new google.maps.Marker({
      placeId: place.place_id,
      address: place.adr_address,
      position: place.geometry.location,
      title: place.name,
      map: map
    });

    var placeInfoWindow = new google.maps.InfoWindow({
      content: 
      `
        <h2>${placeMarker.title}</h2>
        <p>${placeMarker.address}</p>
      `
    })
    placeMarker.addListener('click', function(){
      placeInfoWindow.open(map, placeMarker); 
    });
  });
}

getLatLon(targetCity);
