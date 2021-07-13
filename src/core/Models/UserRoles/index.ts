import { Schema, model, connect, Types } from 'mongoose';
import { IUserRoles} from "./IUserRoles";
import {getDBConnectionURL} from "../../Util/db";
import * as mongoosePaginate from "mongoose-paginate";
import * as softDelete from "mongoose-delete";
import { IPaginatedModel } from "../IPaginatedModel";
var httpRequest = require('request');


connect(getDBConnectionURL(),{ useNewUrlParser: true }) 



export var SubCustomerSchema:Schema      =   new Schema({
    role: {
        type:  Schema.Types.Mixed,
        required: true
        
    },
    isOrgSpecificRole: {
        type:  Schema.Types.Mixed,
        required: true
    },
    orgID: {
        type:  Schema.Types.Mixed,
        required: true
    },
    Customer:{
        type:  Schema.Types.Mixed,
        required: true
    },
    SubCustomer: {
        type:  Schema.Types.Mixed,
        required: true
    },
    Asset : {
        type:  Schema.Types.Mixed,
        required: true
       
    },
    Devices: {
        type:  Schema.Types.Mixed,
        required: true
    },
    AlertConfig: {
        type:  Schema.Types.Mixed,
        required: true
       
    },
    User: {
        type:  Schema.Types.Mixed,
        required: true
    }
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





export const UserRoles : IPaginatedModel<IUserRoles> = model<IUserRoles>("UsersRoles", SubCustomerSchema,"UsersRoles");