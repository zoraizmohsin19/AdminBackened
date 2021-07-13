import { Schema, model, connect, Types } from 'mongoose';
import { IAsset} from "./IAsset";

import {getDBConnectionURL} from "../../Util/db";
import * as mongoosePaginate from "mongoose-paginate";
import * as softDelete from "mongoose-delete";
import { IPaginatedModel } from "../IPaginatedModel";
import { SubCustomer } from '../SubCustomer';



connect(getDBConnectionURL(),{ useNewUrlParser: true }) 

export var AssetSchema:Schema      =   new Schema({
    name:  {
        type:  String,
        required: true
    },
    subCustCd: {
        type:  String,
        required: true
    },
    subCustId: {
        type:  Schema.Types.ObjectId,
        ref: SubCustomer
    },
    assetId:{
        type:  String,
        required: true
    },
    assetType:{
        type:  String,
        required: true
    }
},
{
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

AssetSchema.plugin(softDelete);
AssetSchema.plugin(mongoosePaginate);

AssetSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

AssetSchema.pre('save',(next)=>{
    let now     =   new Date();
    if(!this.createdTime){
        this.createdTime  = now;
    } else {
        this.updatedTime  =   now;
    }
    return next();
});





export const Asset: IPaginatedModel<IAsset> = model<IAsset>("Assets", AssetSchema,"Assets");