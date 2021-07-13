import { Schema, model, connect, Types } from 'mongoose';
import { IServiceSchedule} from "./IServiceSchedule";
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


export var ServiceScheduleSchema:Schema      =   new Schema({
   
},
{
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

ServiceScheduleSchema.plugin(softDelete);
ServiceScheduleSchema.plugin(mongoosePaginate);

ServiceScheduleSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

ServiceScheduleSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const ServiceSchedule: IPaginatedModel<IServiceSchedule> = model<IServiceSchedule>("ServiceSchedules", ServiceScheduleSchema,"ServiceSchedules");