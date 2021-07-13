import {IController} from "./IController";
import {Request,Response} from "express";
import Message from "../core/Util/Message";
import * as env from "../../config/env.json";
import { Types } from "mongoose";
import  Asset from '../core/BusinessLogic/Asset';
import G from '../core/Util/commanUtill/gConstant'
import GomosLogger from '../core/Util/commanUtill/GomosLogger';
import { IUser } from "../core/Models/User/IUser";
import { IAsset } from "../core/Models/Asset/IAsset";
export default class AssetController implements IController{

    constructor(){
    
                
    }
    index(request: Request, response: Response): void {
       var query = request.query
        const user: IUser = request['auth_user'];
        var params = request.params;
        var search_query = query['search_query'] == undefined ? null : query['search_query'];
        var subcustomer_query = query['subcustomer_query'] == undefined ? null : query['subcustomer_query'];
        var AssetHelper:Asset    =   Asset.instance();
        let subCustCd = (query["subCustCd"]  != undefined) ? query["subCustCd"] : null;
        let subCustId = (query["subCustId"]  != undefined) ? new Types.ObjectId(query["subCustId"] ): null;
        GomosLogger.APILog(G.TRACE_DEBUG,`This is Asset Controller index function query by ${user.email} and Data`,query);
        var is_all = query['all'] == "true" ? true : false;
        if (is_all) {
            if(subCustId != null){
            AssetHelper.fetchAllBySubCustomer(subCustId ,user).then((result:Message)=>{
                GomosLogger.APILog(G.TRACE_DEBUG,`This is Asset Controller index function query by ${user.email} sucessfully get data `,result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error:Message)=>{
                GomosLogger.APILog(G.TRACE_DEBUG,`This is Asset Controller index function query by ${user.email} getting error`,error);
               // GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is Asset Controller index Catch error - ',user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
        }else{
            AssetHelper.fetchAll(subCustCd ,user).then((result:Message)=>{
                GomosLogger.APILog(G.TRACE_DEBUG,`This is Asset Controller index function query by ${user.email} sucessfully get data `,result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error:Message)=>{
                GomosLogger.APILog(G.TRACE_DEBUG,`This is Asset Controller index function query by ${user.email} getting error`,error);
              //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is Asset Controller index Catch error - ',user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
        }
        }
        else{
            var page = query['page'] == undefined ? 1 : parseInt(query['page']);
            var page_size = query['page_size'] == undefined ? env['DEFAULT_PAGE_SIZE'] : parseInt(query['page_size']);

            AssetHelper.fetch(search_query,subcustomer_query, page, page_size, user).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Asset Controller query in index function for fetched result",result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG,"This is Asset Controller query in index function for fetched error",error);
             //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is Asset Controller index Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            });
        }
        }

    
    show(request: Request, response: Response): void {
        var params = request.params;
        const user: IUser = request['auth_user'];
        var id: Types.ObjectId = null;
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        GomosLogger.APILog(G.TRACE_DEBUG,"This is Asset Controller query in shwo function for fetching id's data",id);
        var assetHelper: Asset = Asset.instance();

        assetHelper.getById(id,user).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Asset Controller query in shwo function for fetching id's data sucessfully",result);
            response.status(result.getResponseCode());
            response.json(result.toJson());

        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Asset Controller query in shwo function for fetching id's data sucessfully",error);
          //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "show", 'This is Asset Controller show Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });  
      }
      store(request: Request, response: Response): void {
        var assetHelper:Asset  = Asset.instance();
        var body = request.body;
        const user: IUser = request['auth_user'];
        GomosLogger.APILog(G.TRACE_PROD,`This is Asset Controller store function query by ${user.email}and Data`,body);
        if (body["name"] == undefined) {
            body["name"] = null;
        }

        if (body["subCustCd"] == undefined) {
            body["subCustCd"] = null;
        }

        if (body["assetId"] == undefined) {
            body["assetId"] = null;
        }
        if (body["assetType"] == undefined) {
            body["assetType"] = null;
        }

       
        assetHelper.create(body,user).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Asset Controller store functions for stored   successfully",result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Asset Controller store functions Failed to store",error);
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "storeLevel1", 'This is Asset Controller store Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        })
    }
    update(request: Request, response: Response): void {
        var params = request.params;
        var tempBody = request.body;
         var body = tempBody.obj
         const user: IUser = request['auth_user'];
         GomosLogger.APILog(G.TRACE_PROD,`This is Asset Controller update functions query by : ${user.email} and data `,body); 
        var id: Types.ObjectId = null;
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        var assetHelper: Asset = Asset.instance();
        assetHelper.getById(id,user).then((result: Message) => {
            var asset: IAsset = result.getMessageData();
            return assetHelper.update(asset, body,id, user);
        }).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Asset Controller update functions updated sucessfully ",result); 
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Asset Controller update functions updated Failed ",error); 
         //   GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", 'This is Asset Controller update Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });    }
    delete(request: Request, response: Response): void {
        var params = request.params;
        var id: Types.ObjectId = null;
        
   
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        const user: IUser = request['auth_user'];
        GomosLogger.APILog(G.TRACE_PROD,`This is Asset Controller delete function query by ${user.email}and ID : ${id}`);

        var assetHelper: Asset = Asset.instance();

        assetHelper.getById(id,user).then((result: Message) => {
            var asset: IAsset = result.getMessageData();
            return assetHelper.delete(asset,user);
        }).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Asset Controller deleted sucessfully",result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is Asset Controller deleted sucessfully",error);
          //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", 'This is SUbCustomer Controller delete Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    }

    showByassetId(request: Request, response: Response): void {
        var params = request.params;
        var AssetHelper: Asset = Asset.instance();
        let assetId = params["assetId"];
        let subCustCd = params["subCustCd"]
        AssetHelper.fetchByAssetId(assetId,subCustCd).then((result: Message) => {
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            response.status(error.getResponseCode());
            response.json(error.toJson());
        })

    }

 
}