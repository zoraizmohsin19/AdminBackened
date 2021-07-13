
const { Console } = require('console');
const moment = require('moment');
var fs = require("fs");
var dateTime = require("node-datetime");


export default class GomosLogger{
    private static APILogInstance = null;
    constructor(){
    }
    private static APILoggerGanerater(){
        let dt = dateTime.create();
        let formattedDate = dt.format('Y-m-d');
        const output = fs.createWriteStream(`./ServicesLog/${"PlatFormAPI"}Std${formattedDate}.log`, { flags: "a" });
       // const errorOutput = fs.createWriteStream(`./ServicesLog/${SERVICE_NAME}Err${formattedDate}.log`, { flags: "a" });
        var gConsole = false;
        if(process.argv[4] == "1" ){
          gConsole = true;
        }
        return { logger : new Console({ stdout: output }), gConsole};
    }
    static  APILog(TRACE_LEVEL:any,massage:any,Data?:any){
        if(GomosLogger.APILogInstance == null){
          GomosLogger.APILogInstance  = GomosLogger.APILoggerGanerater();
        }
        GomosLogger.gomosLog(GomosLogger.APILogInstance,TRACE_LEVEL,massage,Data);
    }
    
 private static gomosLog(loggerhelper:any,TRACE_LEVEL:any,massage:any,Data?:any ){
    if(process.argv[3] >= TRACE_LEVEL){
    let  currTime = moment().format("HH:mm:ss:SSS");
    let logger = loggerhelper.logger;
    let logToGlobalConsole  =   loggerhelper.gConsole;
      if(Data instanceof Object){
        logger.log(currTime +"-"+massage);
        logger.log(Data);
        if(logToGlobalConsole == true){
          console.log(currTime+"-"+massage);
          console.log(Data)
        }
      }else if(Data == undefined){
        logger.log( currTime+"-"+massage);
        if(logToGlobalConsole == true){
        console.log( currTime+"-"+massage);        
        }
      }
      else{
        logger.log( currTime+"-"+massage+" ["+Data+ "]");
        if(logToGlobalConsole == true){
          console.log( currTime+"-"+massage+" ["+Data+ "]");
        }
      }
   
    }
  }
    static  unWantedLog(functionName,message){
        var DateTime = moment().format("YYYY-MM-DD HH:mm:ss:SSS");
        let writeStream = fs.createWriteStream("../unWantedLogCommanlog-" +  moment().format("YYYY-MM-DD")+ ".log", { flags: "a" });
    
      // write some data with a base64 encoding
      writeStream.write(
       "DateTime :"+ DateTime +"\n"+
       "functionName :" + functionName +"\n"+
       "message :" + message +"\n"+
        "\n"
      );
      
      // the finish event is emitted when all data has been flushed from the stream
      writeStream.on('finish', () => {  
        console.log("writen in unWantedLog file");  
      });
      
      // close the stream
      writeStream.end(); 
    
      }
      static errorCustmHandler(SERVICE_NAME:string,FUNCTION_NAME:string,MESSAGEINFO:string,CONTEXT:string,ERROR:any,ERROR_TYPE:string,ERROR_DES:boolean,EXIT_DES:boolean){
        // console.log(typeofError);
          let writeStream = fs.createWriteStream("../CommanErrorLog/commanError-" + moment().format("YYYY-MM-DD")+ ".log", { flags: "a" });
          var dateTime =  moment().format("YYYY-MM-DD HH:mm:ss:SSS");
        var errorString = "";
        
         errorString +=   "DateTime :"+ dateTime + "\n";
         errorString +=   "serviceName :"+ SERVICE_NAME + "\n";
         errorString +=  "functionName :"+ FUNCTION_NAME + "\n";
        
        if(MESSAGEINFO != ''){
          errorString += "messageInfo :" + MESSAGEINFO +"\n";
        }
        if(CONTEXT != '' && CONTEXT != undefined ){
          errorString += "context :" + CONTEXT +"\n";
        }
        if(ERROR_TYPE != '' && ERROR_TYPE != undefined  ){
          errorString += "errorType :" + ERROR_TYPE +"\n";
        }
        if(ERROR_DES == undefined  ){
          try {
            errorString  += "ErrorCode :" + ERROR.statusCode +"\n";
            errorString  += "Error :" +ERROR.toString()+ "\n";
            errorString  += "typeofErrorstack :" + ERROR.stack  +"\n";
          } catch (error) {
            errorString  += "ErrorMassage"+ ERROR +"\n";
          }
        }
        else{
          if(ERROR_DES){
            errorString += "ErrorCode :" + ERROR.statusCode +"\n";
            errorString += "Error :"  + ERROR.toString() +"\n";
            errorString += "typeofErrorstack : "+ ERROR.stack +"n";  
          }else{
            errorString += "ErrorMassage :" + ERROR +"\n"
          }
      }
        
        writeStream.write(
          errorString +
          "\n"
          );
        // the finish event is emitted when all data has been flushed from the stream
        writeStream.on('finish', () => {  
            console.log('writen in errorCustmHandler');
        });
        // close the stream
        writeStream.end(); 
        setTimeout(()=> { if(EXIT_DES){
          process.exit()
        }},1000)
       
        }
}
