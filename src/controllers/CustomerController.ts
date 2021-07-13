import {IController} from "./IController";
import {Request,Response} from "express";

import Message from "../core/Util/Message";
import * as env from "../../config/env.json";
import { Types } from "mongoose";
import { stringify } from "querystring";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from "bcrypt";
import  Customer from '../core/BusinessLogic/Customer';
import G from '../core/Util/commanUtill/gConstant'
import GomosLogger from '../core/Util/commanUtill/GomosLogger';
import { IUser } from "../core/Models/User/IUser";
import { ICustomer } from '../core/Models/Customer/ICustomer';
export default class CustomerController implements IController{
    private loggerHepler = null;
    constructor(){
                
    }
    index(request: Request, response: Response): void {
       
        var customerHelper: Customer = Customer.instance();
        var query = request.query;
        const user: IUser = request['auth_user'];
        GomosLogger.APILog( G.TRACE_DEBUG,"This is Customer Controller query in index function for fetching data",query);
        var search_query = query['search_query'] == undefined ? null : query['search_query'];
        var spCd_search = query['spCd_search'] == undefined ? null : query['spCd_search'];
        var spId = (query["spId"]  != undefined) ? new Types.ObjectId(query["spId"] ): null;

        var is_all = query['all'] == "true" ? true : false;
        if (is_all) {
            if(spId != null){
                customerHelper.fetchAllByspId(spId, user).then((result:Message)=>{
                    GomosLogger.APILog(G.TRACE_DEV,`This is Customer Controller byspId function query by ${user.email}and Data`,result);
                     response.status(result.getResponseCode());
                     response.json(result.toJson());
                 }).catch((error:Message)=>{
                     GomosLogger.APILog(G.TRACE_DEV,`This is Customer Controller byspId function query by ${user.email}and error`,error);
                    //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "byspId", 'This is Customer Controller byspId Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                     response.status(error.getResponseCode());
                     response.json(error.toJson());
                 })
            }else{
            customerHelper.fetchAll(user).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller query in index function for fetched result",result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller query in index function for fetched error",error);
             //   GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is Customer Controller index Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
        }
        } else {
            var page = query['page'] == undefined ? 1 : parseInt(query['page']);
            var page_size = query['page_size'] == undefined ? env['DEFAULT_PAGE_SIZE'] : parseInt(query['page_size']);

            customerHelper.fetch(spCd_search,search_query, page, page_size, user).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller query in index function for fetched result",result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller query in index function for fetched error",error);
           //    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is Customer Controller index Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            });
        }
        }
    
    store(request: Request, response: Response): void {
        var customerHelper:Customer  = Customer.instance();
        var body = request.body;
        const user: IUser = request['auth_user'];
        GomosLogger.APILog(G.TRACE_PROD,`This is Customer Controller store function query by ${user.email}and Data`,body);
        if (body["name"] == undefined) {
            body["name"] = null;
        }

        if (body["spCd"] == undefined) {
            body["spCd"] = null;
        }

        if (body["custCd"] == undefined) {
            body["custCd"] = null;
        }
        if (body["address"] == undefined) {
            body["address"] = null;
        }

        if (body["phone"] == undefined) {
            body["phone"] = null;
        }

        if (body["email"] == undefined) {
            body["email"] = null;
        }

        if (body["mqttClient"] == undefined) {
            body["mqttClient"] = null;
        }

        if (body["description"] == undefined) {
            body["description"] = null;
        }
        if (body["active"] == undefined) {
            body["active"] = null;
        }
        if (body["urlToSend"] == undefined) {
            body["urlToSend"] = null;
        }
        if (body["SubTopic"] == undefined) {
            body["SubTopic"] = null;
        }
        if (body["PubTopic"] == undefined) {
            body["PubTopic"] = null;
        }

        customerHelper.create(body,user).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller store functions for stored   successfully",result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller store functions Failed to store",error);
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "storeLevel1", 'This is Customer Controller store Catch error - ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        })
    }
    show(request: Request, response: Response): void {
        var params = request.params;
        var id: Types.ObjectId = null;
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        const user: IUser = request['auth_user'];
        GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller query in show function for fetching id's data",id);
        var customerHelper: Customer = Customer.instance();

        customerHelper.getById(id, user).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller query in show function for fetching id's data sucessfully",result);
            response.status(result.getResponseCode());
            response.json(result.toJson());

        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller query in show function for fetching id's data sucessfully",error);
          //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "show", 'This is Customer Controller show Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    }
    update(request: Request, response: Response): void {
        var params = request.params;
        var tempBody = request.body;
         var body = tempBody.obj
         const user: IUser = request['auth_user'];
        var id: Types.ObjectId = null;
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        GomosLogger.APILog(G.TRACE_PROD,`This is Customer Controller update functions query by : ${user.email} and data `,id); 

        var customerHelper: Customer = Customer.instance();
        customerHelper.getById(id,user).then((result: Message) => {
            var customer: ICustomer = result.getMessageData();
            return customerHelper.update(customer, body,id, user);
        }).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller update functions updated sucessfully ",result); 
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller update functions updated Failed ",error); 
         //   GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", 'This is Customer Controller update Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    }
    delete(request: Request, response: Response): void {
        var params = request.params;
        var id: Types.ObjectId = null;
        
   
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        const user: IUser = request['auth_user'];
        GomosLogger.APILog(G.TRACE_PROD,`This is Customer Controller delete function query by ${user.email}and ID : ${id}`);

        var customerHelper: Customer = Customer.instance();

        customerHelper.getById(id,user).then((result: Message) => {
            var customer: ICustomer = result.getMessageData();
            return customerHelper.delete(customer,user);
        }).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller deleted sucessfully",result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Customer Controller deleted sucessfully",error);
         //   GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", 'This is Customer Controller delete Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    }
    
    
 
}