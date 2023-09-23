var flightListQ24;

function find_flight_q24(list, item) {
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

function load_flight_q24() {
  var option = api.fn.answers().Core_Q23;
 
  if (option ===1) {
    console.log("International");
    flightListQ24 = JSON.parse(arrivalInternationalFlightList);
  } else if (option ===2) {
    console.log("Domestic");
    flightListQ24 = JSON.parse(arrivalDomesticFlightList);
  }

}

function search_flight_q24() {
  var data;

  var input = document.getElementById('inputFlightCodeQ24ID').value;
  var searchList = document.getElementById('flightSearchList');
  
  searchList.innerHTML = '';
  currentFlightList = [];
  currentFlightList.length = 0;
  input = input.toLowerCase();

  var count = 0;
  var today = getToDate();
  for (i = 0; i < flightListQ24.length; i++) {
    let flight = flightListQ24[i];

    if (today == flight.Date) { 
      if (flight.Show.toLowerCase().includes(input)) {
        console.log("search Q24");
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

  if (find_flight_q24(flightListQ24, document.getElementById('inputFlightCodeQ24ID').value)) {
    console.log("Found ", document.getElementById('inputFlightCodeQ24ID').value);
    $('.rt-btn.rt-btn-next').show(); 
  }
  else{
    console.log("not found ", document.getElementById('inputFlightCodeQ24ID').value);
    $('.rt-btn.rt-btn-next').hide(); 
  }

}

function select_flight_q24() {
  var selectedFlight = document.getElementById('inputFlightCodeQ24ID').value;
  var flightFromValue;
  var found = false;
  $('.rt-btn.rt-btn-next').hide(); 
  
  for (i = 0; i < currentFlightList.length; i++) {
    var currentFlight = currentFlightList[i];
    //console.log("_currentFlightList: ", currentFlightList);
   // console.log("_selectedFlight: ", selectedFlight);
   // console.log("currentFlight: ", currentFlight);
    
    if (currentFlight.Show == selectedFlight) { 
      flightFromValue = currentFlight.Airport_name + " (" + currentFlight.Airport_code  + ")";
      api.fn.answers({flightFrom: flightFromValue});

      api.fn.answers({Core_q24_ext:  selectedFlight});
      api.fn.answers({urlVar14:  currentFlight.Airline });
      api.fn.answers({urlVar13:  flightFromValue });
      api.fn.answers({urlVar12:  currentFlight.Flight });
      found = true;
      $('.rt-btn.rt-btn-next').show();
      break;
    }
  }
  if (!found) {
    alert("Please select a flight number from the list.");
  }
}

function showFlightCodeSection_q24() {
    load_flight_q24();

    $('.rt-element.rt-text-container').append(`<input list="flightSearchList" onchange="select_flight_q24()"  onkeyup="search_flight_q24()" name="inputFlightCodeQ24ID" id="inputFlightCodeQ24ID" >
    <datalist id="flightSearchList"> </datalist>`);
  
    var currentValue  = api.fn.answers().Core_q24_ext;
    if (currentValue) {
      if (currentValue !== "") {
        document.getElementById('inputFlightCodeQ24ID').value = currentValue;
      }
    }

    if (find_flight_q24(flightListQ24, document.getElementById('inputFlightCodeQ24ID').value)) {
      console.log("Found ", document.getElementById('inputFlightCodeQ24ID').value);
    }
    else{
      console.log("not found ", document.getElementById('inputFlightCodeQ24ID').value);
    }

    $('#inputFlightCodeQ24ID').show(); 
}


function hideFlightCodeSection_q24() {
  $('#inputFlightCodeQ24ID').hide();
  //var x = document.getElementById('inputFlightCodeQ24ID');
  //x.style.display = "none";
}