/*
 |-------------------------------------------------------------------
 |  Validation.ts - Module Validation is use to Validate different data type and application specific details
 |-------------------------------------------------------------------
 */

export default class Validation {

    private static _instance:Validation  =   null;

    //Private constructor
    private constructor(){
    }

    public static getInstance(){
        if(Validation._instance == null){
            Validation._instance  =   new Validation;
        }
        return Validation._instance
    }

    //Email address validation
    public validateEmail(email:string){
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return reg.test(email);
    }

    public validatePassword(password:string){
        var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return reg.test(password);
    }


    //Method to validate a numeber
    public validateNumber(num:number,start,end){
        if(typeof num == "string"){
            if(isNaN(num)){
                return false;
            }
        } else if(typeof num == "number" ){

        } else {
            return false;
        }

        var temp     =  parseFloat(num+'');
        
        if(start == null && end == null){
            return true;
        } else if(start == null){
            if(temp <start){
                return false;
            }
        } else if(end == null){
            if( temp > end){
                return false;
            }
        }  else {
            if(temp <start || temp > end){
                return false;
            }
        }
        return true;
    }
    
}