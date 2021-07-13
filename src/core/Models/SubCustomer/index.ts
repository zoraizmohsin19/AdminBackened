import { Schema, model, connect, Types } from 'mongoose';
import { ISubCustomer} from "./ISubCustomer";
import * as q from "q";
import * as env from './../../../../config/env.json';
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import Message from "../../Util/Message";
import {getDBConnectionURL} from "../../Util/db";
import * as mongoosePaginate from "mongoose-paginate";
import * as softDelete from "mongoose-delete";
import { IPaginatedModel } from "../IPaginatedModel";
import * as moment from  "moment";
import * as json5 from "json5"
import { ServiceProvider } from '../ServiceProvider';
import {Customer} from '../Customer/index';
var httpRequest = require('request');


connect(getDBConnectionURL(),{ useNewUrlParser: true }) 



export var SubCustomerSchema:Schema      =   new Schema({
    name: {
        type:  String,
        required: true
        
    },
    subCustCd: {
        type: String,
        required: true
    },
    custCd: {
        type: String,
        required: true
    },
    custId:{
        type:  Schema.Types.ObjectId,
        ref: Customer
    },
    spCd: {
        type: String,
        required: true
    },
    spId : {
        type:  Schema.Types.ObjectId,
        ref: ServiceProvider
       
    },
    address: {
        type:  Schema.Types.Mixed,
        required: true
    },
    phone: {
        type: String,
        required: true
       
    },
    email: {
        type: String,
        required: true
    }
   ,
   servicesTaken: {
    type: Schema.Types.Mixed,
    default: {}
    }, 
   lastModifieduser: {
    type:  String,
    required: true  
},
},
{
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

SubCustomerSchema.plugin(softDelete);
SubCustomerSchema.plugin(mongoosePaginate);

SubCustomerSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

SubCustomerSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const SubCustomer : IPaginatedModel<ISubCustomer> = model<ISubCustomer>("SubCustomers", SubCustomerSchema,"SubCustomers");