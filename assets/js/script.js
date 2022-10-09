var targetCity = 'New York City';
var googleKey = 'AIzaSyDh2jcs3sWSy_5L5y-hdC0bryjDAjOEZTg';
var weatherKey = '66b15a5b3951d15de56c5d2c4e2ddcba';

function getLatLon(city) {
  var geoURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + weatherKey;
  fetch(geoURL).then(response => {
    return response.json()
  }).then(data => {
    console.log(data);
  }) 
}

getLatLon(targetCity);