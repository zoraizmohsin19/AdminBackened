import * as q from "q";
import { SubCustomer as SubCustomerModel } from "../Models/SubCustomer";
import Message from "../Util/Message";
import Validation from "../Util/Validation";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import * as env from "../../../config/env.json";
import { Types, PaginateResult } from "mongoose"

import * as moment from "moment";
const saltRounds = 10;
import * as CryptoJS from "crypto-js";
import { ISubCustomer } from '../Models/SubCustomer/ISubCustomer';
import { IUser, UserRole, UserEntity } from "../Models/User/IUser";
import GomosLogger from "../Util/commanUtill/GomosLogger";
import AuditLog from "./AuditLog";
import G from "../Util/commanUtill/gConstant";
import ServiceProvider from "./ServiceProvider";


export default class SubCustomer {

    private static $_instance: SubCustomer = null;

    private constructor() {
        // console.log("this is called", userDetails)
    }
    public static instance() {
        if (SubCustomer.$_instance == null) {
            SubCustomer.$_instance = new SubCustomer
        }
        return SubCustomer.$_instance;
    }
    fetch(user: IUser) {
        var defer = q.defer<Message>();
        try {
            var query: any = {};
            user.getSubCustomerList().then((result) => {
                let subCustlist = result.getMessageData()
                if (subCustlist.length >= 0) {
                    query["_id"] = { "$in": subCustlist }
                    query['deleted'] = false;
                    return SubCustomerModel.find(query);
                }else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", '[SubCustomer  bs-Logic] - ', user.email, "Insufficient access -   user.getSubCustomerList() returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }
              
            }).then((result: ISubCustomer[]) => {
                defer.resolve(new Message(Message.SUCCESS, "SubCustomer fetched.", result));
            }).catch(err => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", '[SubCustomer  bs-Logic] - ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch user."));
            })
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", '[SubCustomer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to SubCustomer  fetch", error));
        }
        return defer.promise;
    }


    fetchAll(user: IUser) {
        var defer = q.defer<Message>();
        try {
            var query: any = {};
            user.getSubCustomerList().then((result) => {
                let subCustlist = result.getMessageData()
                if (subCustlist.length >= 0) {
                    query["_id"] = { "$in": subCustlist }
                    query['deleted'] = false;
                    return SubCustomerModel.find(query);
                }else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAll", '[SubCustomer  bs-Logic] - ', user.email, "Insufficient access -   user.getSubCustomerList() returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }
               
            }).then((result: ISubCustomer[]) => {
                defer.resolve(new Message(Message.SUCCESS, "subCutomer fetched.", result));
            }).catch(err => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAll", '[SubCustomer  bs-Logic] - ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetchAll by user."));
            })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAll", '[SubCustomer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to SubCustomer  fetchAll", error));
        }
        return defer.promise;
    }

    fetchAllBycustId(custId: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            let query: any = {};
            user.getCustomerList().then((result) => {
                let customerList = result.getMessageData();
                if (customerList.includes(custId)) {
                    query["custId"] = custId;
                    query['deleted'] = false;
                    return SubCustomerModel.find(query).populate(["custId", "spId"])
                } else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAllBycustId", '[SubCustomer  bs-Logic] - ', user.email, "Insufficient access -    user.getCustomerList() returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }

            }).then((result: ISubCustomer[]) => {
                defer.resolve(new Message(Message.SUCCESS, "Sub Customer  fetched by custId.", result));
            }).catch(err => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAllBycustId", '[SubCustomer  bs-Logic] - ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch Sub Customer by custId."));
            })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAllBycustId", '[SubCustomer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to SubCustomer  fetchAllBycustId", error));
        }
        return defer.promise;
    }

    fetchBysubCustCd(subCustCd) {
        var defer = q.defer<Message>();


        SubCustomerModel.findOne({ subCustCd }).then((result: ISubCustomer) => {
            defer.resolve(new Message(Message.SUCCESS, "User fetched.", result));
        }).catch(error => {
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch user."));
        });
        return defer.promise;
    }
    fetchdata(search_string: string, customer_query: string, page: number, page_size: number, user: IUser) {
        var defer = q.defer<Message>();
        try {
            var query = {};
            user.getSubCustomerList().then((result) => {
                let subCustlist = result.getMessageData()

                if (subCustlist.length >= 0) {
                    query["_id"] = { "$in": subCustlist };
                    if (search_string.trim().length != 0) {
                        query["name"] = {
    
                            '$regex': '.*' + search_string + '.*',
                            '$options': 'i'
                        };
                    }
                    query["deleted"] = false;
                    return SubCustomerModel.paginate(query, {
                        page: page,
                        limit: page_size,
                        populate: [{
                            'path': 'custId',
                        }, {
                            'path': 'spId',
                        }]
                    })
                }else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAllBycustId", '[SubCustomer  bs-Logic] - ', user.email, "Insufficient access -    user.getCustomerList() returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }
            
            }).then((result: PaginateResult<ISubCustomer>) => {
                defer.resolve(new Message(Message.SUCCESS, "SubCustomer fetched.", result));
            }).catch(err => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", '[SubCustomer  bs-Logic] - ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch SubCustomer."));
            })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchdata", '[SubCustomer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to SubCustomer  fetchdata", error));
        }
        return defer.promise;
    }


    create(SubCustomerData: any, user: IUser) {
        var defer = q.defer<Message>();
        try {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is Customer create function for insert data for = " + user.email, SubCustomerData);
            if (SubCustomerData["name"] == null || SubCustomerData["name"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Name is not provided."));
                return defer.promise;
            }
            if (SubCustomerData["custCd"] == null || SubCustomerData["custCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Customer Code is not provided."));
                return defer.promise;
            }
            if (SubCustomerData["subCustCd"] == null || SubCustomerData["subCustCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "SubCustomer Code is not provided."));
                return defer.promise;
            }


            if (SubCustomerData["spCd"] == null || SubCustomerData["spCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Service Provider is not provided."));
                return defer.promise;
            }

            if (SubCustomerData["address"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Address is not provided."));
                return defer.promise;
            }

            if (SubCustomerData["phone"] == null || SubCustomerData["phone"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Phone is not provided."));
                return defer.promise;
            }

            if (SubCustomerData["email"] == null || SubCustomerData["email"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Email is not provided."));
                return defer.promise;
            }


            SubCustomerData.lastModifieduser = user.email;
            let subcustomer = new SubCustomerModel(SubCustomerData)
            var AuditLogHelper: AuditLog = AuditLog.instance();
            subcustomer.save(async (err, res) => {
                if (err) {
                    GomosLogger.APILog(G.TRACE_DEBUG, "This is SubCustomer create function for  failed data for = ", err);
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "create", 'This is SubCustomer create  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, " SubCustomer  failed to insert."));
                } else {
                    let temString = `spCd:${res.spCd}custCd:${res.custCd},name:${res.name}`
                    await AuditLogHelper.Log("SubCustomers", res._id, temString, user.email, "create", SubCustomerData)
                    defer.resolve(new Message(Message.SUCCESS, "Sub Customer sucessfully  created  .", res));
                }
            })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "create", '[SubCustomer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to SubCustomer  create", error));
        }
        return defer.promise;
    }



    getById(SubCustomer_id: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            console.log("this is getById ", SubCustomer_id)
            if (SubCustomer_id == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "SubCustomer id should not be empty."));
                return defer.promise;
            }
            user.getSubCustomerList().then((result) => {
                var subCustomerList = result.getMessageData();
                console.log("this is subCustomerList ", subCustomerList)
                console.log("this is getById ", SubCustomer_id)
                if (subCustomerList.includes(SubCustomer_id)) {
                    return SubCustomerModel.findOne({ _id: SubCustomer_id }).populate({ path: 'spId', select: ['name', 'spCd'] })
                } else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[SubCustomer  bs-Logic] - ', user.email, `Insufficient access - user does not have access for SubCustomer_id: ${SubCustomer_id}`, G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }


            }).then((subcustomer: ISubCustomer) => {
                if (subcustomer == null) {
                    defer.reject(new Message(Message.NOT_FOUND, "SubCustomer with id does not exists."));
                } else {
                    defer.resolve(new Message(Message.SUCCESS, "SubCustomer found.", subcustomer));
                }
            }).catch(err => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", 'This is SubCustomer  getById  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to to find SubCustomer", err));
            })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[SubCustomer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to SubCustomer  getById", error));
        }
        return defer.promise;
    }


    update(subcustomer: ISubCustomer, SubCustomerData: any, id: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            var me = this;
            GomosLogger.APILog(G.TRACE_DEBUG, "This is Customer create function for insert data for = " + user.email, SubCustomerData);
            if (SubCustomerData["name"] == null || SubCustomerData["name"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Name is not provided."));
                return defer.promise;
            }
            if (SubCustomerData["custCd"] == null || SubCustomerData["custCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Customer Code is not provided."));
                return defer.promise;
            }
            if (SubCustomerData["subCustCd"] == null || SubCustomerData["subCustCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "SubCustomer Code is not provided."));
                return defer.promise;
            }


            if (SubCustomerData["spCd"] == null || SubCustomerData["spCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Service Provider is not provided."));
                return defer.promise;
            }

            if (SubCustomerData["address"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Address is not provided."));
                return defer.promise;
            }

            if (SubCustomerData["phone"] == null || SubCustomerData["phone"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Phone is not provided."));
                return defer.promise;
            }

            if (SubCustomerData["email"] == null || SubCustomerData["email"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Email is not provided."));
                return defer.promise;
            }
            let tempObj: any = {};
            tempObj.name = SubCustomerData.name;
            tempObj.custCd = SubCustomerData.custCd;
            tempObj.subcustCd = SubCustomerData.subcustCd;
            tempObj.custId = SubCustomerData.custId;
            tempObj.spCd = SubCustomerData.spCd;
            tempObj.address = SubCustomerData.address;
            tempObj.phone = SubCustomerData.phone;
            tempObj.email = SubCustomerData.email;
            tempObj.lastModifieduser = user.email;
            var AuditLogHelper: AuditLog = AuditLog.instance();
            SubCustomerModel.updateOne({ _id: id, updatedTime: new Date(SubCustomerData.updatedTime) }, { "$set": tempObj }).then((res) => {
                //   console.log("this is true", res.nModified)
                if (res.nModified == 0) {
                    throw (new Error("Somethings going wrong in update function ."))
                } else {
                    return me.getById(id,user);
                }
            }).then(async (result: Message) => {
                let temString = `spCd:${tempObj.spCd},custCd:${tempObj.custCd},subcustCd:${tempObj.subcustCd}name:${tempObj.name}`
                await AuditLogHelper.Log("SubCustomers", id, temString, user.email, "update", subcustomer)
                defer.resolve(new Message(Message.SUCCESS, "SubCustomer Updated successfully.", result.getMessageData()));
            }).catch(err => {
                // console.log("this is false", err)
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", 'This is SubCustomer  update  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to update Alert", subcustomer));
            });
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", '[SubCustomer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to SubCustomer  update", error));
        }
        return defer.promise;

    }
    delete(subcustomer: ISubCustomer, user: IUser) {
        var defer = q.defer<Message>();
        try{
        GomosLogger.APILog(G.TRACE_DEBUG, "This is SubCustomer delete function for delete data for = " + user.email, subcustomer);
        if (subcustomer == null) {
            defer.reject(new Message(Message.INVALID_PARAM, "SubCustomer should not be null."));
            return defer.promise;
        }
        var AuditLogHelper: AuditLog = AuditLog.instance();
        subcustomer.delete().then(async (res) => {
            let temString = `spCd:${res.spCd},custCd:${res.custCd},name:${res.name}`
            await AuditLogHelper.Log("SubCustomers", res.id, temString, user.email, "delete", res)

            defer.resolve(new Message(Message.SUCCESS, "SubCustomer removed successfully."));
        }).catch(err => {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", 'This is SubCustomer  delete  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to remove SubCustomer", subcustomer));
        });
    } catch (error) {
        GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", '[SubCustomer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
        defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to SubCustomer  delete", error));
    }
        return defer.promise;
    }
}