import {IController} from "./IController";
import {Request,Response} from "express";

import Message from "../core/Util/Message";
import * as env from "../../config/env.json";
import Device from '../core/BusinessLogic/Device';
import G from '../core/Util/commanUtill/gConstant'
import GomosLogger from '../core/Util/commanUtill/GomosLogger';
import { IUser } from "../core/Models/User/IUser";
import { Types } from "mongoose";
import { IDevice } from '../core/Models/Device/IDevice';

export default class DeviceController implements IController{
    constructor(){

                
    }
    index(request: Request, response: Response): void {
      
        var deviceHelper: Device = Device.instance();
        var query = request.query;
        GomosLogger.APILog( G.TRACE_DEBUG,"This is Device Controller query in index function for fetching data",query);
        var search_query = query['search_query'] == undefined ? null : query['search_query'];
        var subCustCd_search = query['subCustCd_search'] == undefined ? null : query['subCustCd_search'];
        const user: IUser = request['auth_user'];
        var is_all = query['all'] == "true" ? true : false;
        if (is_all) {
            deviceHelper.fetchAll(search_query,user).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Device Controller query in index function for fetched result",result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Device Controller query in index function for fetched error",error);
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is Device Controller index Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
        } else {
           
            var page = query['page'] == undefined ? 1 : parseInt(query['page']);
            var page_size = query['page_size'] == undefined ? env['DEFAULT_PAGE_SIZE'] : parseInt(query['page_size']);

            deviceHelper.fetch(subCustCd_search,search_query, page, page_size, user).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Device Controller query in index function for fetched result",result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Device Controller query in index function for fetched error",error);
               GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is Device Controller index Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            });
        }
        }
    
    store(request: Request, response: Response): void {
        var body =   request.body;
        const user: IUser = request['auth_user'];
        GomosLogger.APILog(G.TRACE_PROD,`This is Device Controller store function`,body);
        let DeviceName = body["DeviceName"];
        if (DeviceName == undefined) {
            DeviceName = null;
        }
        let mac = body["mac"];
        if (mac == undefined) {
            mac = null;
        }
        let assetId = body["assetId"];
        if (assetId == undefined) {
            assetId = null;
        }
        let subCustCd = body["subCustCd"];
        if (subCustCd == undefined) {
            subCustCd = null;
        }
        let roles = body["roles"];
        if (roles == undefined) {
            roles = null;
        }
        let deviceTemplate = body["deviceTemplate"];
        if (deviceTemplate == undefined) {
            deviceTemplate = null;
        }
        let active = body["active"];
        if (active == undefined) {
            active = null;
        }
        let sensors = body["sensors"];
        if (sensors == undefined) {
            sensors = null;
        }
        let channel = body["channel"];
        if (channel == undefined) {
            channel = null;
        }

        let defaultGroupInfo = body["defaultGroupInfo"];
        if (defaultGroupInfo == undefined) {
            defaultGroupInfo = null;
        }
        let deviceTypes = body["deviceTypes"];
        if (deviceTypes == undefined) {
            deviceTypes = null;
        }



        var deviceHelper:Device    =   Device.instance();


    deviceHelper.create(DeviceName,mac,assetId,subCustCd,roles,deviceTemplate,active,sensors,channel,defaultGroupInfo,deviceTypes,user).then((result:Message)=>{
        GomosLogger.APILog(G.TRACE_DEBUG,`This is Device Controller store function sucessfully inserted`,result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error:Message)=>{
            GomosLogger.APILog(G.TRACE_DEBUG,`This is Device Controller store function getting error`,error);
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "store", 'This is Device Controller store function getting error catch', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        })
    }
    showBymac(request: Request, response: Response): void {
        var params = request.params;
        var deviceHelper:Device    =   Device.instance();
        let mac = params["mac"];
        if(mac == undefined ){
            mac = null;
        }

        deviceHelper.fetchBymac(mac).then((result:Message)=>{
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error:Message)=>{
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
    }
    show(request: Request, response: Response): void {
        var params = request.params;
        var id: Types.ObjectId = null;
        const user: IUser = request['auth_user'];
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        GomosLogger.APILog(G.TRACE_DEBUG,"This is Device Controller query in shwo function for fetching id's data",id);
        var deviceHelper: Device = Device.instance();

        deviceHelper.getById(id,user).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Device Controller query in shwo function for fetching id's data sucessfully",result);
            response.status(result.getResponseCode());
            response.json(result.toJson());

        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Device Controller query in shwo function for fetching id's data sucessfully",error);
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "show", 'This is Device Controller show Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    }
    update(request: Request, response: Response): void {
        var params = request.params;
        var tempBody = request.body;
         var body = tempBody.obj
         const user: IUser = request['auth_user'];
         GomosLogger.APILog(G.TRACE_PROD,`This is Device Controller update functions query by : ${user.email} and data `,body); 
        var id: Types.ObjectId = null;
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        var deviceHelper: Device = Device.instance();
        deviceHelper.getById(id,user).then((result: Message) => {
            var device: IDevice = result.getMessageData();
            return deviceHelper.update(device, body,id, user);
        }).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Device Controller update functions updated sucessfully ",result); 
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Device Controller update functions updated Failed ",error); 
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", 'This is Device Controller update Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    }
    delete(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
    }
    bySubCustId(request: Request, response: Response): void{
 
        var DeviceHelper:Device    =   Device.instance();
           var body   =   request.body;
           var subCustId =  body.subCustId == undefined ? null :new Types.ObjectId(body.subCustId);
           var filterbyAsset = body.asset_Ids == undefined ? null : body.asset_Ids;
           const user: IUser = request['auth_user'];
           GomosLogger.APILog(G.TRACE_DEBUG,`This is Device Controller bySubCustId function query by ${user.email} and Data`,body);
        DeviceHelper.fetchAllBySubCustId(subCustId, filterbyAsset,user).then((result:Message)=>{
               GomosLogger.APILog(G.TRACE_DEBUG,`This is Device Controller bySubCustId function query by ${user.email}and Data`,result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error:Message)=>{
                GomosLogger.APILog(G.TRACE_DEBUG,`This is Device Controller bySubCustId function query by ${user.email}and error`,error);
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "bySubCustId", 'This is Device Controller bySubCustId Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
    }
    

    bySubCustCd(request: Request, response: Response): void{
 
        var DeviceHelper:Device    =   Device.instance();
           var body   =   request.body;
           var subCustCd =  body.subCustCd == undefined ? null : body.subCustCd;
           const user: IUser = request['auth_user'];
           GomosLogger.APILog(G.TRACE_DEBUG,`This is Device Controller bySubCustCd function query by ${user.email} and Data`,body);
        DeviceHelper.fetchAllBySubCustCd(subCustCd).then((result:Message)=>{
               GomosLogger.APILog(G.TRACE_DEBUG,`This is Device Controller bySubCustCd function query by ${user.email}and Data`,result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error:Message)=>{
                GomosLogger.APILog(G.TRACE_DEBUG,`This is Device Controller bySubCustCd function query by ${user.email}and error`,error);
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "bySubCustCd", 'This is Device Controller bySubCustCd Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
    }
    
    storeByDeviceTemplate(request: Request, response: Response){
        console.log("this is data", request.body)
        var deviceHelper:Device    =   Device.instance();
        const user: IUser = request['auth_user'];
         var deviceSetup = request.body.selectDeviceTemplateObj.deviceSetup;
         var DeviceName = request.body.DeviceName;
         var mac = request.body.mac;
         var subCustCd = request.body.subCustCd;
         var subCustId = request.body.subCustId;
         var assetId = request.body.assetId;
         var asset_Id = request.body.asset_Id;
         var active = request.body.active;
         var payloadSetup = request.body.selectDeviceTemplateObj.payloadSetup;
        deviceHelper.createByTemplate(DeviceName,mac,subCustCd,subCustId,assetId,asset_Id,active,deviceSetup,payloadSetup,user).then((result:Message)=>{
            GomosLogger.APILog(G.TRACE_DEBUG,`This is Device Controller storeByDeviceTemplate function sucessfully inserted`,result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error:Message)=>{
                GomosLogger.APILog(G.TRACE_DEBUG,`This is Device Controller storeByDeviceTemplate function getting error`,error);
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "storeByDeviceTemplate", 'This is Device Controller storeByDeviceTemplate function getting error catch', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());

    });
}
    
 
}