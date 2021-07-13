import { Schema, model, connect, Types } from 'mongoose';
import { IDeviceTemplate} from "./IDevicetemplate";
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


connect(getDBConnectionURL(),{ useNewUrlParser: true }) 



export var DeviceTemplateBase:Schema      =   new Schema({
   
  
    name: {
        type: String,
        required: true,
       
    },
    deviceSetup: {
        type: Schema.Types.Mixed,
        required: true
    },
    payloadSetup:  {
        type: Schema.Types.Mixed,
        required: true
    },
},
{ 
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

DeviceTemplateBase.plugin(softDelete);
DeviceTemplateBase.plugin(mongoosePaginate);

DeviceTemplateBase.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

DeviceTemplateBase.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const  DeviceTemplate: IPaginatedModel<IDeviceTemplate> = model<IDeviceTemplate>(  "DeviceTemplate", DeviceTemplateBase,  "DeviceTemplate");