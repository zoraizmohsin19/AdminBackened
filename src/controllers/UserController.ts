import { IController } from "./IController";
import { Request, Response } from "express";
import User from "../core/BusinessLogic/User";
import Message from "../core/Util/Message";
import * as env from "../../config/env.json";
import { IUser, UserRole } from "../core/Models/User/IUser";
// import Department from "../core/BusinessLogic/Department";
import { Types } from "mongoose";
import { stringify } from "querystring";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from "bcrypt";
import G from '../core/Util/commanUtill/gConstant'
import GomosLogger from '../core/Util/commanUtill/GomosLogger';
export default class UserController implements IController {

    constructor() {


    }


    index(request: Request, response: Response): void {
        var query = request.query;
        var userHelper: User = User.instance();
        const user: IUser = request['auth_user'];
        var search_query = query['search_query'] == undefined ? null : query['search_query'];
         var organizationId_query = query['organizationId'] == undefined ? null : query['organizationId'];

        GomosLogger.APILog(G.TRACE_DEBUG, `This is User Controller index function query by ${user.email} and Data`, query);
        var is_all = query['all'] == "true" ? true : false;
        if (is_all) {
            userHelper.fetchAll(user).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG, `This is User Controller index function query by ${user.email} sucessfully get data `, result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG, `This is User Controller index function query by ${user.email} getting error`, error);
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is User Controller index Catch error - ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })
        }
        else {
            var page = query['page'] == undefined ? 1 : parseInt(query['page']);
            var page_size = query['page_size'] == undefined ? env['DEFAULT_PAGE_SIZE'] : parseInt(query['page_size']);

            userHelper.fetchdata(organizationId_query,search_query, page, page_size, user).then((result: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG, `This is User Controller index function query by ${user.email} sucessfully get data `, result);
                response.status(result.getResponseCode());
                response.json(result.toJson());
            }).catch((error: Message) => {
                GomosLogger.APILog(G.TRACE_DEBUG, `This is User Controller index function query by ${user.email} getting error`, error);
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "index", 'This is User Controller index Catch error - ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(error.getResponseCode());
                response.json(error.toJson());
            })

        }
    }
    store(request: Request, response: Response): void {
        var body = request.body;
        console.log('body', body)
        //  UtilityFn.gomosLog( this.loggerHepler,G.TRACE_DEBUG,"This is user store functions and body value", body);
        if (body['organizationId'] == undefined) {
            body['organizationId'] = null
        }
        if (body['userFN'] == undefined) {
            body['userFN'] = null;
        }

        if (body['userLN'] == undefined) {
            body['userLN'] = null;
        }

        if (body['email'] == undefined) {
            body['email'] = null;
        }

        if (body['phone'] == undefined) {
            body['phone'] = null;
        }

        if (body['userId'] == undefined) {
            body['userId'] = null
        }

        if (body['password'] == undefined) {
            body['password'] = null;
        }

        if (body['userEntity'] == undefined) {
            body['userEntity'] = null;
        }
        if (body["spFlag"] == undefined) {
            body["spFlag"] = null

        }

        if (body['spCds'] == undefined) {
            body['spCds'] = null;
        }
        if (body["custFlag"] == undefined) {
            body["custFlag"] = null;
        }

        if (body['custCds'] == undefined) {
            body['custCds'] = null;
        }
        if (body["subCustFlag"] == undefined) {
            body["subCustFlag"] = null;
        }

        if (body['subCustCds'] == undefined) {
            body['subCustCds'] = null;
        }

        if (body['assetFlag'] == undefined) {
            body['assetFlag'] = null;
        }

        if (body['Assets'] == undefined) {
            body['Assets'] = null;
        }

        if (body["deviceFlag"] == undefined) {
            body["deviceFlag"] = null;

        }
        if (body['Devices'] == undefined) {
            body['Devices'] = null;
        }
        // var failed_login    =   body['failed_login'];
        // if(body['failed_login'] == undefined){
        //     body['failed_login'] = null;
        // }
        // var deleted    =   body['deleted'];
        // if(deleted == undefined){
        //     deleted = null;
        // }
        // var lastLoginAt    =   body['lastLoginAt'];
        // if(lastLoginAt == undefined){
        //     lastLoginAt = null;
        // }
        // var locked_till    =   body['locked_till'];
        // if(locked_till == undefined){
        //     locked_till = null;
        // }
        // var userPreference    =   body['userPreference'];
        // if(body['userPreference'] == undefined){
        //     body['userPreference'] = null;
        // }
        // var devicePreference    =   body['devicePreference'];
        // if(devicePreference == undefined){
        //     devicePreference = null;
        // }

        // var subscription    =   body['subscription'];
        // if(subscription == undefined){
        //     subscription = null;
        // }
        // var status    =   body['status'];
        // if(status == undefined){
        //     status = null;
        // } 
        // var send_password   = body['send_password']
        const user: IUser = request['auth_user'];

        var userHelper: User = User.instance();
        userHelper.create(body,user).then((result:Message)=>{
            GomosLogger.APILog(G.TRACE_DEBUG, `This is user Controller stored  sucessfully  and result`, result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error:Message)=>{
            GomosLogger.APILog(G.TRACE_DEBUG, `This is user Controller stored  failed  and error`,error);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    }

    show(request: Request, response: Response): void { 
        var params = request.params;
        const user: IUser = request['auth_user'];
        var id: Types.ObjectId = null;
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        GomosLogger.APILog(G.TRACE_DEBUG,"This is User Controller query in shwo function for fetching id's data",id);
        var userHelper: User = User.instance();

        userHelper.getById(id,user).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is User Controller query in shwo function for fetching id's data sucessfully",result);
            response.status(result.getResponseCode());
            response.json(result.toJson());

        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is User Controller query in shwo function for fetching id's data sucessfully",error);
          //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "show", 'This is Asset Controller show Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    };
    update(request: Request, response: Response): void { 
        var params = request.params;
        var tempBody = request.body;
         var body = tempBody.obj
         const user: IUser = request['auth_user'];
         GomosLogger.APILog(G.TRACE_PROD,`This is User Controller update functions query by : ${user.email} and data `,body); 
        var id: Types.ObjectId = null;
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        if (body['organizationId'] == undefined) {
            body['organizationId'] = null
        }
        if (body['userFN'] == undefined) {
            body['userFN'] = null;
        }

        if (body['userLN'] == undefined) {
            body['userLN'] = null;
        }

        if (body['email'] == undefined) {
            body['email'] = null;
        }

        if (body['phone'] == undefined) {
            body['phone'] = null;
        }

        if (body['userId'] == undefined) {
            body['userId'] = null
        }

        if (body['password'] == undefined) {
            body['password'] = null;
        }

        if (body['userEntity'] == undefined) {
            body['userEntity'] = null;
        }
        if (body["spFlag"] == undefined) {
            body["spFlag"] = null

        }

        if (body['spCds'] == undefined) {
            body['spCds'] = null;
        }
        if (body["custFlag"] == undefined) {
            body["custFlag"] = null;
        }

        if (body['custCds'] == undefined) {
            body['custCds'] = null;
        }
        if (body["subCustFlag"] == undefined) {
            body["subCustFlag"] = null;
        }

        if (body['subCustCds'] == undefined) {
            body['subCustCds'] = null;
        }

        if (body['assetFlag'] == undefined) {
            body['assetFlag'] = null;
        }

        if (body['Assets'] == undefined) {
            body['Assets'] = null;
        }

        if (body["deviceFlag"] == undefined) {
            body["deviceFlag"] = null;

        }
        if (body['Devices'] == undefined) {
            body['Devices'] = null;
        }
        var userHelper: User = User.instance();
        userHelper.getById(id,user).then((result: Message) => {
            var userOld: IUser = result.getMessageData();
            return userHelper.update(userOld, body,id, user);
        }).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is User Controller update functions updated sucessfully ",result); 
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG,"This is User Controller update functions updated Failed ",error); 
         //   GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", 'This is Asset Controller update Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        }); 
     


    };
    delete(request: Request, response: Response): void { 
        var params = request.params;
        var id: Types.ObjectId = null;
        if (params["id"] != undefined) {
            id = new Types.ObjectId(params['id']);
        }
        const user: IUser = request['auth_user'];
        GomosLogger.APILog(G.TRACE_PROD, `This is User Controller delete function query by ${user.email}and ID : ${id}`);

        var userHelper: User = User.instance();

        userHelper.getById(id,user).then((result: Message) => {
            var UserData: IUser = result.getMessageData();
            return userHelper.delete(UserData, user);
        }).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is User Controller deleted sucessfully", result);
            response.status(result.getResponseCode());
            response.json(result.toJson());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is User Controller deleted sucessfully", error);
          //  GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", 'This is SUbCustomer Controller delete Catch error - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });



    };


    //Method is used to authenticate the user
    authenticate(request: Request, response: Response): void {
        var data = request.body;
        console.log("this is data", data)
        // var loggerHelper = new UserController
        GomosLogger.APILog(G.TRACE_PROD, "This is user authenticate functions and body value", data.email);

        var email: string = data['email'];
        if (email == undefined) {
            email = null;
        }

        var password: string = data['password'];
        if (password == undefined) {
            password = null;
        }

        var role: string = data['role'];
        if (role == undefined) {
            role = null;
        }

        var userRole: UserRole = UserRole.GENERAL;
        if (role == 'ADMIN') {
            userRole = UserRole.ADMIN;
        }

        var userHelper = User.instance();
        userHelper.authenticate(email, password, userRole).then((result: Message) => {
            GomosLogger.APILog(G.TRACE_PROD, "This is user authenticate functions for  successfully authenticate ", result);
            response.json(result.toJson());
            response.status(result.getResponseCode());
        }).catch((error: Message) => {
            GomosLogger.APILog(G.TRACE_TEST, "This is user authenticate functions for error", error);
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "authenticate", 'This is userControler authenticate Catch error end  - ', ` `, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            response.status(error.getResponseCode());
            response.json(error.toJson());
        });
    }


    me(request: Request, response: Response): void {
        var query = request.query;

        var source = "web";
        if (query.source != undefined && query.source == "admin") {
            source = "admin"
        }
        var result = new Message(Message.SUCCESS, "Current User", request['auth_user']);
        if (source == "web") {
            response.json(result.toJson());
            response.status(result.getResponseCode());
        } else {
            var user: IUser = request['auth_user']
            var userHelper = User.instance();
            userHelper.isAdminRole(user.email).then((admin_result: Message) => {
                var is_admin = admin_result.getMessageData();
                if (is_admin) {
                    response.json(result.toJson());
                    response.status(result.getResponseCode());
                } else {
                    var message = new Message(
                        Message.INVALID_HEADER,
                        "Invalid Authoration Header"
                    );
                    response.status(message.getResponseCode());
                    response.json(message.toJson());
                }
            }).catch(err => {
                var message = new Message(
                    Message.INVALID_HEADER,
                    "Invalid Authoration Header"
                );
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "me", 'This is userControler me  Catch error  - ', "Invalid Authoration Header", err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                response.status(message.getResponseCode());
                response.json(message.toJson());
            })
        }

    }

}