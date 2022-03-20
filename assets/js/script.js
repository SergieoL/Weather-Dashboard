var apiKey = "64d8b1378d410c75ca440e5b600a18ee";
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var today = moment().format("(M/DD/YYYY)");
var savedCities = [];


var getWeather = function(lat, lon) {
    apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            forecast(data);
            displayWeather(data);
            var icon = data.current.weather[0].icon;
            $(".cityName").append('<img src=http://openweathermap.org/img/w/' + icon + ".png" + ' height=50 width=50>');
        })
    })
}

var displayWeather = function(data) {

    $("#temp").html("Temperature: " + data.current.temp + "°F");
    $("#humidity").html("Humidity: " + data.current.humidity + "%");
    $("#wind").html("Wind Speed: " + data.current.wind_speed + "mph");
    $("#uv").html("UV Index: " + data.current.uvi);

    var uv = data.current.uvi
    
    if (uv <= 2) {
        $("#uv").addClass("uvGood").removeClass("uvModerate").removeClass("uvSevere");
    }
    else if (uv > 2 && uv < 8) {
        $("#uv").addClass("uvModerate").removeClass("uvGood").removeClass("uvSevere");
    }
    else {
        $("#uv").addClass("uvSevere").removeClass("uvGood").removeClass("uvModerate");
    }
    

}


var getCords = function(city) {
    apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;
    $(".cityName").html(city + " " + today);

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            getWeather(data[0].lat, data[0].lon);
            
        })
    })
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    savedCities.push(city);
    saveCities();
    cityInputEl.value = "";
    $(".forecast").empty();
    getCords(city);
    $(".cityList").append("<p class='citylist'>" + city + "</p>");

}

$(".cityList").on("click", "p", function(event) {
    var city = $(this).html();
    $(".forecast").empty();
    getCords(city);

})

var forecast = function(data) {
    
    for (i = 1; i < 6; i++) {
        var nextDays = moment().add(i, "days").format("(M/DD/YYYY)");
        var icon = data.daily[i].weather[0].icon;
        $(".forecast").append('<div class="col-2">' +
        '<div class="card text-light bg-secondary"' +
        '<h3 class="card-subtitle m-1">' + nextDays + '</h3>' +
        '<img src=http://openweathermap.org/img/w/' + icon + ".png" + ' height=50 width=50>' +
        '<div class="card-body">' +
        '<p>Temp:' + data.daily[i].temp.day + '°F</p>' +
        '<p>Wind: ' + data.daily[i].wind_speed + 'mph</p>' +
        '<p>Humidity: ' + data.daily[i].humidity + '%</p>' +
        '</div></div></div>');
    }
}

var saveCities = function() {
    localStorage.setItem("Cities", JSON.stringify(savedCities));
}

var loadCities = function() {
    var loadCities = localStorage.getItem("Cities");
    var cities = JSON.parse(loadCities);

    if (cities) {
        for ( i =0; i < cities.length; i++) {
            $(".cityList").append("<p>" + cities[i] + "</p>");
        }
    }
}

loadCities();
cityFormEl.addEventListener("submit", formSubmitHandler);


