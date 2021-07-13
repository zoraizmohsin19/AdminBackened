
const { Console } = require('console');
const moment = require('moment');
var dateTime = require("node-datetime");
var fs = require("fs");
var dt = dateTime.create();

export class DateOp {
    
// THIS IS METHOD FOR CALCULATE INDIAN STANDER TIME
static dateFloor = function (date) {
    let timeString =  date.toISOString();
    let a = timeString.split("T");
    let b =  a[1].split(":");
  let  myTime
if(b[1] > 30){
 myTime =  moment(a[0]+"T"+b[0]+":30:00.000Z");

 }else{
     let temp1 =  (moment(date.toISOString()).subtract(1, "hours")).toISOString();
    //  let t2 =  t.toISOString();
     let t3 = temp1.split("T");
     let t4 =  t3[1].split(":");
     myTime =  moment(t3[0]+"T"+t4[0]+":30:00.000Z");
 }


    return myTime;
}

// THIS IS METHOD FOR CALCULATE INDIAN STANDER TIME
static calcIST = function (date) {
    let d = new Date(date);
  // let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    return new Date(utc + (3600000 * 5.5));
}
// THIS IS METHOD FOR CALCULATE ANY REGION TIME
static calcWATZ = function (date,offset) {
    let d = new Date(date);
  // let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    return new Date(utc + (3600000 * offset));
}


// THIS IS METHOD FOR CALCULATE UTC STANDER TIME
static calcUtc = function (date) {
    let d = new Date(date);
    // let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    let utc = d.getTime()
    return new Date(utc - (3600000 * 5.5));
}



// THIS IS TAKE INT VALUE AND CONVERT TO 2 DECIMAL POINT 
static convertIntTodecPoint = function (value, decimals) {
    return Math.floor(value * (Math.pow(10, decimals))) / (Math.pow(10, decimals));
}



//THIS IS DATE SPLITE IN HOURLY AND RETURN ARRAY OF STARTTIME AND ENDTIME.
static dateSpliterInHourly = function (startRangeparam, endRangeparam) {

    let startRange = moment(startRangeparam);
    let endRange = moment(endRangeparam);
    let totalHours = endRange.diff(startRange, 'hours');
    let hoursArray = [];
    let startTime = startRange.toISOString();
    for (let i = 0; i < totalHours; i++) {
        let endTime = moment(startTime).add(1 , "hours");
        // endTime.set({ minute: 30, second: 0, millisecond: 0 })
        hoursArray.push({ startTime: startTime, endTime: endTime.toISOString() });
        startTime = endTime.toISOString();
    }
    return hoursArray;
}
}