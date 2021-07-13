import { Schema, model, connect, Types } from 'mongoose';
import {IAuditLog,AlertConfigBody} from "./IAuditLog";
import * as q from "q";
import Message from "../../Util/Message";
import {getDBConnectionURL} from "../../Util/db";
import * as mongoosePaginate from "mongoose-paginate";
import * as softDelete from "mongoose-delete";
import { IPaginatedModel } from "../IPaginatedModel";

connect(getDBConnectionURL(),{ useNewUrlParser: true }) 
// THIS IS CHECKING DATA WORKING OR NOT ...
// export var AlertsConfigAuditBody: Schema = new Schema({
//     name: {
//         type:String
//     },
//     spCd: {
//         type: String
       
//     },
//     custCd: {
//         type: String
       
//     },
//     subCustCd: { type: String, 
//       },
//     subCustId: { type: Schema.Types.ObjectId },
//     sensorNm: {
//         type: String,
       
//     },
//     businessNm: {
//         type: String,
        
//     },
//     configBNm: {
//         type: String,
       
//     },
//     lastModifieduser:{
//         type: String
//     },
//     shortName:{
//         type: String
//     },
   
//     type:{
//         type: String,
//     },
//     criteria:{
//         type: String
//     },
//     emailRecipientRole: {
//         type: Schema.Types.Mixed,
       
//     },
//     alertTriggeredBy: {
//         type: String 
//     },
//     alertText:{
//         type: String
//     },
// },{ _id : false })

// export var DeviceAuditBody:Schema      =   new Schema({
// DeviceName: {
//     type: String
// },
// mac: {
//     type: String
// }
// },{ _id : false })

export var AuditLogSchema:Schema      =   new Schema({
    collectionName: {
        type:String
    },
    collectionDocID : {
        type:  Schema.Types.ObjectId,
       
    },
    collectionEntity : {
        type: String
       
    },
   
     actionBy: {
        type: String
       
    },
    action: { type: String, 
      },
    body: {
        type:  Schema.Types.Mixed,
        
       
    },
    // deviceBody: {
    //     type: DeviceAuditBody,
       
       
    // }


},
{
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

//AlertsConfigSchema.plugin(softDelete);
//AlertsConfigSchema.plugin(mongoosePaginate);

AuditLogSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const AuditLog: IPaginatedModel<IAuditLog> = model<IAuditLog>("AuditLog", AuditLogSchema,"AuditLog");