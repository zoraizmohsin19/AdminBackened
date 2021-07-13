import { IController } from "./IController";
import { Request, Response } from "express";

import Message from "../core/Util/Message";
import * as env from "../../config/env.json";
import { Types } from "mongoose";
import { stringify } from "querystring";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from "bcrypt";
import SubCustomer from '../core/BusinessLogic/SubCustomer';
import { IUser } from "../core/Models/User/IUser";
import G from '../core/Util/commanUtill/gConstant'
import GomosLogger from '../core/Util/commanUtill/GomosLogger';
import { ISubCustomer } from "../core/Models/SubCustomer/ISubCustomer";
export default class SubCustomerController implements IController {
    constructor() {

    }

    index(request: Request, response: Response): void {
        var query = request.query;
        var SubCustomerHelper: SubCustomer = SubCustomer.instance();
        const user: IUser = request['auth_user'];
        var search_query = query['search_query'] == undefined ? null : query['search_query'];
        var customer_query = query['customer_query'] == undefined ? null : query['customer_query'];
        var custId = (query["custId"] != undefined) ? new Types.ObjectId(query["custId"]) : null;
        GomosLogger.APILog(G.TRACE_DEBUG, `This is SubCustomer Controller index function query by ${user.email} and Data`, query);
        var is_all = query['all'] == "true" ? true : false;
        if (is_all) {
            if (custId != null) {
                SubCustomerHelper.fetchAllBycustId(custId,user).then((result: Message) => {
                    GomosLogger.APILog(G.TRACE_DEBUG, `This is subCustomer Controller index function query by ${user.email}and Data`, result);
                    response.status(result.getResponseCode());
                    response.json(result.toJson());
                }).catch((error: Message) => {
                    GomosLogger.APILog(G.TRACE_DEBUG, `This is subCustomer Controller index function query by ${user.email}and error`, error);
                    //GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "byspcutId", 'This is subCustomer Controller index Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                    response.status(error.getResponseCode());
                    response.json(error.toJson());
                })
            } else {
                SubCustomerHelper.fetchAll(user).then((result: Message) => {
                    GomosLogger.APILog(G.TRACE_DEBUG, `This is SubCustomer Controller index function query by ${user.email} sucessfully get data `, result);
                    response.status(result.getResponseCode());
                    response.json(result.toJson());
                }).catch((error: Message) => {
                    GomosLogger.APILog(G.TRACE_DEBUG, `This is SubCustomer Controller index function query by ${user.email} getting error`, error);
                   // GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is SubCustomer Controller index Catch error - ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                    response.status(error.getResponseCode());
                    response.json(error.toJson());
                })
            }
        }
        else {
            var page = query['page'] == undefined ? 1 : parseInt(query['page']);
            var page_size = query['page_size'] == undefined ? env['DEFAULT_PAGE_SIZE'] : parseInt(query['page_size']);

            SubCustomerHelper.fetchdata(search_query, customer_query, page, page_size, user).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG, `This is SubCustomer Controller index function query by ${user.email} sucessfully get data `, result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG, `This is SubCustomer Controller index function query by ${user.email} getting error`, error);
              //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is SubCustomer Controller index Catch error - ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })

        }
    }
    showBysubCustCd(request: Request, response: Response): void {
        var params = request.params;
        var SubCustomerHelper: SubCustomer = SubCustomer.instance();
        let subCustCd = params["subCustCd"]
        GomosLogger.APILog(G.TRACE_DEBUG, `This is SubCustomer Controller subCustCd functions subCustCd: ${subCustCd}`);

        SubCustomerHelper.fetchBysubCustCd(subCustCd).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, `This is SubCustomer Controller subCustCd functions subCustCd: ${subCustCd} sucessfully  and result`, result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, `This is SubCustomer Controller subCustCd functions subCustCd: ${subCustCd} getting error`, error);
          //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "showBysubCustCd", 'his is SubCustomer Controller subCustCd functions subCustCd: ${subCustCd} getting error in Catch - ', '', error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        })

    }
    store(request: Request, response: Response): void {
        var SubcustomerHelper: SubCustomer = SubCustomer.instance();
        var body = request.body;
        const user: IUser = request['auth_user'];
        GomosLogger.APILog(G.TRACE_PROD, `This is Customer Controller store function query by ${user.email}and Data`, body);
        if (body["name"] == undefined) {
            body["name"] = null;
        }

        if (body["spCd"] == undefined) {
            body["spCd"] = null;
        }

        if (body["subcustCd"] == undefined) {
            body["subcustCd"] = null;
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


        SubcustomerHelper.create(body, user).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is SUbCustomer Controller store functions for stored   successfully", result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is SubCustomer Controller store functions Failed to store", error);
          //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "storeLevel1", 'This is SubCustomer Controller store Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        })
    }

    show(request: Request, response: Response): void {
        var params = request.params;
        const user: IUser = request['auth_user'];
        var id: Types.ObjectId = null;
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        GomosLogger.APILog(G.TRACE_DEBUG, "This is SubCustomer Controller query in shwo function for fetching id's data", id);
        var subcustomerHelper: SubCustomer = SubCustomer.instance();

        subcustomerHelper.getById(id,user).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is SubCustomer Controller query in shwo function for fetching id's data sucessfully", result);
            response.status(result.getResponseCode());
            response.json(result.toJson());

        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is SUbCustomer Controller query in shwo function for fetching id's data sucessfully", error);
           // GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "show", 'This is SubCustomer Controller show Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    }
    update(request: Request, response: Response): void {
        var params = request.params;
        var tempBody = request.body;
        var body = tempBody.obj
        const user: IUser = request['auth_user'];
        GomosLogger.APILog(G.TRACE_PROD, `This is SubCustomer Controller update functions query by : ${user.email} and data `, body);
        var id: Types.ObjectId = null;
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        var subcustomerHelper: SubCustomer = SubCustomer.instance();
        subcustomerHelper.getById(id,user).then((result: Message) => {
            console.log(result, "-=-=-=-subcustomerId")
            var subcustomer: ISubCustomer = result.getMessageData();
            return subcustomerHelper.update(subcustomer, body, id, user);
        }).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is SubCustomer Controller update functions updated sucessfully ", result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is SubCustomer Controller update functions updated Failed ", error);
           // GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", 'This is SubCustomer Controller update Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
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
        GomosLogger.APILog(G.TRACE_PROD, `This is SubCustomer Controller delete function query by ${user.email}and ID : ${id}`);

        var subcustomerHelper: SubCustomer = SubCustomer.instance();

        subcustomerHelper.getById(id,user).then((result: Message) => {
            var subcustomer: ISubCustomer = result.getMessageData();
            return subcustomerHelper.delete(subcustomer, user);
        }).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is SubCustomer Controller deleted sucessfully", result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is SubCustomer Controller deleted sucessfully", error);
          //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", 'This is SUbCustomer Controller delete Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    }




}