import * as q from "q";
import {Payload as PayloadModel} from "../Models/Payload";
import Message from "../Util/Message";
import Validation from "../Util/Validation";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import * as env from "../../../config/env.json";
import {Types, PaginateResult} from "mongoose"

import * as moment from "moment";
const saltRounds = 10;
import * as CryptoJS from  "crypto-js";
import { IPayload } from '../Models/Payload/IPayload';
import { IUser } from "../Models/User/IUser";
import GomosLogger from "../Util/commanUtill/GomosLogger";
import G from "../Util/commanUtill/gConstant";

 

export default class Payload{

     private static $_instance:Payload      =   null;

    private constructor(){
    }
    public static instance(){
        if(Payload.$_instance == null){
            Payload.$_instance = new Payload
        }
        return Payload.$_instance;
    }
    create(payloadId:string,mac:string,processByFact:string,AckProcess:string,processByState:string,processByActiveJobs:string,processByInstructionError: string,originatedFrom:string,formStructure:string,sensors:object,processByDeviceUpTime:string){
        var defer   =   q.defer<Message>();

        if(payloadId == null || payloadId.trim().length == 0){
            defer.reject(new Message(Message.INVALID_PARAM,"PayloadId is not provided."));
            return defer.promise;
        }
        
        if(mac == null || mac.trim().length == 0){
            defer.reject(new Message(Message.INVALID_PARAM,"Mac is not provided."));
            return defer.promise;
        }
        
        if(processByFact == null || processByFact.trim().length == 0){
            defer.reject(new Message(Message.INVALID_PARAM,"Process By Fact value is not provided."));
            return defer.promise;
        }
        
        if(AckProcess == null || AckProcess.trim().length == 0){
            defer.reject(new Message(Message.INVALID_PARAM,"AckProcessr is not provided."));
            return defer.promise;
        }

        if(processByState == null || processByState.trim().length == 0){
            defer.reject(new Message(Message.INVALID_PARAM,"process By State is not provided."));
            return defer.promise;
        }

        if(processByActiveJobs == null || processByActiveJobs.trim().length == 0){
            defer.reject(new Message(Message.INVALID_PARAM,"Process By ActiveJobs is not provided."));
            return defer.promise;
        }
        if(processByInstructionError == null || processByInstructionError.trim().length == 0){
            defer.reject(new Message(Message.INVALID_PARAM,"processByInstructionError is not provided."));
            return defer.promise;
        }
        if(originatedFrom == null || originatedFrom.trim().length == 0){
            defer.reject(new Message(Message.INVALID_PARAM,"OriginatedFrom is not provided."));
            return defer.promise;
        }
        if(formStructure == null || formStructure.trim().length == 0 ){
            defer.reject(new Message(Message.INVALID_PARAM,"ForStructure is not provided."));
            return defer.promise;
        }
        if(sensors == null ){
            defer.reject(new Message(Message.INVALID_PARAM,"Sensors is not provided."));
            return defer.promise;
        }
        if(processByDeviceUpTime == null || processByDeviceUpTime.trim().length == 0 ){
            defer.reject(new Message(Message.INVALID_PARAM,"Process By DeviceUpTime   is not provided."));
            return defer.promise;
        }
          
        let payload = new PayloadModel;
        payload.payloadId = payloadId;
        payload.mac = mac;
        payload.processByFact = processByFact;
        payload.AckProcess = AckProcess;
        payload.processByState = processByState;
        payload.processByActiveJobs = processByActiveJobs;
        payload.processByInstructionError = processByInstructionError;
        payload.originatedFrom = originatedFrom;
        payload.formStructure = formStructure;
        payload.sensors = sensors;
        payload.processByDeviceUpTime = processByDeviceUpTime;
      
        payload.save().then( result => {
            defer.resolve(new Message(Message.SUCCESS,"Payload Inserted.",result));

        }).catch( err => {
            defer.reject(new Message(Message.INTERNAL_ERROR,"Failed to Payload Inserted ."));

        })
            
         return defer.promise;
    }
    fetchAll(mac:string,search_string: string) {
        var defer = q.defer<Message>();
        var query:any   =   {};

    
            if(mac!= ""){

                query['mac'] = {
                    '$in': mac,
                };
            }
          //  query['deleted'] = false;
          GomosLogger.APILog(G.TRACE_DEBUG,"This is Payload fetchAll query ",query);

          PayloadModel.find(query).then((result:IPayload[])=>{
              GomosLogger.APILog(G.TRACE_DEBUG,"This is Payload fetchAll result ",result);
            defer.resolve(new Message(Message.SUCCESS,"Payload fetched.",result));
        }).catch(error=>{
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Payload fetchAll error on resul ",error);
            defer.reject(new Message(Message.INTERNAL_ERROR,"Failed to fetch ."));
        })

        return defer.promise;
    }
    fetch(search_string: string, page: number, page_size: number, user: IUser) {
        var defer = q.defer<Message>();
        return defer.promise;
    }

}