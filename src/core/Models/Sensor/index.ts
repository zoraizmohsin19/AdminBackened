import { Schema, model, connect, Types } from 'mongoose';
import { ISensor} from "./ISensor";
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
// THIS IS CHECKING DATA WORKING OR NOT ...
//  .then((res) => {
//     console.log('Database connection successful', res)
//   })
//   .catch(err => {
//     console.error('Database connection error')
//   });


export var SensorSchema:Schema      =   new Schema({
    spCd: {
        type:  String,
        required: true
    },
    subCustCd:{
        type:  String,
        required: true
    },
    custCd: {
        type:  String,
        required: true
    },
    sensorNm: {
        type:  String,
        required: true
    },
    operations: {
        type:  Schema.Types.Mixed,
        required: true
    },
},
{
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

SensorSchema.plugin(softDelete);
SensorSchema.plugin(mongoosePaginate);

SensorSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

SensorSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const Sensor: IPaginatedModel<ISensor> = model<ISensor>("Sensors", SensorSchema,"Sensors");