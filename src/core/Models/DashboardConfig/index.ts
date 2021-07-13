import { Schema, model, connect, Types } from 'mongoose';
import { IDashboardConfig} from "./IDashboardConfig";

import {getDBConnectionURL} from "../../Util/db";
import * as mongoosePaginate from "mongoose-paginate";
import * as softDelete from "mongoose-delete";
import { IPaginatedModel } from "../IPaginatedModel";
import * as moment from  "moment";
import * as json5 from "json5"


connect(getDBConnectionURL(),{ useNewUrlParser: true }) 


export var DashboardConfigSchema:Schema      =   new Schema({
    dashboardConfigId: {
        type: String,
        required: true
    },
    ActiveSpCd: {
        type: String,
        required: true
    },
    ActiveCustCd: {
        type: String,
        required: true
    },
  
    ActiveSubCustCd: {
        type: String,
        required: true
    },
    Assets: {
        type: Schema.Types.Mixed,
        required: true
    },
    ActiveAssets: {
        type: String,
        required: true
    },
    Devices:{
        type: Schema.Types.Mixed,
        required: true
    },
    ActiveDeviceName: {
        type: String,
        required: true
    },
    ActiveMac: {
        type: String,
        required: true
    },
     SensorsBgC: {
        type: Schema.Types.Mixed,
        required: true
    },
    Nevigation: {
        type: String,
        required: true
    },
    ActiveDashBoardEnable: {
        type: Boolean,
        required: true
    },
    OpratingDashBoardEnable:  {
        type: Boolean,
        required: true
    },
},
{
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

DashboardConfigSchema.plugin(softDelete);
DashboardConfigSchema.plugin(mongoosePaginate);

DashboardConfigSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

DashboardConfigSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const DashboardConfig: IPaginatedModel<IDashboardConfig> = model<IDashboardConfig>("DashboardConfig" , DashboardConfigSchema,"DashboardConfig" );