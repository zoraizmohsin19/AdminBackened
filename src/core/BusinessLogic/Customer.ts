import * as q from "q";
import { Customer as CustomerModel } from '../Models/Customer';
import Message from "../Util/Message";
import Validation from "../Util/Validation";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import * as env from "../../../config/env.json";
import { Types, PaginateResult } from "mongoose"

import * as moment from "moment";
const saltRounds = 10;
import * as CryptoJS from "crypto-js";
import { ICustomer } from '../Models/Customer/ICustomer';
import { UserRole, IUser, UserEntity } from '../Models/User/IUser';
import GomosLogger from "../Util/commanUtill/GomosLogger";
import G from "../Util/commanUtill/gConstant";
import AuditLog from "./AuditLog";
import ServiceProvider from "./ServiceProvider";



export default class Customer {

    private static $_instance: Customer = null;

    private constructor() {
    }
    public static instance() {
        if (Customer.$_instance == null) {
            Customer.$_instance = new Customer
        }
        return Customer.$_instance;
    }
    create(CustomerData: any, user: IUser) {
        var defer = q.defer<Message>();
        try {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is Customer create function for insert data for = " + user.email, CustomerData);
            if (CustomerData["name"] == null || CustomerData["name"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Name is not provided."));
                return defer.promise;
            }
            if (CustomerData["custCd"] == null || CustomerData["custCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Customer Code is not provided."));
                return defer.promise;
            }

            if (CustomerData["spCd"] == null || CustomerData["spCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Service Provider is not provided."));
                return defer.promise;
            }

            if (CustomerData["address"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Address is not provided."));
                return defer.promise;
            }

            if (CustomerData["phone"] == null || CustomerData["phone"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Phone is not provided."));
                return defer.promise;
            }

            if (CustomerData["email"] == null || CustomerData["email"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Email is not provided."));
                return defer.promise;
            }

            if (CustomerData["mqttClient"] == null || CustomerData["mqttClient"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Mqtt Client is not provided."));
                return defer.promise;
            }

            if (CustomerData["description"] == null || CustomerData["description"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Description is not provided."));
                return defer.promise;
            }

            if (CustomerData["active"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Active is not provided."));
                return defer.promise;
            }

            if (CustomerData["urlToSend"] == null || CustomerData["urlToSend"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "UrlToSend is not provided."));
                return defer.promise;
            }
            if (CustomerData["SubTopic"] == null || CustomerData["SubTopic"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Sub Topic is not provided."));
                return defer.promise;
            }
            if (CustomerData["PubTopic"] == null || CustomerData["PubTopic"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Pub Topic is not provided."));
                return defer.promise;
            }
            CustomerData.lastModifieduser = user.email;
            let customer = new CustomerModel(CustomerData)
            var AuditLogHelper: AuditLog = AuditLog.instance();
            customer.save(async (err, res) => {
                if (err) {
                    GomosLogger.APILog(G.TRACE_DEBUG, "This is Customer create function for  failed data for = ", err);
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "create", 'This is Customer create  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, " Customer  failed to insert."));

                } else {
                    console.log("this is res ", res)
                    let temString = `spCd:${res.spCd}custCd:${res.custCd},name:${res.name}`
                    await AuditLogHelper.Log("Customers", res._id, temString, user.email, "create", res)
                    defer.resolve(new Message(Message.SUCCESS, " Customer sucessfully  created  .", res));
                }
            })
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "create", '[Customer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Customer  Create", error));
        }
        return defer.promise;
    }

    fetchAll(user: IUser) {
        var defer = q.defer<Message>();
        try {
            var query: any = {};

            user.getCustomerList().then((result) => {
                let customerList = result.getMessageData();
                if (customerList.length >= 0) {
                    query["_id"] = { "$in": customerList }
                    query["deleted"] = false;
                    GomosLogger.APILog(G.TRACE_DEBUG, "This is Customer fetchAll query ", query);
                    return CustomerModel.find(query);
                } else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAll", '[Customer  bs-Logic] - ', user.email, "Insufficient access -   user.getCustomerList returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }

            }).then((result: ICustomer[]) => {
                GomosLogger.APILog(G.TRACE_DEBUG, "This is Customer fetchAll result ", result);
                defer.resolve(new Message(Message.SUCCESS, "Customer fetched.", result));
            }).catch(error => {
                GomosLogger.APILog(G.TRACE_DEBUG, "This is Customer fetchAll error on resul ", error);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch ."));
            })
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAll", '[Customer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Customer  fetchAll", error));
        }
        return defer.promise;
    }
    fetchAllByspId(spId: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            let query: any = {};
            // if(search_string.trim().length != 0){
            user.getServiceProviderList().then((result) => {
                let serviceproviderList = result.getMessageData();
                if (serviceproviderList.includes(spId)) {
                    query['deleted'] = false;
                    query["spId"] = spId;
                    return CustomerModel.find(query).populate("spId")
                } else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAllByspId", '[Customer  bs-Logic] - ', user.email, "Insufficient access -   user.getServiceProviderList() returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "You not have access read this customer by Id"));
                }
            }).then((result: ICustomer[]) => {
                defer.resolve(new Message(Message.SUCCESS, "Customer  fetched by spId.", result));
            }).catch(error => {
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch Customer by spId."));
            })
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAllByspId", '[Customer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Customer  fetchAll", error));
        }
        return defer.promise;
    }

    fetch(spCd_search: string, search_string: string, page: number, page_size: number, user: IUser) {
        var defer = q.defer<Message>();
        try {
            var query = {};

            user.getCustomerList().then((result) => {
                let customerList = result.getMessageData();
                if (customerList.length >= 0) {
                    query["_id"] = { "$in": customerList }
                    query["deleted"] = false;
                    if (search_string.trim().length != 0) {
                        query["name"] = {
                            '$regex': '.*' + search_string + '.*',
                            '$options': 'i'
                        };
                    }
                    if (spCd_search.length != 0) {
                        let tempsub = spCd_search.split(",")
                        query["spCd"] = {
                            '$in': tempsub,
                        };
                    }
                    return CustomerModel.paginate(query, {
                        page: page,
                        limit: page_size,
                        populate: [{
                            'path': 'spId',
                            'select': ["_id", 'name', 'spCd']
                        }]})
                    
                } else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", '[Customer  bs-Logic] - ', user.email, "Insufficient access -   user.getCustomerList returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }
           
          
            }).then((result: PaginateResult<ICustomer>) => {
                defer.resolve(new Message(Message.SUCCESS, "Customer fetched.", result));
            }).catch(error => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", 'This is Customer  fetch  error ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch Customer."));
            })
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", '[Customer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Customer  fetch", error));
        }
        return defer.promise;
    }
    getById(Customer_id: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            if (Customer_id == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Customer id should not be empty."));
                return defer.promise;
            }
            user.getCustomerList().then((result) => {
                let customerList = result.getMessageData();
                if (customerList.includes(Customer_id)) {

                    return CustomerModel.findOne({ _id: Customer_id }).populate({ path: 'spId', select: ['name', 'spCd'] })
                } else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[Customer  bs-Logic] - ', user.email, `Insufficient access - user does not have access for Customer_id: ${Customer_id}`, G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }
            })
            .then((customer: ICustomer) => {
                    if (customer == null) {
                        defer.reject(new Message(Message.NOT_FOUND, "Customer with id does not exists."));
                    } else {
                        defer.resolve(new Message(Message.SUCCESS, "Customer found.", customer));
                    }
                }).catch(err => {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[Customer  bs-Logic] - ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to to find Customer", err));
                })
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[Customer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to to find Customer", error));
        }
        return defer.promise;
    }

    delete(customer: ICustomer, user: IUser) {
        var defer = q.defer<Message>();
        try {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is Customer delete function for delete data for = " + user.email, customer);
            if (customer == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Customer should not be null."));
                return defer.promise;
            }
            var AuditLogHelper: AuditLog = AuditLog.instance();
            customer.delete().then(async (res) => {
                let temString = `spCd:${res.spCd},custCd:${res.custCd},name:${res.name}`
                await AuditLogHelper.Log("Customers", res.id, temString, user.email, "delete", res)

                defer.resolve(new Message(Message.SUCCESS, "Customer removed successfully."));
            }).catch(err => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", 'This is Customer  delete  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to remove Customer", customer));
            });
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", '[Customer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Customer  delete", error));
        }
        return defer.promise;
    }
    update(customer: ICustomer, CustomerData: any, id: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            var me = this;
            GomosLogger.APILog(G.TRACE_DEBUG, "This is Customer update function for insert data for = " + user.email, CustomerData);
            if (CustomerData["name"] == null || CustomerData["name"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Name is not provided."));
                return defer.promise;
            }
            if (CustomerData["custCd"] == null || CustomerData["custCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Customer Code is not provided."));
                return defer.promise;
            }

            if (CustomerData["spCd"] == null || CustomerData["spCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Service Provider is not provided."));
                return defer.promise;
            }

            if (CustomerData["address"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Address is not provided."));
                return defer.promise;
            }

            if (CustomerData["phone"] == null || CustomerData["phone"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Phone is not provided."));
                return defer.promise;
            }

            if (CustomerData["email"] == null || CustomerData["email"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Email is not provided."));
                return defer.promise;
            }

            if (CustomerData["mqttClient"] == null || CustomerData["mqttClient"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Mqtt Client is not provided."));
                return defer.promise;
            }

            if (CustomerData["description"] == null || CustomerData["description"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Description is not provided."));
                return defer.promise;
            }

            if (CustomerData["active"] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Active is not provided."));
                return defer.promise;
            }

            if (CustomerData["urlToSend"] == null || CustomerData["urlToSend"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "UrlToSend is not provided."));
                return defer.promise;
            }
            if (CustomerData["SubTopic"] == null || CustomerData["SubTopic"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Sub Topic is not provided."));
                return defer.promise;
            }
            if (CustomerData["PubTopic"] == null || CustomerData["PubTopic"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Pub Topic is not provided."));
                return defer.promise;
            }

            let tempObj: any = {};
            tempObj.name = CustomerData.name;
            tempObj.custCd = CustomerData.custCd;
            tempObj.spCd = CustomerData.spCd;
            tempObj.address = CustomerData.address;
            tempObj.phone = CustomerData.phone;
            tempObj.email = CustomerData.email;
            tempObj.mqttClient = CustomerData.mqttClient;
            tempObj.description = CustomerData.description;
            tempObj.active = CustomerData.active;
            tempObj.urlToSend = CustomerData.urlToSend;
            tempObj.SubTopic = CustomerData.SubTopic;
            tempObj.PubTopic = CustomerData.PubTopic;
            tempObj.lastModifieduser = user.email;
            var AuditLogHelper: AuditLog = AuditLog.instance();
            CustomerModel.updateOne({ _id: id, updatedTime: new Date(CustomerData.updatedTime) }, { "$set": tempObj }).then((res) => {
                //   console.log("this is true", res.nModified)
                if (res.nModified == 0) {
                    throw (new Error("Somethings going wrong in update function ."))
                } else {
                    return me.getById(id, user);
                }
            }).then(async (result: Message) => {
                let temString = `spCd:${tempObj.spCd},custCd:${tempObj.custCd},name:${tempObj.name}`
                await AuditLogHelper.Log("Customers", id, temString, user.email, "update", customer)
                defer.resolve(new Message(Message.SUCCESS, "Customer Updated successfully.", result.getMessageData()));
            }).catch(err => {
                // console.log("this is false", err)
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", 'This is Customer  update  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to update Alert", customer));
            });
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", '[Customer  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Customer  update", error));
        }

        return defer.promise;

    }


}