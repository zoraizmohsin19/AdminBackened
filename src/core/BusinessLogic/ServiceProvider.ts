import * as q from "q";
import { ServiceProvider as ServiceProviderModel } from "../Models/ServiceProvider";
import Message from "../Util/Message";
import Validation from "../Util/Validation";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import * as env from "../../../config/env.json";
import { Types, PaginateResult } from "mongoose"

import * as moment from "moment";
const saltRounds = 10;
import * as CryptoJS from "crypto-js";
import { IServiceProvider } from '../Models/ServiceProvider/IServiceProvider';
import { IUser, UserEntity } from "../Models/User/IUser";
import GomosLogger from "../Util/commanUtill/GomosLogger";
import G from "../Util/commanUtill/gConstant";


export default class ServiceProvider {

    private static $_instance: ServiceProvider = null;

    private constructor() {
    }
    public static instance() {
        if (ServiceProvider.$_instance == null) {
            ServiceProvider.$_instance = new ServiceProvider
        }
        return ServiceProvider.$_instance;
    }
    // private userServiceProvider(user: IUser) {
    //     var defer = q.defer<Message>();
    //     var query= {}
    //     switch(user.userEntity){
    //         case UserEntity.PLATFORM :
    //             query['deleted'] = false;
    //             defer.resolve(new Message(Message.SUCCESS, "Service Provider", query));
    //             break;
    //         case UserEntity.SERVICE_PROVIDER:
    //              query['deleted'] = false;
    //              query["_id"] = user.organizationId;
    //              if(user.custFlag !='ALL'){
    //                 query["custId"] = {"$in": user.custCds}
    //              }
    //              defer.resolve(new Message(Message.SUCCESS, "Service Provider", query));
    //              break;
    //         case UserEntity.CLIENT:
    //              query['deleted'] = false;
    //              query["_id"] = {"$in": user.spCds};
    //              defer.resolve(new Message(Message.SUCCESS, "service Provider", query));
    //              break;    
    //        case UserEntity.SUB_CUSTOMER:
    //             query["_id"] = {"$in": user.spCds}
    //             query['deleted'] = false;
    //             defer.resolve(new Message(Message.SUCCESS, "service Provider", query));
    //             break;       

    //     }
    //     return defer.promise;
    // }

    fetchByUser(user: IUser) {
        var defer = q.defer<Message>();
        try {
            var query: any = {};
            // console.log("this is user", user.spCds);
            var spCodes = []
            user.getServiceProviderList().then((result) => {
                let serviceProviderList = result.getMessageData();
                if (serviceProviderList.length >= 0) {
                    query["_id"] = { "$in": serviceProviderList }
                } else {
                    defer.reject(new Message(Message.INTERNAL_ERROR, "You  have  not access read  any Service Provider "));
                }
                query["deleted"] = false;
              return  ServiceProviderModel.find(query)
            }).then((result: IServiceProvider[]) => {
                    GomosLogger.APILog(G.TRACE_DEBUG, `This is Service Provider  fetch function query by ${user.email} sucessfully get data `, result);
                    defer.resolve(new Message(Message.SUCCESS, "Service Provider Fetch.", result));
            }).catch((err) => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchByUser", 'This is Service Provider  read  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch Service Provider."));
            });
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchByUser", '[Service Provider bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Customer  fetchByUser", error));
        }
        return defer.promise;
    }
    fetchAll(user: IUser) {
        var defer = q.defer<Message>();
        try {
            var query = {}
            user.getServiceProviderList().then((result) => {
                let serviceProviderList = result.getMessageData();
                if (serviceProviderList.length >= 0) {
                    query["_id"] = { "$in": serviceProviderList }
                    query["deleted"] = false;
                    return  ServiceProviderModel.find(query)
                } else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAll", '[Service Provider  bs-Logic] - ', user.email, "Insufficient access - user.getServiceProviderList returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }
            }).then((result: IServiceProvider[]) => {
                    GomosLogger.APILog(G.TRACE_DEBUG, `This is Service Provider  fetch function query by  sucessfully get data `, result);
                    defer.resolve(new Message(Message.SUCCESS, "Service Provider Fetch.", result));
            }).catch((err) => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAll", 'This is Service Provider  read  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch Service Provider."));
            });
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAll", '[Service Provider bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Customer  fetchAll", error));
        }

        return defer.promise;
    }

}

