import { Schema, model, connect, Types } from 'mongoose';
import { IPayload} from "./IPayload";
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



export var PayloadBaseSchema:Schema      =   new Schema({
    payloadId: {
        type: String,
        required: true
    },
    mac: {
        type: String,
        required: true
    },
    processByFact: {
        type: String,
        required: true
    },
    AckProcess: {
        type: String,
        required: true
    },
    processByState: {
        type: String,
        required: true
    },
    processByActiveJobs: {
        type: String,
        required: true
    },
    processByInstructionError:{
        type: String,
        required: true
    },
    originatedFrom: {
        type: String,
        required: true
    },
    formStructure: {
        type: String
    },
    sensors: {
        type: Schema.Types.Mixed,
        required: true,
        default: {} 
        
    },
    processByDeviceUpTime: {
        type: String,
        required: true,
       
    },
},
{ minimize: false,
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});
PayloadBaseSchema.index({payloadId:1,mac:1},{unique:true});
PayloadBaseSchema.plugin(softDelete);
PayloadBaseSchema.plugin(mongoosePaginate);

PayloadBaseSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

PayloadBaseSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const Payload: IPaginatedModel<IPayload> = model<IPayload>( "Payloads", PayloadBaseSchema, "Payloads");