/*
 |-------------------------------------------------------------------
 |  Meesage.ts - Module message handles the message transport b/w differrent modules
 |-------------------------------------------------------------------
 */

export default class Message {

    public static INVALID_PARAM         =   1;
    public static ALREADY_EXISTS        =   2;
    public static INTERNAL_ERROR        =   3;
    public static SUCCESS               =   4;
    public static NOT_FOUND             =   5;
    public static AUTH_FAILED           =   6;
    public static INVALID_HEADER        =   7;
    public static NOT_IMPLEMENTED        =   8;

    private messageCode:number          =   null;
    private messageString:string        =   null;
    private messageData:any          =   null;

    public constructor(messageCode:number,messageString:string,data:any=null){
        this.messageCode    =   messageCode;
        this.messageString  =   messageString;
        console.log("Message Trasport Block => Message Code ["+this.messageCode+"] Message ["+this.messageString+"]");
        if(data != null){
            this.messageData  =   data;
        }
    }   

    getMessageCode(){
        return this.messageCode;
    }

    getMessageString(){
        return this.messageString;
    }

    getMessageData(){
        return this.messageData;
    }

    toJson(){
        return {
            'message_code':this.messageCode,
            'message':this.messageString,
            'statusCode':this.getResponseCode(),
            'data':this.messageData,
        }
    }

    getResponseCode(){
        var messageCode     =   this.messageCode;
        var result  =   500;
        switch(messageCode){
            case Message.INVALID_PARAM:
            case Message.INVALID_HEADER:
                result = 400;
                break;
            case Message.ALREADY_EXISTS:
            case Message.NOT_FOUND:
                result = 404;
                break;
            case Message.INTERNAL_ERROR:
            case Message.NOT_IMPLEMENTED:
                result = 500;
                break;
            case Message.SUCCESS:
                result = 200;
                break;
            case Message.AUTH_FAILED:
                result = 403;
                break;
        }
        return result;
    }
}