import {IController} from "./IController";
import {Request,Response} from "express";

import Message from "../core/Util/Message";
import * as env from "../../config/env.json";
import { Types } from "mongoose";
import { stringify } from "querystring";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from "bcrypt";
import G from '../core/Util/commanUtill/gConstant'
import GomosLogger from '../core/Util/commanUtill/GomosLogger';
import { IUser } from "../core/Models/User/IUser";
import Organization from "../core/BusinessLogic/Organization";

export default class OrganizationController implements IController{
  
    constructor(){
       
                
    }
    index(request: Request, response: Response): void {
       
      
        var query = request.query;
        var organizationHelper: Organization = Organization.instance();
        const user: IUser = request['auth_user'];
        var search_query = query['search_query'] == undefined ? null : query['search_query'];
        // var customer_query = query['customer_query'] == undefined ? null : query['customer_query'];

        GomosLogger.APILog(G.TRACE_DEBUG, `This is Organization Controller index function query by ${user.email} and Data`, query);
        var is_all = query['all'] == "true" ? true : false;
        if (is_all) {
            organizationHelper.fetchAll(user).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG, `This is Organization Controller index function query by ${user.email} sucessfully get data `, result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG, `This is Organization Controller index function query by ${user.email} getting error`, error);
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is Organization Controller index Catch error - ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
        }
        else {
            var page = query['page'] == undefined ? 1 : parseInt(query['page']);
            var page_size = query['page_size'] == undefined ? env['DEFAULT_PAGE_SIZE'] : parseInt(query['page_size']);

            organizationHelper.fetch(search_query, page, page_size, user).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG, `This is Organization Controller index function query by ${user.email} sucessfully get data `, result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG, `This is Organization Controller index function query by ${user.email} getting error`, error);
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is Organization Controller index Catch error - ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })

        }
    }
    platform(request: Request, response: Response): void {
        var organizationHelper: Organization = Organization.instance();
        const user: IUser = request['auth_user'];
        
        organizationHelper.platform(user).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, `This is Organization Controller index function query by ${user.email} sucessfully get data `, result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, `This is Organization Controller index function query by ${user.email} getting error`, error);
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is Organization Controller index Catch error - ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        })
    } 
        store(request: Request, response: Response): void {
        }
    show(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
    }
    update(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
    }
    delete(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
    }
    
 
}