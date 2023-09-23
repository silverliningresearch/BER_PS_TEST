var currentFlightList = [];
var flightListQ3;
/************************************/
function getToDate() {
  var d = new Date();
      
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month,year].join('-');
}

function find_flight_q3(list, item) {
  item = item.toLowerCase();
  
  if (item) {
    if (item !== "") {
      for (i = 0; i < list.length; i++) {
        if (list[i].Show.toLowerCase() === item) {
          $('.rt-btn.rt-btn-next').show(); 
          return true;
        }
      }
    }
  }
  $('.rt-btn.rt-btn-next').hide(); 
  return false;
}

function load_flight_q3() {
  flightListQ3 = JSON.parse(departuresFlightList);
}

function search_flight_q3() {
  var input = document.getElementById('inputFlightCodeQ3ID').value;
  var searchList = document.getElementById('flightSearchList');
  
  searchList.innerHTML = '';
  currentFlightList = [];
  currentFlightList.length = 0;
  input = input.toLowerCase();

  var today = getToDate();
  var count = 0;
  for (i = 0; i < flightListQ3.length; i++) {
    let flight = flightListQ3[i];

    if (today == flight.Date) { 
      if (flight.Show.toLowerCase().includes(input)) {
        const elem = document.createElement("option");
        elem.value = flight.Show;
        searchList.appendChild(elem);
        currentFlightList.push(flight);
        count++;
      }
    }
    
    if (count > 30) {
      break;
    }
  }

  if (find_flight_q3(flightListQ3, document.getElementById('inputFlightCodeQ3ID').value)) {
    console.log("Found ", document.getElementById('inputFlightCodeQ3ID').value);
  }
  else{
    console.log("Not found ", document.getElementById('inputFlightCodeQ3ID').value);
  }  
  
  console.log("search_flight_q3 done!");
}

function select_flight_q3() {
  var selectedFlight = document.getElementById('inputFlightCodeQ3ID').value;
  var flightDestinationValue;
  var found = false;
 //$('.rt-btn.rt-btn-next').hide(); 

  for (i = 0; i < currentFlightList.length; i++) {
    var currentFlight = currentFlightList[i];
    if (currentFlight.Show == selectedFlight) { 
      flightDestinationValue = currentFlight.Airport_name + " (" + currentFlight.Airport_code  + ")";
      api.fn.answers({flightDestination: flightDestinationValue});

      api.fn.answers({Core_Q3_ext:  selectedFlight});
      api.fn.answers({urlVar15:  currentFlight.Airline });
      api.fn.answers({urlVar16:  flightDestinationValue });
      api.fn.answers({urlVar17:  currentFlight.Flight });
      found = true;
      $('.rt-btn.rt-btn-next').show(); 
      break;
    }
  }
  if (!found) {
    alert("Please select a flight number from the list.");
  }
}

function showFlightCodeSection_q3() {
  load_flight_q3();

  $('.rt-element.rt-text-container').append(`<input list="flightSearchList" onchange="select_flight_q3()"  onkeyup="search_flight_q3()" name="inputFlightCodeQ3ID" id="inputFlightCodeQ3ID" >
  <datalist id="flightSearchList"> </datalist>`);

  var currentValue  = api.fn.answers().Core_Q3_ext;
  if (currentValue) {
    if (currentValue !== "") {
      document.getElementById('inputFlightCodeQ3ID').value = currentValue;
    }
  }

  if (find_flight_q3(flightListQ3, document.getElementById('inputFlightCodeQ3ID').value)) {
    console.log("Found ", document.getElementById('inputFlightCodeQ3ID').value);
  }
  else{
    console.log("not found ", document.getElementById('inputFlightCodeQ3ID').value);
  }
  $('#inputFlightCodeQ3ID').show(); 
}


function hideFlightCodeSection_q3() {
  $('#inputFlightCodeQ3ID').hide();
  //var x = document.getElementById('inputFlightCodeQ3ID');
  //x.style.display = "none";
}