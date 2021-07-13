import * as q from "q";
import { AlertConfig as AlertConfigModel } from "../Models/AlertConfig";
import Message from "../Util/Message";
import Validation from "../Util/Validation";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import * as env from "../../../config/env.json";
import { Types, PaginateResult } from "mongoose"
import { UserRole, IUser, UserEntity } from "../Models/User/IUser";
import * as moment from "moment";
const saltRounds = 10;
import * as CryptoJS from "crypto-js";
import { IAlertConfig } from '../Models/AlertConfig/IAlertConfig';
import SubCustomer from './SubCustomer';
import * as ts from "typescript";
import AuditLog from './AuditLog';
import G from '../Util/commanUtill/gConstant';
import GomosLogger from '../Util/commanUtill/GomosLogger';


export default class AlertConfig {

    private static $_instance: AlertConfig = null;

    private constructor() {
    }
    public static instance() {
        if (AlertConfig.$_instance == null) {
            AlertConfig.$_instance = new AlertConfig
        }
        return AlertConfig.$_instance;
    }

    fetch(type_search: string, subCust_search: string, search_string: string, page: number, page_size: number, user: IUser) {
        var defer = q.defer<Message>();
        try {
            var query = {};

            if (search_string.trim().length != 0) {
                query = {
                    'name': {
                        '$regex': '.*' + search_string + '.*',
                        '$options': 'i'
                    }
                };
            }

            user.getSubCustomerList().then((result) => {

                let subCustomerList = result.getMessageData();

                if (subCustomerList.length >= 0) {
                    query['subCustId'] = { "$in": subCustomerList }
                }

                // query['type'] = "level1";
                query['deleted'] = false;
                if (type_search.trim().length != 0) {
                    query["type"] = type_search;
                }
                if (subCust_search.length != 0) {
                    let tempsub = subCust_search.split(",")
                    query["subCustCd"] = {
                        '$in': tempsub,
                    };
                }
                return AlertConfigModel.paginate(query, {
                    page: page,
                    limit: page_size,
                    populate: [{
                        'path': 'subCustId',
                        'select': ["_id", 'subCustCd', 'name', 'spCd', "custCd"]
                    }]
                })
            }).then((result: PaginateResult<IAlertConfig>) => {
                defer.resolve(new Message(Message.SUCCESS, "AlertConfig fetched.", result));
            }).catch(error => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", '[AlertConfig bs-Logic]', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch AlertConfig."));
            })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", '[AlertConfig bs-Logic]', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Device  fetch", error));
        }
        return defer.promise;
    }


    getById(alertConfiglId: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            if (alertConfiglId == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "AlertConfig id should not be empty."));
                return defer.promise;
            }

            AlertConfigModel.findOne({
                _id: alertConfiglId
            }).populate({ path: 'subCustId', select: ['name', 'subCustCd'] })
                .then((alertConfig: IAlertConfig) => {
                    if (alertConfig == null) {
                        defer.reject(new Message(Message.NOT_FOUND, "AlertConfig with id does not exists."));
                    } else {
                        user.getSubCustomerList().then(result => {
                            let subCustomerList = result.getMessageData();
                            // console.log("this is Id for subCustomer",alertConfig.subCustId["_id"])
                            if(subCustomerList.includes(alertConfig.subCustId["_id"])){
                                // console.log("This is True")
                                defer.resolve(new Message(Message.SUCCESS, "AlertConfig found.", alertConfig));
                            }else{
                                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[AlertConfig  bs-Logic] - ', user.email, `Insufficient access - user does not have access for AlertConfig : ${alertConfiglId}`, G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                                defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                            }
                           
                        }).catch(err => {
                            
                        })
                      
                    }
                }).catch(err => {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[AlertConfig bs-Logic]', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to to find AlertConfig", err));
                })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[AlertConfig bs-Logic]', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Device  getById", error));
        }
        return defer.promise;
    }

    delete(alertConfig: IAlertConfig, user: IUser) {
        var defer = q.defer<Message>();
        try {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is AlertConfig delete function for delete data for = " + user.email, alertConfig);
            if (alertConfig == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "AlertConfig should not be null."));
                return defer.promise;
            }
            var AuditLogHelper: AuditLog = AuditLog.instance();
            alertConfig.delete().then(async (res) => {
                let temString = `subCustCd:${res.custCd},type:${res.type},name:${res.name}`
                await AuditLogHelper.Log("AlertConfig", res.id, temString, user.email, "delete", res)
                defer.resolve(new Message(Message.SUCCESS, "AlertConfig removed successfully."));
            }).catch(err => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", '[AlertConfig bs-Logic]', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to remove AlertConfig", alertConfig));
            });
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", '[AlertConfig bs-Logic]', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Device  delete", error));
        }

        return defer.promise;
    }

    update(alertConfig: IAlertConfig, alertConfigData: any, id: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            var me = this;
            GomosLogger.APILog(G.TRACE_DEBUG, "This is AlertConfig update function for Upate data for = " + user.email, alertConfigData);
            if (alertConfigData["name"] == null || alertConfigData["name"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Name is not provided."));
                return defer.promise;
            }
            if (alertConfigData["spCd"] == null || alertConfigData["spCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "spCd is not provided."));
                return defer.promise;
            }
            if (alertConfigData["custCd"] == null || alertConfigData["custCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "custCd is not provided."));
                return defer.promise;
            }
            if (alertConfigData["subCustCd"] == null || alertConfigData["subCustCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "subCustCd is not provided."));
                return defer.promise;
            }
            // if (AlertConfigData["subCustId"] == null || AlertConfigData["subCustId"].trim().length == 0) {
            //     defer.reject(new Message(Message.INVALID_PARAM, "subCustId is not provided."));
            //     return defer.promise;
            // } 
            if (alertConfigData["sensorNm"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Sensors Type is not provided."));
                return defer.promise;
            }
            if (alertConfigData["businessNm"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Business Name is not provided."));
                return defer.promise;
            }
            if (alertConfigData["configBNm"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Configire Name  is not provided."));
                return defer.promise;
            }
            // if (alertConfigData["lastModifieduser"] == null || alertConfigData["lastModifieduser"].trim().length == 0) {
            //     defer.reject(new Message(Message.INVALID_PARAM, "User Name is not provided."));
            //     return defer.promise;
            // }
            if (alertConfigData["shortName"] == null || alertConfigData["shortName"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "ShortName is not provided."));
                return defer.promise;
            }
            if (alertConfigData["type"] == null || alertConfigData["type"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, " Alert Type is not provided."));
                return defer.promise;
            }
            let criteria = alertConfigData["criteria"];
            if (alertConfigData["criteria"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Please insert valid criteria."));
                return defer.promise;
            }


            let tempObj: any = {};
            tempObj.name = alertConfigData.name;
            tempObj.spCd = alertConfigData.spCd;
            tempObj.custCd = alertConfigData.custCd;
            tempObj.subCustCd = alertConfigData.subCustCd;
            tempObj.subCustId = alertConfigData.subCustId;
            tempObj.sensorNm = alertConfigData.sensorNm;
            tempObj.businessNm = alertConfigData.businessNm;
            tempObj.configBNm = alertConfigData.configBNm;
            tempObj.shortName = alertConfigData.shortName;
            tempObj.type = alertConfigData.type;
            tempObj.lastModifieduser = user.email;
            tempObj.criteria = alertConfigData.criteria;
            tempObj.emailRecipientRole = alertConfigData.emailRecipientRole;
            tempObj.alertText = "`" + `${alertConfigData.alertText}` + "`";
            tempObj.alertTriggeredBy = alertConfigData.alertTriggeredBy
            var AuditLogHelper: AuditLog = AuditLog.instance();
            AlertConfigModel.updateOne({ _id: id, updatedTime: new Date(alertConfigData.updatedTime) }, { "$set": tempObj }).then((res) => {
                //   console.log("this is true", res.nModified)
                if (res.nModified == 0) {
                    throw (new Error("Somethings going wrong in update function ."))
                } else {
                    return me.getById(id,user);
                }
            }).then(async (result: Message) => {
                let temString = `subCustCd:${tempObj.custCd},type:${tempObj.type},name:${tempObj.name}`
                await AuditLogHelper.Log("AlertConfig", id, temString, user.email, "update", alertConfig)
                defer.resolve(new Message(Message.SUCCESS, "Alert Updated successfully.", result.getMessageData()));
            }).catch(err => {
                // console.log("this is false", err)
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", '[AlertConfig bs-Logic]', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to update Alert", alertConfig));
            });
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", '[AlertConfig bs-Logic]', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Device  update", error));
        }
        return defer.promise;

    }


    fetchAll(search_string: string) {
        var defer = q.defer<Message>();


        return defer.promise;
    }
    storelevel1(AlertConfigData: any, user: IUser) {
        var defer = q.defer<Message>();
        try {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is AlertConfig storelevel1 function for insert data for = " + user.email, AlertConfigData);
            if (AlertConfigData["name"] == null || AlertConfigData["name"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Name is not provided."));
                return defer.promise;
            }
            if (AlertConfigData["spCd"] == null || AlertConfigData["spCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "spCd is not provided."));
                return defer.promise;
            }
            if (AlertConfigData["custCd"] == null || AlertConfigData["custCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "custCd is not provided."));
                return defer.promise;
            }
            if (AlertConfigData["subCustCd"] == null || AlertConfigData["subCustCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "subCustCd is not provided."));
                return defer.promise;
            }
            // if (AlertConfigData["subCustId"] == null || AlertConfigData["subCustId"].trim().length == 0) {
            //     defer.reject(new Message(Message.INVALID_PARAM, "subCustId is not provided."));
            //     return defer.promise;
            // } 
            if (AlertConfigData["sensorNm"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Sensors Type is not provided."));
                return defer.promise;
            }
            if (AlertConfigData["businessNm"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Business Name is not provided."));
                return defer.promise;
            }
            if (AlertConfigData["configBNm"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Configire Name  is not provided."));
                return defer.promise;
            }
            // if (AlertConfigData["lastModifieduser"] == null || AlertConfigData["lastModifieduser"].trim().length == 0) {
            //     defer.reject(new Message(Message.INVALID_PARAM, "User Name is not provided."));
            //     return defer.promise;
            // }
            if (AlertConfigData["shortName"] == null || AlertConfigData["shortName"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "ShortName is not provided."));
                return defer.promise;
            }
            if (AlertConfigData["type"] == null || AlertConfigData["type"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, " Alert Type is not provided."));
                return defer.promise;
            }
            //  console.log("this is validation part",this.validCriteria(AlertConfigData["criteria"],AlertConfigData["businessNm"]))
            if (AlertConfigData["criteria"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Please insert valid criteria."));
                return defer.promise;
            }
            if (AlertConfigData["emailRecipientRole"] == null || AlertConfigData["emailRecipientRole"].length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "EmailRecipientRole is not provided."));
                return defer.promise;
            }
            let alertText = AlertConfigData["alertText"];
            if (alertText == null || alertText.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "AlertText is not provided."));
                return defer.promise;
            }
            AlertConfigData["alertText"] = "`" + `${alertText}` + "`"
            if (AlertConfigData["alertTriggeredBy"] == null || AlertConfigData["alertTriggeredBy"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "AlertTriggeredBy is not provided."));
                return defer.promise;
            }
            AlertConfigData["lastModifieduser"] = user.email;

            let alertConfig = new AlertConfigModel(AlertConfigData)
            var AuditLogHelper: AuditLog = AuditLog.instance();
            alertConfig.save(async (err, res) => {
                if (err) {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "storelevel1", '[AlertConfig bs-Logic]', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Alert level 1 Faild."));

                } else {
                    //  console.log("this is res ", res)
                    let temString = `subCustCd:${res.subCustCd},type:${res.type},name:${res.name}`
                    await AuditLogHelper.Log("AlertConfig", res._id, temString, user.email, "create", res)
                    defer.resolve(new Message(Message.SUCCESS, "alert Config Saved .", res));
                }
            })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "storeLevel1", '[AlertConfig bs-Logic]', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Device  storeLevel1", error));
        }


        return defer.promise;
    }
}