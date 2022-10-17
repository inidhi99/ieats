// ASSIGNMENT CODE
var weatherKey = '66b15a5b3951d15de56c5d2c4e2ddcba';

// DEPENDENCIES
var weatherWidget = document.querySelector(".weather");

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



getWeather(40.7127281, -74.0060152);
getForecast(40.7127281, -74.0060152);

// Review submit form and rating script
var stars = document.querySelectorAll(`.fa-star`);
var totalStars = 0;

stars.forEach((star, index) => {
  star.dataset.rating = index + 1;
  star.addEventListener('mouseover', onMouseOver);
  star.addEventListener('click', onClick);
  star.addEventListener('mouseleave', onMouseLeave);
});

function onMouseOver(e) {
  const ratingVal = e.target.dataset.rating;
  if (!ratingVal) {
    return;
  } else {
    fill(ratingVal);
  }
}
function fill(ratingVal) {
  for (let i = 0; i < 5; i++) {
    if (i < ratingVal) {
      stars[i].classList.replace('fa-star-o', 'fa-star');
    } else {
      stars[i].classList.replace('fa-star', 'fa-star-o');
    }
  }
}

function onMouseLeave(e) {
  fill(totalStars);
}

function onClick(e) {
  const ratingVal = e.target.dataset.rating;
  totalStars = ratingVal;
  fill(totalStars);
  heading.innerHTML = ratingVal;
}
$(document).ready(function () {
  $('input#input_text, textarea#textarea2').characterCounter();
});

var nameEl = document.getElementById("input_text");
var reviewEl = document.getElementById("textarea2");
var reviewBtn = document.getElementById("subBtn");

reviewBtn.onclick = function () {
  var name = nameEl.value;
  var review = reviewEl.value;

  console.log(name);
  console.log(review);

  if (name && review) {
    localStorage.setItem(name, review);
    location.reload();

  }
};


//modal script 
$(document).ready(function () {
  $('.modal').modal();
});


