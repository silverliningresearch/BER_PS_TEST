var quota_data;
var interview_data;
var today_flight_list;
var this_month_flight_list;
var daily_plan_data;

var currentMonth;
var currentDate;
var download_time;

var total_quota = 2000;
var total_completed;
var total_completed_percent;

var total_quota_completed;
var total_hard_quota;
/************************************/
function initCurrentTimeVars() {
  var d = new Date();
      
  month = '' + (d.getMonth() + 1), //month start from 0;
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  currentMonth =[month,year].join('-')
  currentDate = [day, month,year].join('-');
  //return [day, month,year].join('-');
  if (document.getElementById('year_month') && document.getElementById('year_month').value.length > 0)
  {
    if (document.getElementById('year_month').value != "current-month")
    {
      currentMonth = document.getElementById('year_month').value;
    }
  }
   console.log("currentMonth: ", currentMonth);

   switch(currentMonth) {
    case "01-2023":
    case "02-2023":
    case "03-2023":                  
    case "04-2023":
      total_quota = 2000;
      break;
    case "05-2023":
    case "06-2023":
    case "07-2023":
    case "08-2023":
    case "09-2023":      
    case "10-2023":          
      total_quota = 2500;
      break;
    case "11-2023":          
    case "12-2023":              
      total_quota = 2000;
      break;
    default:
      total_quota = 2000;
      break;
  }
}

function isCurrentMonth(interviewEndDate)
{
// Input: "2023-04-03 10:06:22 GMT"
  var interviewDateParsed = interviewEndDate.split("-")

  var interviewYear = (interviewDateParsed[0]);
  var interviewMonth =(interviewDateParsed[1]);
  
  var result = false;

  if ( currentMonth ==[interviewMonth,interviewYear].join('-'))
  {
    result = true;
  }

   return result;
}

function notDeparted(flight_time) {
  var current_time = new Date().toLocaleString('de-DE', {timeZone: 'Europe/Berlin',});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 08:05    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(3,5)*1;

  var result = (flight_time_value > current_time_value);
  return (result);
}

function prepareInterviewData() {
  var quota_data_temp = JSON.parse(airport_airline_quota);
  var interview_data_temp  = JSON.parse(interview_statistics);
  var departures_flight_list_temp  = JSON.parse(departuresFlightList);

  initCurrentTimeVars();

  //get quota data
  quota_data = [];
  quota_data.length = 0;
  for (i = 0; i < quota_data_temp.length; i++) {
    var quota_month =  quota_data_temp[i].Month + "-"  + quota_data_temp[i].Year; 
    if (quota_month== currentMonth)
    {
      quota_data.push(quota_data_temp[i]);
    }
  }

  //get relevant interview data
  //empty the list
  interview_data = [];
  interview_data.length = 0;

  download_time = interview_data_temp[0].download_time;
  for (i = 0; i < interview_data_temp.length; i++) {
    var interview = interview_data_temp[i];
    //only get complete interview & not test
    if ((isCurrentMonth(interview.InterviewDate)))
    {

      var airport_airline = '"Airport_Airline"' + ":" + '"' + interview["quota_id"] + '", ';
      var InterviewEndDate = '"InterviewEndDate"' + ":" + '"' +  interview["InterviewDate"]+ '", ' ;
      var Completed_of_interviews = '"Completed_of_interviews"' + ":" + '"' +  interview["Number of interviews"] ;
      var str = '{' + airport_airline + InterviewEndDate + Completed_of_interviews + '"}';
      interview_data.push(JSON.parse(str));
    }
  }

   //prepare flight list
  //empty the list
  today_flight_list = [];
  today_flight_list.length = 0;

  this_month_flight_list  = [];
  this_month_flight_list.length = 0;

  for (i = 0; i < departures_flight_list_temp.length; i++) {
    let flight = departures_flight_list_temp[i];
    var dhour_int = parseInt(flight.Show.substring(9,11)); //Time in fligth schedule is local time
    var dhour = "0" + dhour_int;
    dhour = dhour.substring(dhour.length-2,dhour.length);
    var dminutes = flight.Show.substring(12,14);
    var dtime = dhour + ":" + dminutes;

    //only get today & not departed flight
    //Airline
    var airline_code = flight.Flight.substring(0,2);
	
    //airport_airline
    var airport_airline = flight.Airport_code + " - " + flight.Airline

    flight.Dtime = dtime;
    flight.Airline = airline_code;
    flight.Airport_Airline = airport_airline;
	
    if ((currentDate == flight.Date) && notDeparted(dtime)) { 
      today_flight_list.push(flight);
    }

    //currentMonth: 02-2023
    //flight.Date: 08-02-2023
    if (currentMonth == flight.Date.substring(3,10)) { 
      this_month_flight_list.push(flight);
    }
  }

  //add quota data
  //empty the list
  daily_plan_data = [];
  daily_plan_data.length = 0;
  
  for (i = 0; i < today_flight_list.length; i++) {
    let flight = today_flight_list[i];
    for (j = 0; j < quota_data.length; j++) {
      let quota = quota_data[j];
      if ((quota.Airport_Airline == flight.Airport_Airline) && (quota.Quota>0))
      {
        flight.Quota = quota.Quota;
        daily_plan_data.push(flight);
       }
    }
  }
}
