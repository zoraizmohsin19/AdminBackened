import {IController} from "./IController";
import {Request,Response} from "express";

import Message from "../core/Util/Message";
import * as env from "../../config/env.json";
import { Types } from "mongoose";
import { stringify } from "querystring";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from "bcrypt";
import  DeviceState from '../core/BusinessLogic/DeviceState';
import G from '../core/Util/commanUtill/gConstant'
import GomosLogger from '../core/Util/commanUtill/GomosLogger';
import DeviceTemplate from "../core/BusinessLogic/DeviceTemplate";
import { IUser } from "../core/Models/User/IUser";
export default class DeviceTemplateControlller implements IController{
    constructor(){
                
    }
    index(request: Request, response: Response): void {
       
        var query = request.query;
        var DeviceTemplatehelper:DeviceTemplate    =   DeviceTemplate.instance();
        const user: IUser = request['auth_user'];

        GomosLogger.APILog(G.TRACE_DEBUG,`This is DeviceTemplate Controller index function query by ${user.email} and Data`,query);
        var is_all = query['all'] == "true" ? true : false;
        if (is_all) {
            DeviceTemplatehelper.fetchAll().then((result:Message)=>{
                GomosLogger.APILog(G.TRACE_DEBUG,`This is DeviceTemplate Controller index function query by ${user.email} sucessfully get data `,result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error:Message)=>{
                GomosLogger.APILog(G.TRACE_DEBUG,`This is DeviceTemplate Controller index function query by ${user.email} getting error`,error);
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is DeviceTemplate Controller index Catch error - ',user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
        }
        else{
            DeviceTemplatehelper.fetch(user).then((result:Message)=>{
                GomosLogger.APILog(G.TRACE_DEBUG,`This is DeviceTemplate Controller index function query by ${user.email} sucessfully get data `,result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error:Message)=>{
                GomosLogger.APILog(G.TRACE_DEBUG,`This is DeviceTemplate Controller index function query by ${user.email} getting error`,error);
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is DeviceTemplate Controller index Catch error - ',user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
        }
        }

    store(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
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