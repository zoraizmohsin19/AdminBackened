import * as mongoConfig from "../../../config/mongo.json";

export function getDBConnectionURL(){
    // var db_name:string         =   mongoConfig['db_name'];
    // var host:string            =   mongoConfig['host'];
    // var port:string            =   mongoConfig['port'];
    // var username:string        =   mongoConfig['username'];
    // var password:string        =   mongoConfig['password'];

    // var credentials            =    "";
    // if(username.length != 0 && password.length != 0){
    //     credentials             =   username+":"+password+"@";
    // }
    var urlConn ;
    if(mongoConfig[process.argv[2]] !== undefined  ){
        urlConn=  mongoConfig[process.argv[2]][0]
        console.log(`Environment set to : ${mongoConfig[process.argv[2]][1]}`)
    }else{
        console.log("Not a proper command to start the server!!");
            process.exit();
    }

    return urlConn;
}