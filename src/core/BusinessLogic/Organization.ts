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
import { Organization as OrganizationModel  } from "../Models/Organization";

 

export default class Organization{

     private static $_instance:Organization      =   null;

    private constructor(){
    }
    public static instance(){
        if(Organization.$_instance == null){
            Organization.$_instance = new Organization
        }
        return Organization.$_instance;
    }
    create(){
        var defer   =   q.defer<Message>();
            
         return defer.promise;
    }
    fetchAll(user: IUser) {
        var defer = q.defer<Message>();
        var query:any   =   {};
        let OrganizationIntance = new OrganizationModel();
    OrganizationIntance.getUserOrganizationIdBasedList(user).then(result => {
        GomosLogger.APILog(G.TRACE_DEBUG, "This is getUserOrganizationIdBasedList function for retrive data for = " + user.email, result);
        defer.resolve(new Message(Message.SUCCESS, "getUserOrganizationIdBasedList fetched.", result));
    })
    .catch(error => {
        GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", 'This is User  fetch  error ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
        defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch User."));
    })

        return defer.promise;
    }
    fetch(search_string: string, page: number, page_size: number, user: IUser) {
        var defer = q.defer<Message>();
        return defer.promise;
    }

    platform(user: IUser) {
        var defer = q.defer<Message>();
            
        OrganizationModel.findOne().then(result => {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is platform function for retrive data for = " + user.email, result);
            defer.resolve(new Message(Message.SUCCESS, "platform fetched.", result));
        })
        .catch(error => {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", 'This is User  fetch  error ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch User."));
        })
        return defer.promise;
    }

}