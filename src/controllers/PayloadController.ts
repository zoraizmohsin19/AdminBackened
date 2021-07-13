import {IController} from "./IController";
import {Request,Response} from "express";

import Message from "../core/Util/Message";
import * as env from "../../config/env.json";
import { Types } from "mongoose";
import { stringify } from "querystring";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from "bcrypt";
import  Payload from '../core/BusinessLogic/Payload';
import G from '../core/Util/commanUtill/gConstant'
import GomosLogger from '../core/Util/commanUtill/GomosLogger';
import { IUser } from "../core/Models/User/IUser";
export default class PayloadController implements IController{
  
    constructor(){
       
                
    }
    index(request: Request, response: Response): void {
       
        var paylaodHelper: Payload = Payload.instance();
        var query = request.query;
        GomosLogger.APILog( G.TRACE_DEBUG,"This is Payload Controller query in index function for fetching data",query);
        var search_query = query['search_query'] == undefined ? null : query['search_query'];
        const user: IUser = request['auth_user'];
        var is_all = query['all'] == "true" ? true : false;
        let mac = query['mac'] == undefined ? null : query['mac'];
        if (is_all) {
            paylaodHelper.fetchAll(mac,search_query).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Payload Controller query in index function for fetched result",result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Payload Controller query in index function for fetched error",error);
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is Payload Controller index Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
        } else {
           
            var page = query['page'] == undefined ? 1 : parseInt(query['page']);
            var page_size = query['page_size'] == undefined ? env['DEFAULT_PAGE_SIZE'] : parseInt(query['page_size']);

            paylaodHelper.fetch(search_query, page, page_size, user).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Payload Controller query in index function for fetched result",result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Payload Controller query in index function for fetched error",error);
               GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is Payload Controller index Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            });
        }
    }
    
        store(request: Request, response: Response): void {
            var body =   request.body;
            GomosLogger.APILog(G.TRACE_PROD,`This is payload Controller store functions  data for insert `,body );
            let payloadId = body["payloadId"];
            if (payloadId == undefined) {
                payloadId = null;
            }
            let mac = body["mac"];
            if (mac == undefined) {
                mac = null;
            }
            let processByFact = body["processByFact"];
            if (processByFact == undefined) {
                processByFact = null;
            }
            let AckProcess = body["AckProcess"];
            if (AckProcess == undefined) {
                AckProcess = null;
            }
            let processByState = body["processByState"];
            if (processByState == undefined) {
                processByState = null;
            }
            let processByActiveJobs = body["processByActiveJobs"];
            if (processByActiveJobs == undefined) {
                processByActiveJobs = null;
            }
            let processByInstructionError = body["processByInstructionError"];
            if(processByInstructionError == undefined){
                processByInstructionError = null;
            }
            let originatedFrom = body["originatedFrom"];
            if (originatedFrom == undefined) {
                originatedFrom = null;
            }
            let formStructure = body["formStructure"];
            if (formStructure == undefined) {
                formStructure = null;
            }
            let sensors = body["sensors"];
            if (sensors == undefined) {
                sensors = null;
            }
    
            let processByDeviceUpTime = body["processByDeviceUpTime"];
            if (processByDeviceUpTime == undefined) {
                processByDeviceUpTime = null;
            }
   
    
    
    
          let payloadHelper:Payload    =   Payload.instance();
    
    
           payloadHelper.create(payloadId,mac,processByFact,AckProcess,processByState,processByActiveJobs,processByInstructionError,originatedFrom,formStructure,sensors,processByDeviceUpTime).then((result:Message)=>{
               GomosLogger.APILog(G.TRACE_DEBUG,`This is payload Controller store functions  sucessefully inserted `,result );
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error:Message)=>{
                GomosLogger.APILog(G.TRACE_DEBUG,`This is payload Controller store functions  getting error `,error );
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "store", 'This is Payload Controller store Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
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