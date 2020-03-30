$(document).ready(function() {
  var searchButton = $("#search");

  //Global array var
  var arrayFromStorage = JSON.parse(localStorage.getItem("cities"));

  //Current Date
  var currentDate = moment().format("MMM Do YYYY");
  console.log("currentDate", currentDate);

  //for saving cities entered to local storage, and appending them to a list
  var searchedCities = [];
  searchButton.click(function() {
    var citiesInput = document.getElementById("citiesInput").value;
    $(".citiesList").prepend(
      `<li class="list-group-item"> ${citiesInput} </li>`
    );
    var cities = {
      id: searchedCities.length,
      cityName: citiesInput
    };
    searchedCities.push(cities);
    localStorage.setItem("cities", JSON.stringify(searchedCities));
    ajaxCallDTHMUV();
  });

  //Pulls City names of previously searched cities in local storage
  function pullCities() {
    var arrayFromStorage = JSON.parse(localStorage.getItem("cities"));
    var arrayLength = arrayFromStorage.length;

    for (var i = 0; i < arrayLength; i++) {
      var cityNameFromArray = arrayFromStorage[i].cityName;
      $(".citiesList").prepend(
        `<button class="list-group-item clickable" id="click"> ${cityNameFromArray} </button>`
      );
    }
  }
  pullCities();

  //Ajax Call
  var cityArrayLength = arrayFromStorage.length;
  var finalArrayPosition = cityArrayLength - 1;
  var lastCitySearched = arrayFromStorage[finalArrayPosition].cityName;

  function ajaxCallDTHMUV() {
    //All BUT UV
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      lastCitySearched +
      "&units=imperial&APPID=ef223b58d8d5d37b8dcdbb55e928d804";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      //assets list for images
      var coordLAT = response.coord.lat;
      var coordLONG = response.coord.lon;
      $(".cityDate").text(lastCitySearched + ", " + currentDate);

      $(".temp").text("Temperature: " + response.main.temp + "°F");
      $(".hum").text("Humidity: " + response.main.humidity + "%");
      $(".wind").text("Windspeed: " + response.wind.speed + " mph");

      //Call for UV, can only be used once the first call is made because it returns the coordinates we need to find the UV
      var queryURLUV =
        "https://api.openweathermap.org/data/2.5/uvi?appid=" +
        "ef223b58d8d5d37b8dcdbb55e928d804" +
        "&lat=" +
        coordLAT +
        "&lon=" +
        coordLONG;

      $.ajax({
        url: queryURLUV,
        method: "GET"
      }).then(function(response2) {
        console.log(response2);
        $(".UV").text("UV Index: " + response2.value);


        //Call for Five Day Forcast
        var queryURL5Day = "https://api.openweathermap.org/data/2.5/forecast?q="+ lastCitySearched + "&units=imperial&APPID=ef223b58d8d5d37b8dcdbb55e928d804"
        $.ajax({
          url: queryURL5Day,
          method: "GET"
        }).then(function(response3){
        console.log("ajaxCallDTHMUV -> response3", response3)
          
        })


      });
    });
  }
  
//window.onload = ajaxCallDTHMUV();
  //function for running city search function on click of list
  
  $("#click").on("click", ajaxCallDTHMUV());
});
