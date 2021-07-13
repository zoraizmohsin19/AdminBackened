import { Schema, model, connect, Types } from 'mongoose';
import { IAlertConfig} from "./IAlertConfig";
import * as q from "q";
import Message from "../../Util/Message";
import {getDBConnectionURL} from "../../Util/db";
import * as mongoosePaginate from "mongoose-paginate";
import * as softDelete from "mongoose-delete";
import { IPaginatedModel } from "../IPaginatedModel";
import {SubCustomer} from '../SubCustomer';

var httpRequest = require('request');

var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");

var secret_key =    "anf123k5md78kr39ktnf94jthrJJHJ89";

connect(getDBConnectionURL(),{ useNewUrlParser: true }) 
// THIS IS CHECKING DATA WORKING OR NOT ...

export var AlertsConfigSchema:Schema      =   new Schema({
    name: {
        type:String
    },
    spCd: {
        type: String
       
    },
    custCd: {
        type: String
       
    },
    subCustCd: { type: String, 
      },
    subCustId: { type: Schema.Types.ObjectId, ref: SubCustomer },
    sensorNm: {
        type: String,
       
    },
    businessNm: {
        type: String,
        
    },
    configBNm: {
        type: String,
       
    },
    lastModifieduser:{
        type: String
    },
    shortName:{
        type: String
    },
   
    type:{
        type: String,
        required: true
    },
    criteria:{
        type: String
    },
    emailRecipientRole: {
        type: Schema.Types.Mixed,
       
    },
    alertTriggeredBy: {
        type: String 
    },
    alertText:{
        type: String
    }
},
{
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

AlertsConfigSchema.plugin(softDelete);
AlertsConfigSchema.plugin(mongoosePaginate);

AlertsConfigSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

AlertsConfigSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const AlertConfig: IPaginatedModel<IAlertConfig> = model<IAlertConfig>("AlertsConfig", AlertsConfigSchema,"AlertsConfig");