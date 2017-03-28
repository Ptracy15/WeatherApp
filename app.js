// app setup for Weather APP
// -------------------------
var express = require("express");
var app = express();
var request = require("request");
var Forecast = require("forecast");
var NodeGeocoder = require("node-geocoder");
var moment = require("moment");
var getWeather = require("weather-js");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// ------------------
// Set up geocode API
// ------------------
var geocoderOptions = {
    provider: "google",
    apiKey: "AIzaSyAVxocnoY93KKKQBzWuNpyFWTZRqKnZuTQ",
    formatter: null
}

var geocoder = NodeGeocoder(geocoderOptions);
// ------------------

// ------------------
// initialize forecast
// ------------------
var forecast = new Forecast({
    service: "darksky",
    key: "a91d1e5b26e7673401d229ac83c52983",
    units: "fahrenheit",
    cache: true,
    ttl: {
        minutes: 27,
        seconds: 45
    }
});

// better weather api
getWeather.find({search: 'Chicago', degreeType: 'F'}, function(err, results){
    if(err){
        console.log(err);
    }
    console.log(results[1].forecast);
});

// ------------------

app.get("/", function(req, res){
    res.render("home");
});

app.get("/weatherResults", function(req, res){
    var searchTerm = req.query.search;
    var currentDay = moment().format('dddd');
    
    getWeather.find({search: searchTerm, degreeType: 'F'}, function(err, results){
        if(err){
            console.log(err);
        }
        console.log(results);
        var weatherForecast = results[1].forecast;
        console.log(weatherForecast);
        res.render("weatherResults", {weatherForecast: weatherForecast, searchTerm: searchTerm});
    });
    
    // geocoder.geocode(searchTerm, function(err, data){
    //     if(err){
    //         console.log(err);
    //     }
    //     var lat = (data[0].latitude);
    //     var long = (data[0].longitude);
    //     forecast.get([lat, long], function(err, weather){
    //         if(err){
    //             console.log(err);
    //         }
    //         var forecast = weather.daily;
    //         console.log(forecast);
    //         res.render("weatherResults", {forecast: forecast, searchTerm: searchTerm, currentDay: currentDay});
    //     });
    // });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started!");
});