var postalCodeq27;

function find_postal_code_q27(list, item) {
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

function load_postal_code_q27() {
  console.log("load_postal_code_q27 started...");

  var country = api.fn.answers().Core_Q27_6_text;
  if (country ==='Republica Checa' || country ==='Tchéquie' || country ==='Republika Czeska' 
  || country ==='Çek Cumhuriyeti' || country ==='Tschechien' || country ==='Czech Republic')  {
    postalCodeq27 = JSON.parse(postalCodeCzech);
  } else if (country ==='Germany' || country ==='Deutschland' || country ==='Almanya' 
            || country ==='Niemcy' || country ==='Allemagne' || country ==='Alemania') {
    postalCodeq27 = JSON.parse(postalCodeGermany);
  }
  else if (country ==='Poland' || country ==='Polonya' || country ==='Polska' 
  || country ==='Pologne' || country ==='Polonia' || country ==='Polen')  {
    postalCodeq27 = JSON.parse(postalCodePoland);
  }
  else {
    postalCodeq27 = JSON.parse(postalCodeNone);
  }

  console.log("load_postal_code_q27 done!");
}

function search_postal_code_q27() {
  var input = document.getElementById('inputPostalCodeQ27ID').value;
  var list = document.getElementById('postalCodeq27List');
  
  list.innerHTML = '';
  input = input.toLowerCase();

  console.log("search_postal_code_q27 started...");
  var count = 0;
  for (i = 0; i < postalCodeq27.length; i++) {
    let postcalCode = postalCodeq27[i];

    if (postcalCode.Name.toLowerCase().includes(input)) {
      const elem = document.createElement("option");
      elem.value = postcalCode.Name;
      list.appendChild(elem);
      count++;
    }
    if (count > 30) break;
  }

  console.log("search_postal_code_q27 done!");
  
  if (find_postal_code_q27(postalCodeq27, document.getElementById('inputPostalCodeQ27ID').value)) {
    console.log("Found ", document.getElementById('inputPostalCodeQ27ID').value);
  }
  else{
    console.log("not found ", document.getElementById('inputPostalCodeQ27ID').value);
  }
}

function select_postal_code_q27() {
  var postalCode = document.getElementById('inputPostalCodeQ27ID').value;
  api.fn.answers({Core_q27a_ext:  postalCode});
  api.fn.answers({q27_search_list:  postalCode});
  api.fn.answers({urlVar18:  postalCode});
  api.fn.answers({q27_Goolge_Maps: ""});
  console.log("q27_search_list:", postalCode);
  
    
  if (find_postal_code_q27(postalCodeq27, document.getElementById('inputPostalCodeQ27ID').value)) {
    console.log("Found ", document.getElementById('inputPostalCodeQ27ID').value);
  }
  else{
    console.log("not found ", document.getElementById('inputPostalCodeQ27ID').value);
    alert("Please select a postal code from the list.");
  }

  console.log("select_postal_code_q27 done!");
}

function showPostalCodeSection_q27() {
    load_postal_code_q27();  

    $('.rt-element.rt-text-container').append(`<input list="postalCodeq27List" onchange="select_postal_code_q27()"  onkeyup="search_postal_code_q27()" name="inputPostalCodeQ27ID" id="inputPostalCodeQ27ID" >
    <datalist id="postalCodeq27List"> </datalist>`);
    document.getElementById('inputPostalCodeQ27ID').value = "";

    var currentValue  = api.fn.answers().urlVar18;
    if (currentValue) {
      if (currentValue !== "") {
        document.getElementById('inputPostalCodeQ27ID').value = currentValue;
      }
    }

    if (find_postal_code_q27(postalCodeq27, document.getElementById('inputPostalCodeQ27ID').value)) {
      console.log("Found ", document.getElementById('inputPostalCodeQ27ID').value);
    }
    else{
      console.log("not found ", document.getElementById('inputPostalCodeQ27ID').value);
    }

    //$('.rt-btn.rt-btn-next').hide(); 
    $('#inputPostalCodeQ27ID').show(); 
}

function hidePostalCodeSection_q27() {
  $('#inputPostalCodeQ27ID').hide();
  //var x = document.getElementById('inputPostalCodeQ27ID');
  //x.style.display = "none";
}

/* function waitForElement(querySelector, timeout){
  return new Promise((resolve, reject)=>{
    var timer = false;
    if(document.querySelectorAll(querySelector).length) return resolve();
    const observer = new MutationObserver(()=>{
      if(document.querySelectorAll(querySelector).length){
        observer.disconnect();
        if(timer !== false) clearTimeout(timer);
        return resolve();
      }
    });
    observer.observe(document.body, {
      childList: true, 
      subtree: true
    });
    if(timeout) timer = setTimeout(()=>{
      observer.disconnect();
      reject();
    }, timeout);
  });
} */