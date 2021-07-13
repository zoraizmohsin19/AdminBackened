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
import UserRoles from "../core/BusinessLogic/UserRoles"
export default class UsersRolesController implements IController{

    constructor(){
    
                
    }
    index(request: Request, response: Response): void {
      var query = request.query;
      var userRolesHelper: UserRoles = UserRoles.instance();
      const user: IUser = request['auth_user'];
      var search_query = query['search_query'] == undefined ? null : query['search_query'];
      // var customer_query = query['customer_query'] == undefined ? null : query['customer_query'];

      GomosLogger.APILog(G.TRACE_DEBUG, `This is UserRoles Controller index function query by ${user.email} and Data`, query);
      var is_all = query['all'] == "true" ? true : false;
      if (is_all) {
        userRolesHelper.fetchAll(user).then((result: Message) => {
              GomosLogger.APILog(G.TRACE_DEBUG, `This is UserRoles Controller index function query by ${user.email} sucessfully get data `, result);
              response.status(result.getResponseCode());
              response.json(result.toJson());
          }).catch((error: Message) => {
              GomosLogger.APILog(G.TRACE_DEBUG, `This is UserRoles Controller index function query by ${user.email} getting error`, error);
              GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is UserRoles Controller index Catch error - ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
              response.status(error.getResponseCode());
              response.json(error.toJson());
          })
      }
      else {
      

        userRolesHelper.fetchdata().then((result: Message) => {
              GomosLogger.APILog(G.TRACE_DEBUG, `This is UserRoles Controller index function query by ${user.email} sucessfully get data `, result);
              response.status(result.getResponseCode());
              response.json(result.toJson());
          }).catch((error: Message) => {
              GomosLogger.APILog(G.TRACE_DEBUG, `This is UserRoles Controller index function query by ${user.email} getting error`, error);
              GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is UserRoles Controller index Catch error - ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
              response.status(error.getResponseCode());
              response.json(error.toJson());
          })

      }

        }

    
    show(request: Request, response: Response): void {  
      }
      store(request: Request, response: Response): void {
    }
    update(request: Request, response: Response): void {
     }
           delete(request: Request, response: Response): void {
    }


 
}