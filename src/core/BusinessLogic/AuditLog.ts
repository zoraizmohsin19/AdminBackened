import * as q from "q";
import { AuditLog as AuditLogModel } from '../Models/AuditLog';
import Message from "../Util/Message";
import {Types, PaginateResult} from "mongoose"

import * as moment from "moment";
import { IAuditLog } from '../Models/AuditLog/IAuditLog';
import { IUser } from "../Models/User/IUser";

 

export default class AuditLog{

     private static $_instance:AuditLog      =   null;

    private constructor(){
    }
    public static instance(){
        if(AuditLog.$_instance == null){
            AuditLog.$_instance = new AuditLog
        }
        return AuditLog.$_instance;
    }
    
     Log(collectionName: string,collectionDocID:Types.ObjectId,collectionEntity:string, actionBy:string,action:string,body:object) {
        var defer = q.defer<Message>();   
        AuditLogModel.create({ collectionName,collectionDocID,collectionEntity,actionBy,action, body})
        .then((result: IAuditLog) => {
            defer.resolve(new Message(Message.SUCCESS, "AuditLog  Saved ."));
        })
        .catch(err => {
            console.log("this is audit log",err)
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed AuditLog Save"));

        })
        return defer.promise;
    }
    

}