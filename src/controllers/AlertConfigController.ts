import { IController } from "./IController";
import { Request, Response } from "express";

import Message from "../core/Util/Message";
import * as env from "../../config/env.json";
import { Types } from "mongoose";
import { stringify } from "querystring";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from "bcrypt";
import AlertConfig from '../core/BusinessLogic/AlertConfig';
import { IUser } from "../core/Models/User/IUser";
import { IAlertConfig } from '../core/Models/AlertConfig/IAlertConfig';
import G from '../core/Util/commanUtill/gConstant';
import GomosLogger from '../core/Util/commanUtill/GomosLogger';

export default class AlertConfigController implements IController {
    constructor(){          
    }

    index(request: Request, response: Response): void {

        var alertConfigHelper: AlertConfig = AlertConfig.instance();
        var query = request.query;
        GomosLogger.APILog( G.TRACE_DEBUG,"This is AlertConfig Controller query in index function for fetching data",query);
        var search_query = query['search_query'] == undefined ? null : query['search_query'];
        var subCust_search = query['subCust_search'] == undefined ? null : query['subCust_search'];
        var type_search = query['type_search'] == undefined ? null : query['type_search'];
        const user: IUser = request['auth_user'];
        var is_all = query['all'] == "true" ? true : false;
        if (is_all) {
            alertConfigHelper.fetchAll(search_query).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller query in index function for fetched result",result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller query in index function for fetched error",error);
              //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is AlertConfig Controller index Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
        } else {
            var page = query['page'] == undefined ? 1 : parseInt(query['page']);
            var page_size = query['page_size'] == undefined ? env['DEFAULT_PAGE_SIZE'] : parseInt(query['page_size']);

            alertConfigHelper.fetch(type_search,subCust_search,search_query, page, page_size, user).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller query in index function for fetched result",result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller query in index function for fetched error",error);
             //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is AlertConfig Controller index Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            });
        }
    }



    store(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
    }

    show(request: Request, response: Response): void {
        var params = request.params;
        var id: Types.ObjectId = null;
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        const user: IUser = request['auth_user'];
        GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller query in shwo function for fetching id's data",id);
        var alertConfigHelper: AlertConfig = AlertConfig.instance();

        alertConfigHelper.getById(id, user).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller query in shwo function for fetching id's data sucessfully",result);
            response.status(result.getResponseCode());
            response.json(result.toJson());

        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller query in shwo function for fetching id's data sucessfully",error);
          //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "show", 'This is AlertConfig Controller show Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    }
    showBysubCustCd(request: Request, response: Response): void{

    }


    update(request: Request, response: Response): void {
        var params = request.params;
        var tempBody = request.body;
         var body = tempBody.obj
         const user: IUser = request['auth_user'];
         GomosLogger.APILog(G.TRACE_PROD,`This is AlertConfig Controller update functions query by : ${user.email} and data `,body); 
        var id: Types.ObjectId = null;
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        var alertConfigHelper: AlertConfig = AlertConfig.instance();
        alertConfigHelper.getById(id,user).then((result: Message) => {
            var alertConfig: IAlertConfig = result.getMessageData();
            return alertConfigHelper.update(alertConfig, body,id, user);
        }).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller update functions updated sucessfully ",result); 
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller update functions updated Failed ",error); 
           // GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", 'This is AlertConfig Controller update Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    }


    storeLevel1(request: Request, response: Response): void {
        var alertConfigHelper: AlertConfig = AlertConfig.instance();
        var body = request.body;
        const user: IUser = request['auth_user'];
        GomosLogger.APILog(G.TRACE_PROD,`This is AlertConfig Controller storeLevel1 function query by ${user.email}and Data`,body);
        
        if (body["name"] == undefined) {
            body["name"] = null;
        }

        if (body["spCd"] == undefined) {
            body["spCd"] = null;
        }

        if (body["custCd"] == undefined) {
            body["custCd"] = null;
        }
        if (body["subCustCd"] == undefined) {
            body["subCustCd"] = null;
        }

        if (body["subCustId"] == undefined) {
            body["subCustId"] = null;
        }

        if (body["sensorNm"] == undefined) {
            body["sensorNm"] = null;
        }

        if (body["businessNm"] == undefined) {
            body["businessNm"] = null;
        }

        if (body["configBNm"] == undefined) {
            body["configBNm"] = null;
        }
        if (body["lastModifieduser"] == undefined) {
            body["lastModifieduser"] = null;
        }
        if (body["shortName"] == undefined) {
            body["shortName"] = null;
        }
        if (body["type"] == undefined) {
            body["type"] = null;
        }
        if (body["criteria"] == undefined) {
            body["criteria"] = null;
        }

        if (body["emailRecipientRole"] == undefined) {
            body["emailRecipientRole"] = null;
        }

        if (body["alertText"] == undefined) {
            body["alertText"] = null;
        }
        if (body["alertTriggeredBy"] == undefined) {
            body["alertTriggeredBy"] = null;
        }
        alertConfigHelper.storelevel1(body,user).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller storeLevel1 functions for stored  level1  successfully",result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller storeLevel1 functions Failed to store",error);
           // GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "storeLevel1", 'This is AlertConfig Controller storeLevel1 Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        })

    }

    delete(request: Request, response: Response): void {
        var params = request.params;
        var id: Types.ObjectId = null;
        
   
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        const user: IUser = request['auth_user'];
        GomosLogger.APILog(G.TRACE_PROD,`This is AlertConfig Controller delete function query by ${user.email}and ID : ${id}`);

        var alertConfigHelper: AlertConfig = AlertConfig.instance();

        alertConfigHelper.getById(id,user).then((result: Message) => {
            var alertConfig: IAlertConfig = result.getMessageData();
            return alertConfigHelper.delete(alertConfig,user);
        }).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller deleted sucessfully",result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is AlertConfig Controller deleted sucessfully",error);
          //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", 'This is AlertConfig Controller delete Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });

    }
}