import { Schema, model, connect, Types } from 'mongoose';
import { IDeviceState } from './IDeviceState';
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
var httpRequest = require('request');

var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");

var secret_key =    "anf123k5md78kr39ktnf94jthrJJHJ89";

connect(getDBConnectionURL(),{ useNewUrlParser: true }) 

export var DeviceStateBaseSchema:Schema      =   new Schema({
    DeviceName: {
        type:  String,
        required: true
    },
    mac: {
        type:  String,
        unique: true,
        required: true
    },
    sensors: {
        type:  Schema.Types.Mixed,
        required: true,
        default: {} 
    },
   channel : {
    type:  Schema.Types.Mixed,
    required: true,
    default: {} 
      }
},
{  minimize: false,
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

DeviceStateBaseSchema.index({mac:1},{unique:true});
DeviceStateBaseSchema.plugin(softDelete);
DeviceStateBaseSchema.plugin(mongoosePaginate);

DeviceStateBaseSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

DeviceStateBaseSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const DeviceState: IPaginatedModel<IDeviceState> = model<IDeviceState>("DeviceState", DeviceStateBaseSchema,"DeviceState");