const readline = require('readline-sync');
const axios = require("axios");
var deviceTemplate = {
  "DeviceName": "",
  "mac": "",
  "assetId": "",
  "subCustCd": "",
  "roles": {
      "operaterKey": "takreem@asagrisystems.com",
      "supportkey": "bhavesh@asagrisystems.com"
  },
  "deviceTemplate": "",
  "active": "Y",
  "sensors": {
      "S01": {
          "businessName": "WPC_Auto",
          "configName": "Auto",
          "sortName": "AUTO",
          "Type": "Sensor",
          "aggregationProcesse": "N",
          "climateControl": {
            "flag": "N",
            "max": 0,
            "min": 0
        },
          "group": "1",
          "displayPosition": 1
      },
      "S02": {
          "businessName": "WPC_L1",
          "configName": "L1",
          "sortName": "LEVEL1",
          "Type": "Sensor",
          "aggregationProcesse": "N",
          "climateControl": {
            "flag": "N",
            "max": 0,
            "min": 0
        },
          "group": "2",
          "displayPosition": 2
      },
      "S03": {
          "businessName": "WPC_L2",
          "configName": "L2",
          "sortName": "LEVEL2",
          "Type": "Sensor",
          "aggregationProcesse": "N",
          "climateControl": {
            "flag": "N",
            "max": 0,
            "min": 0
        },
          "group": "2",
          "displayPosition": 3
      },
      "S04": {
          "businessName": "WPC_L3",
          "configName": "L3",
          "sortName": "LEVEL3",
          "Type": "Sensor",
          "aggregationProcesse": "N",
          "climateControl": {
            "flag": "N",
            "max": 0,
            "min": 0
        },
          "group": "2",
          "displayPosition": 4
      },
      "S05": {
          "businessName": "WPC_L4",
          "configName": "L4",
          "sortName": "LEVEL4",
          "Type": "Sensor",
          "aggregationProcesse": "N",
          "climateControl": {
            "flag": "N",
            "max": 0,
            "min": 0
        },
          "group": "2",
          "displayPosition": 5
      },
      "S06": {
          "businessName": "WPC_P1",
          "configName": "P1",
          "sortName": "PUMP1",
          "Type": "Sensor",
          "aggregationProcesse": "N",
          "climateControl": {
            "flag": "N",
            "max": 0,
            "min": 0
        },
          "group": "1",
          "displayPosition": 6
      },
      "S07": {
          "businessName": "WPC_P2",
          "configName": "P2",
          "sortName": "PUMP2",
          "Type": "Sensor",
          "aggregationProcesse": "N",
          "climateControl": {
              "flag": "N",
              "max": 0,
              "min": 0
          },
          "group": "1",
          "displayPosition": 7
      },
      "S08": {
          "businessName": "WPC_P3",
          "configName": "P3",
          "sortName": "PUMP3",
          "Type": "Sensor",
          "aggregationProcesse": "N",
          "climateControl": {
            "flag": "N",
            "max": 0,
            "min": 0
        },
          "group": "1",
          "displayPosition": 8
      },
      "S09": {
          "businessName": "WPC_P4",
          "configName": "P4",
          "sortName": "PUMP4",
          "Type": "Sensor",
          "aggregationProcesse": "N",
          "climateControl": {
            "flag": "N",
            "max": 0,
            "min": 0
        },
          "group": "1",
          "displayPosition": 9
      }
  },
  "channel": {},
  "defaultGroupInfo": "1",
  "deviceTypes": "deviceType1"
};

var payloads= [{ 
 "payloadId": "WPC",
"mac": "",
"processByFact": "Y",
"AckProcess": "N",
"processByState": "Y",
"processByActiveJobs": "N",
"originatedFrom": "Device",
"formStructure": "empty",
"sensors": {
    "Sensor": {
        "Auto": "WPC_Auto",
        "L1": "WPC_L1",
        "L2": "WPC_L2",
        "L3": "WPC_L3",
        "L4": "WPC_L4",
        "P1": "WPC_P1",
        "P2": "WPC_P2",
        "P3": "WPC_P3",
        "P4": "WPC_P4"
    },
    "Date": {
        "Date": "Date"
    }
},
"processByInstructionError": "N","processByDeviceUpTime": "N"}]


 function payloadInsert(mac) {
    payloads.map( async item2 => {
        item2["mac"] =  mac;
          let temp = item2
        await axios.post("http://localhost:3100/payload/store", temp).then(
            result => {
             console.log(result["data"]);
            }
          ).catch(
            err => {
              console.log(err.response.data.message)
            }
          ) 

    })
}

function validateAsset(assetId,subCustCd) {
    return new Promise(async (resolve, reject) => {
        await axios.get("http://localhost:3100/asset/"+assetId+"/"+subCustCd).then(
            result => {
                // console.log("this is data",result["data"] )
                if(result.data.data != null  && result.data.message_code == 4 &&  result.data.data.deleted == false){
                    resolve({status :true})
                }else{
                    
                    resolve({status :false})
                }
           
            }
          ).catch(
            err => {
              console.log(err.response.data.message);
              resolve({status :false})
            }
          ) 
        })

}

function validatemac(mac) {
    return new Promise(async (resolve, reject) => {
        await axios.get("http://localhost:3100/device/"+mac).then(
            result => {
               if(result.data.data.length == 0){
                    resolve({status :true})
                }
                else{
                    resolve({status :false})
                }
           
            }
          ).catch(
            err => {
              console.log(err.response.data.message);
              resolve({status :false})
            }
          ) 
        })

}
function validateSubCustCd(subCustCd) {
    return new Promise(async (resolve, reject) => {
        await axios.get("http://localhost:3100/subcustomer/"+subCustCd).then(
            result => {
                // console.log("this is data",result["data"] )
                if(result.data.data != null  && result.data.message_code == 4 &&  result.data.data.deleted == false){
                    resolve({status :true})
                }else{
                    
                    resolve({status :false})
                }
           }
          ).catch(
            err => {
              console.log(err.response.data.message);
              resolve({status :false})
            }
          ) 
        });

}
 function  deviceInsert(DeviceName,mac,assetId,subCustCd) {


// console.log(templateForProcess)
deviceTemplate["DeviceName"] = DeviceName;
deviceTemplate["mac"] =  mac;
deviceTemplate["assetId"] =  assetId;
deviceTemplate["subCustCd"] =  subCustCd;
  let temp = deviceTemplate
  axios.post("http://localhost:3100/device/store", temp).then(
    result => {
      console.log(result["data"]);
    }
  ).catch(
    err => {
      console.log(err.response.data.message)
    }
  )

}



setTimeout(async () => {
  


    let DeviceName = readline.question('Please insert DeviceName? ');
    if (DeviceName == null || DeviceName.trim().length == 0) {
        console.log("DeviceName is not present", DeviceName);
    }
    let mac = readline.question('Please insert mac? ');
    if (mac == null || mac.trim().length == 0) {
        console.log("mac is not present", mac);
        return;
    }
    let value2 = await validatemac(mac);
    if (value2.status != true ) {
        console.log("This is mac already in db please check once", mac);
        return;
    }

    let subCustCd = readline.question('Please insert subCustCd? ');
    if (subCustCd == null || subCustCd.trim().length == 0) {
        console.log("subCustCd is not present", subCustCd);
        return;
    };
    const value1 = await  validateSubCustCd(subCustCd)
    if (value1.status != true ) {
        console.log("SubCustCd is not present in db please insert SubCustomer", assetId);
        return;
    }

    let assetId = readline.question('Please insert assetId? ');
    
    if (assetId == null || assetId.trim().length == 0) {
        console.log("assetId is not present", assetId);
        return;
    }
    const value = await validateAsset(assetId,subCustCd);
    if (value.status != true ) {
        console.log("assetId is not present in db please insert Asset", assetId);
        return;
    }
 
   
  
    console.log("this is Asset", value)
    console.log("this is subCustomer", value1)


    await deviceInsert(DeviceName, mac, assetId, subCustCd);
    await payloadInsert(mac);
 }, 100)


