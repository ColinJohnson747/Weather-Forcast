$(document).ready(function() {
  var searchButton = $("#search");

  //Global array var
  var arrayFromStorage = JSON.parse(localStorage.getItem("searchedCities"));

  //Current Date
  var currentDate = moment().format("MMM Do YYYY");

  //for saving cities entered to local storage, and appending them to a list

  $("#search").click(function() {
    var citiesInput = document.getElementById("citiesInput").value;

    $(".citiesList").prepend(
      `<button class="list-group-item clickMe"  > ${citiesInput} </button>`
    );
    var searchedCities = [];

    searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

    searchedCities.push(citiesInput);
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
  });

  //Pulls City names of previously searched cities in local storage
  function pullCities() {
    var arrayFromStorage = JSON.parse(localStorage.getItem("searchedCities"));
    var arrayLength = arrayFromStorage.length;

    for (var i = 0; i < arrayLength; i++) {
      var cityNameFromArray = arrayFromStorage[i];
      $(".citiesList").prepend(
        `<button class="list-group-item clickMe"  id="click"> ${cityNameFromArray} </button>`
      );
    }
  }

  //function for running city search function on click of list

  var cityArrayLength = arrayFromStorage.length;
  var finalArrayPosition = cityArrayLength - 1;
  var lastCitySearched = arrayFromStorage[finalArrayPosition];

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
        if (response2.value <= 2.99) {
          $(".UV").addClass("low");
        } else if (response2.value >= 3 && response2.value <= 5.99) {
          $(".UV").addClass("moderate");
        } else if (response2.value >= 6 && response2.value <= 7.99) {
          $(".UV").addClass("high");
        } else if (response2.value >= 8 && response2.value <= 10.99) {
          $(".UV").addClass("veryHigh");
        } else {
          $(".UV").addClass("extreme");
        }
        //Call for Five Day Forcast
        var queryURL5Day =
          "https://api.openweathermap.org/data/2.5/forecast?q=" +
          lastCitySearched +
          "&units=imperial&APPID=ef223b58d8d5d37b8dcdbb55e928d804";
        $.ajax({
          url: queryURL5Day,
          method: "GET"
        }).then(function(response3) {
          $(".Futurecast").empty();
          for (i = 6; i < response3.list.length; i += 8) {
            var date = response3.list[i].dt_txt;
            var weatherIcon = response3.list[i].weather[0].icon;
            var currentTemp = response3.list[i].main.temp;
            var currentHumidity = response3.list[i].main.humidity;

            $(".Futurecast").append(
              `<div class='card box row ${i}' style='width: 18rem;'></div>`
            );

            $(`.${i}`).append(
              `<img src="weather/${weatherIcon}.png" class="card-img-top">`
            );
            $(`.${i}`).append(`<p class="date ">${date}</p>`);
            $(`.${i}`).append(
              `<p class="temperature"> Temp: ${currentTemp} °F</p>`
            );
            $(`.${i}`).append(
              `<p class="humidity">Humidity: ${currentHumidity}%</p>`
            );
          }
        });
      });
    });
  }

  function ajaxCallOnClick() {
    //All BUT UV
    var clickedCity = $(this).textContent;
    console.log("ajaxCallOnClick -> clickedCity", clickedCity);

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      clickedCity +
      "&units=imperial&APPID=ef223b58d8d5d37b8dcdbb55e928d804";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      //assets list for images
      var coordLAT = response.coord.lat;
      var coordLONG = response.coord.lon;
      $(".cityDate").text(clickedCity + ", " + currentDate);

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
        if (response2.value <= 2.99) {
          $(".UV").addClass("low");
        } else if (response2.value >= 3 && response2.value <= 5.99) {
          $(".UV").addClass("moderate");
        } else if (response2.value >= 6 && response2.value <= 7.99) {
          $(".UV").addClass("high");
        } else if (response2.value >= 8 && response2.value <= 10.99) {
          $(".UV").addClass("veryHigh");
        } else {
          $(".UV").addClass("extreme");
        }
        //Call for Five Day Forcast
        var queryURL5Day =
          "https://api.openweathermap.org/data/2.5/forecast?q=" +
          lastCitySearched +
          "&units=imperial&APPID=ef223b58d8d5d37b8dcdbb55e928d804";
        $.ajax({
          url: queryURL5Day,
          method: "GET"
        }).then(function(response3) {
          $(".Futurecast").empty();
          for (i = 6; i < response3.list.length; i += 8) {
            var date = response3.list[i].dt_txt;
            var weatherIcon = response3.list[i].weather[0].icon;
            var currentTemp = response3.list[i].main.temp;
            var currentHumidity = response3.list[i].main.humidity;

            $(".Futurecast").append(
              `<div class='card box row ${i}' style='width: 18rem;'></div>`
            );

            $(`.${i}`).append(
              `<img src="weather/${weatherIcon}.png" class="card-img-top">`
            );
            $(`.${i}`).append(`<p class="date ">${date}</p>`);
            $(`.${i}`).append(
              `<p class="temperature"> Temp: ${currentTemp} °F</p>`
            );
            $(`.${i}`).append(
              `<p class="humidity">Humidity: ${currentHumidity}%</p>`
            );
          }
        });
      });
    });
  }

  let clickMeButton = $(".clickMe");

  $("#search").on("click", ajaxCallDTHMUV());
  clickMeButton.click(ajaxCallOnClick());

  window.onload = pullCities();
  window.onload = ajaxCallDTHMUV();
  //function for running city search function on click of list
});
