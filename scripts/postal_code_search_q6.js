var postalCodeQ6;

function find_postal_code_q6(list, item) {
  item = item.toLowerCase();
  
  if (item) {
    if (item !== "") {
      for (i = 0; i < list.length; i++) {
        if (list[i].Name.toLowerCase() === item) {
          $('.rt-btn.rt-btn-next').show(); 
          return true;
        }
      }
    }
  }
  //$('.rt-btn.rt-btn-next').hide(); 
  return false;
}

function load_postal_code_q6() {
  console.log("load_postal_code_q6 started...");

  var country = api.fn.answers().Core_Q6_1_text;

  if (country ==="Republica Checa" || country ==="Tchéquie" || country ==="Republika Czeska" 
      || country ==="Çek Cumhuriyeti" || country ==="Tschechien" || country ==="Czech Republic")  {
    postalCodeQ6 = JSON.parse(postalCodeCzech);
  } else if (country ==="Germany" || country ==="Deutschland" || country ==="Almanya" 
             || country ==="Niemcy" || country ==="Allemagne" || country ==="Alemania") {
    postalCodeQ6 = JSON.parse(postalCodeGermany);
  }
  else if (country ==="Poland" || country ==="Polonya" || country ==="Polska" 
          || country ==="Pologne" || country ==="Polonia" || country ==="Polen")  {
    postalCodeQ6 = JSON.parse(postalCodePoland);
  }
  else {
    postalCodeQ6 = JSON.parse(postalCodeNone);
  }

  console.log("country: ", country);
  console.log("load_postal_code_q6 done!");
}

function search_postal_code_q6() {
  var input = document.getElementById('inputPostalCodeQ6ID').value;
  var list = document.getElementById('postalCodeQ6List');
  
  list.innerHTML = '';
  input = input.toLowerCase();

  console.log("search_postal_code_q6 started...");
  var count = 0;
  for (i = 0; i < postalCodeQ6.length; i++) {
    let postcalCode = postalCodeQ6[i];

    if (postcalCode.Name.toLowerCase().includes(input)) {
      const elem = document.createElement("option");
      elem.value = postcalCode.Name;
      list.appendChild(elem);
      count++;
    }
    if (count > 30) break;
  }

  console.log("search_postal_code_q6 done!");
  
  if (find_postal_code_q6(postalCodeQ6, document.getElementById('inputPostalCodeQ6ID').value)) {
    console.log("Found ", document.getElementById('inputPostalCodeQ6ID').value);
  }
  else{
    console.log("not found ", document.getElementById('inputPostalCodeQ6ID').value);
  }
}

function select_postal_code_q6() {
  var postalCode = document.getElementById('inputPostalCodeQ6ID').value;
  api.fn.answers({Core_Q6a_ext:  postalCode});
  api.fn.answers({urlVar19:  postalCode});
  api.fn.answers({q6_search_list:  postalCode});
  
  console.log("select_postal_code_q6 started...");
      
  if (find_postal_code_q6(postalCodeQ6, document.getElementById('inputPostalCodeQ6ID').value)) {
    console.log("Found ", document.getElementById('inputPostalCodeQ6ID').value);
  }
  else{
    console.log("not found ", document.getElementById('inputPostalCodeQ6ID').value);
    alert("Please select a postal code from the list.");
  }

  console.log("select_postal_code_q6 done!");
}

function showPostalCodeSection_q6() {
    load_postal_code_q6();  

    $('.rt-element.rt-text-container').append(`<input list="postalCodeQ6List" onchange="select_postal_code_q6()"  onkeyup="search_postal_code_q6()" name="inputPostalCodeQ6Name" id="inputPostalCodeQ6ID" >
    <datalist id="postalCodeQ6List"> </datalist>`);
    document.getElementById('inputPostalCodeQ6ID').value = "";

    var currentValue  = api.fn.answers().urlVar19;
    if (currentValue) {
      if (currentValue !== "") {
        document.getElementById('inputPostalCodeQ6ID').value = currentValue;
      }
    }

    if (find_postal_code_q6(postalCodeQ6, document.getElementById('inputPostalCodeQ6ID').value)) {
      console.log("Found ", document.getElementById('inputPostalCodeQ6ID').value);
    }
    else{
      console.log("not found ", document.getElementById('inputPostalCodeQ6ID').value);
    }

    //$('.rt-btn.rt-btn-next').hide(); 
    $('#inputPostalCodeQ6ID').show(); 
}

function hidePostalCodeSection_q6() {
  $('#inputPostalCodeQ6ID').hide();
}
