import * as q from "q";
import { DeviceTemplate as DeviceTemplateModel } from '../Models/DeviceTemplate';
import Message from "../Util/Message";
import Validation from "../Util/Validation";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import * as env from "../../../config/env.json";
import {Types, PaginateResult} from "mongoose"

import * as moment from "moment";
const saltRounds = 10;
import * as CryptoJS from  "crypto-js";
import { IDashboardConfig } from '../Models/DashboardConfig/IDashboardConfig';
import { IUser } from '../Models/User/IUser';
import { IDeviceTemplate } from '../Models/DeviceTemplate/IDevicetemplate';

 

export default class DeviceTemplate{

     private static $_instance:DeviceTemplate      =   null;

    private constructor(){
    }
    public static instance(){
        if(DeviceTemplate.$_instance == null){
            DeviceTemplate.$_instance = new DeviceTemplate
        }
        return DeviceTemplate.$_instance;
    }
    fetchAll(){
        var defer   =   q.defer<Message>();

        let query:any   =   {};
        // if(search_string.trim().length != 0){
            query   = {
            };
        // }
        // if(query.deleted == undefined){
        //     query['deleted']  = false;
        // }

        DeviceTemplateModel.find(query).then((result:IDeviceTemplate[])=>{
            defer.resolve(new Message(Message.SUCCESS,"DeviceTemplate fetched.",result));
        }).catch(error=>{
            defer.reject(new Message(Message.INTERNAL_ERROR,"Failed to fetch DeviceTemplate."));
        })
        return defer.promise;
    }
    fetch(user:IUser){
        var defer   =   q.defer<Message>();

        let query:any   =   {};
        // if(search_string.trim().length != 0){
            query   = {
            };
        // }
        // if(query.deleted == undefined){
        //     query['deleted']  = false;
        // }

        // SubCustomerModel.find(query).then((result:ISubCustomer[])=>{
        //     defer.resolve(new Message(Message.SUCCESS,"User fetched.",result));
        // }).catch(error=>{
        //     defer.reject(new Message(Message.INTERNAL_ERROR,"Failed to fetch user."));
        // })
        return defer.promise;
    }
}