import { Schema, model, connect, Types } from 'mongoose';
import { IDevice } from './IDevice';
import {getDBConnectionURL} from "../../Util/db";
import * as mongoosePaginate from "mongoose-paginate";
import * as softDelete from "mongoose-delete";
import { IPaginatedModel } from "../IPaginatedModel";
import DeviceState from '../../BusinessLogic/DeviceState';
import { SubCustomer } from '../SubCustomer';
import {Asset} from '../Asset';

var httpRequest = require('request');

connect(getDBConnectionURL(),{ useNewUrlParser: true }) 
export var SensorsObj:Schema      =   new Schema({
    "businessName":  {
        type: String
     
    },
    "configName": {
        type: String
      
    },
    "sortName":  {
        type: String
        
    },
    "Type":  {
        type: String
    },
    "aggregationProcesse":  {
        type: String
    },
    "climateControl":{
        type: Schema.Types.Mixed
    },
    "group": {
        type: String
    },
    "displayPosition":{
        type: Number
    },
})

export var DeviceSchema:Schema      =   new Schema({
    DeviceName: {
        type: String,
        required: true
    },
    mac: {
        type: String,
        unique: true,
        required: true
    },
    assetId: {
        type: String,
        required: true
    },
    asset_Id: { type: Schema.Types.ObjectId, ref: Asset },
    deviceTemplate: {
        type: String,
        // required: true
        default: ''
    },
    subCustCd: {
        type: String,
        required: true
    },
    subCustId: { type: Schema.Types.ObjectId, ref: SubCustomer },
    roles: {
        type: Schema.Types.Mixed,
        default: {} 
       
    },
    active: {
        type: String,
        required: true
    },
    sensors: {
        type: Schema.Types.Mixed,
        required: true,
        default: {} 
    },
    channel: {
        type: Schema.Types.Mixed,
        required: true,
        default: {} 
    },
    defaultGroupInfo: {
        type: String,
        required: true
        
    },
    deviceTypes: {
        type: String,
        default: ''
    }
},
{
     minimize: false,
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});
DeviceSchema.index({mac:1},{unique: true});
DeviceSchema.plugin(softDelete);
DeviceSchema.plugin(mongoosePaginate);

DeviceSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

DeviceSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});
DeviceSchema.post('save',(doc:IDevice, next)=>{
    // console.log("This is Post Of save",doc);
    // console.log("This is Post Of save of This",doc._id);
  
    // let dockey = Object.keys(doc);
    // if(dockey.length > 0){
    let DeviceName = doc.DeviceName;
    // console.log("this is DeviceName", DeviceName)
    let mac  = doc.mac;
    let sensors = doc.sensors;
    let channel = doc.channel;
    let deviceStateHelper =     DeviceState.instance();
    deviceStateHelper.create(DeviceName , mac, sensors,channel).then(result=> {console.log("this is result ", result)})
    .catch(err => {console.log("this is error", err)})
  
    return next();
});

// DeviceSchema.post('updateOne',(doc: IDevice, next)=>{
//     console.log("this is called in device State", doc)
//      return next();
// });





export const Device: IPaginatedModel<IDevice> = model<IDevice>("Devices", DeviceSchema,"Devices");