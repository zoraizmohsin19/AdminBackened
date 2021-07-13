import { Schema, model, connect, Types } from 'mongoose';
import { ICustomer} from "./ICustomer";

import {getDBConnectionURL} from "../../Util/db";
import * as mongoosePaginate from "mongoose-paginate";
import * as softDelete from "mongoose-delete";
import { IPaginatedModel } from "../IPaginatedModel";
import {ServiceProvider} from '../ServiceProvider';


connect(getDBConnectionURL(),{ useNewUrlParser: true }) 


export var  CustomerSchema:Schema      =   new Schema({
    name: {
        type:  String,
        required: true
    },
    custCd: {
        type:  String,
        required: true
    },
    spCd : {
        type:  String,
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
    phone : {
        type:  String,
        required: true
    },
     email: {
        type:  String,
        required: true
    },
    servicesTaken: {
        type: Schema.Types.Mixed,
        default: {}
    },
    mqttClient: {
        type:  String,
        required: true
    },
    
    description: {
        type:  Schema.Types.Mixed,
        required: true
    },
    active : {
        type:  Boolean,
        required: true
    },
    urlToSend: {
        type:  String,
        required: true
    },

    SubTopic: {
        type:  String,
        required: true
    },
     PubTopic: {
        type:  String,
        required: true
    },
    lastModifieduser: {
        type:  String,
        required: true  
    }
},
    { minimize: false,
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

CustomerSchema.plugin(softDelete);
CustomerSchema.plugin(mongoosePaginate);

CustomerSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

CustomerSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const  Customer: IPaginatedModel<ICustomer> = model<ICustomer>("Customers", CustomerSchema,"Customers");