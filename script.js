$(document).ready(function() {
  var searchButton = $("#search");

  console.log("Document is Ready.");

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
  });

  //Pulls City names of previously searched cities in local storage
  function pullCities() {
    var arrayFromStorage = JSON.parse(localStorage.getItem("cities"));
    var arrayLength = arrayFromStorage.length;

    for (var i = 0; i < arrayLength; i++) {
      var cityNameFromArray = arrayFromStorage[i].cityName;
      $(".citiesList").prepend(
        `<li class="list-group-item"> ${cityNameFromArray} </li>`
      );
    }
  }
  pullCities();
});
