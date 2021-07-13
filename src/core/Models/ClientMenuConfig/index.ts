import { Schema, model, connect, Types } from 'mongoose';
import { IClientMenuConfig} from "./IClientMenuConfig";

import Message from "../../Util/Message";
import {getDBConnectionURL} from "../../Util/db";
import * as mongoosePaginate from "mongoose-paginate";
import * as softDelete from "mongoose-delete";
import { IPaginatedModel } from "../IPaginatedModel";

var httpRequest = require('request');

var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");

connect(getDBConnectionURL(),{ useNewUrlParser: true }) 


export var ClientMenuConfigSchema:Schema      =   new Schema({
    clientID: {
        type: String,
        required: true
    },
    viewDashBoard: {
        type: Schema.Types.Mixed,
        required:true
    },
    activeDashBoard:{
        type: Schema.Types.Mixed,
        required:true
    }
  
},
{
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

ClientMenuConfigSchema.plugin(softDelete);
ClientMenuConfigSchema.plugin(mongoosePaginate);

ClientMenuConfigSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

ClientMenuConfigSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const ClientMenuConfig: IPaginatedModel<IClientMenuConfig> = model<IClientMenuConfig>("ClientMenuConfig", ClientMenuConfigSchema,"ClientMenuConfig");