import { Schema, model, connect, Types } from 'mongoose';
import { IServiceProvider} from "./IServiceProvider";

import {getDBConnectionURL} from "../../Util/db";
import * as mongoosePaginate from "mongoose-paginate";
import * as softDelete from "mongoose-delete";
import { IPaginatedModel } from "../IPaginatedModel";

connect(getDBConnectionURL(),{ useNewUrlParser: true }) 



export var ServiceProviderSchema:Schema      =   new Schema({
    name:{
        type: String,
        required: true
    },
    spCd: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mqttClient: {
        type: String,
        required: true
    },
    servicesOffered: {
        type: String,
        required: true
    },
    SubTopic: {
        type: String,
        required: true
    },
    PubTopic: {
        type: String,
        required: true
    },
    active: {
        type: String,
        required: true
    }
},
{
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

ServiceProviderSchema.plugin(softDelete);
ServiceProviderSchema.plugin(mongoosePaginate);

ServiceProviderSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

ServiceProviderSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const ServiceProvider: IPaginatedModel<IServiceProvider> = model<IServiceProvider>("ServiceProviders", ServiceProviderSchema,"ServiceProviders");