import * as q from "q";
import { Device as DeviceModel } from "../Models/Device";
import Message from "../Util/Message";
import { Payload as PayloadModel } from "../Models/Payload";
import { Types, PaginateResult } from "mongoose";
import { IDevice } from '../Models/Device/IDevice';
import { IUser, UserRole, UserEntity } from '../Models/User/IUser';
import GomosLogger from '../Util/commanUtill/GomosLogger';
import G from "../Util/commanUtill/gConstant";
import { env } from "process";
import AuditLog from "./AuditLog";
import SubCustomer from './SubCustomer';
import DeviceState from './DeviceState';

export default class currentDevice {

    private static $_instance: currentDevice = null;

    private constructor() {
    }
    public static instance() {
        if (currentDevice.$_instance == null) {
            currentDevice.$_instance = new currentDevice
        }
        return currentDevice.$_instance;
    }

    getById(Id: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            if (Id == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "currentDevice id should not be empty."));
                return defer.promise;
            }
            user.getDeviceList().then((result) => {
                let deviceList = result.getMessageData();
                if (deviceList.includes(Id)) {
                    return DeviceModel.findOne({
                        _id: Id
                    })
                } else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[Device  bs-Logic] - ', user.email, `Insufficient access - user does not have access for Device_id : ${Id}`, G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }


            })
                .then((modifiedDevice: IDevice) => {
                    if (modifiedDevice == null) {
                        defer.reject(new Message(Message.NOT_FOUND, "currentDevice with id does not exists."));
                    } else {
                        defer.resolve(new Message(Message.SUCCESS, "currentDevice found.", modifiedDevice));
                    }
                }).catch(err => {
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to to find currentDevice", err));
                })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[Device bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Device  getById", error));
        }
        return defer.promise;
    }
    async preparePayloadForUpdate(currentDevice: IDevice, tempObj: any) {
        var sensorsCode = Object.keys(currentDevice.sensors);
        let channelCode = Object.keys(currentDevice.channel);
        var arrayOfPayloads = await PayloadModel.find({ mac: currentDevice.mac });
        for (let i = 0; i < sensorsCode.length; i++) {
            if (currentDevice.sensors[sensorsCode[i]].businessName !== tempObj.sensors[sensorsCode[i]].businessName) {
                for (let j = 0; j < arrayOfPayloads.length; j++) {
                    let TypesArray = Object.keys(arrayOfPayloads[j].sensors);
                    for (let k = 0; k < TypesArray.length; k++) {
                        if (tempObj.sensors[sensorsCode[i]].Type == TypesArray[k]) {

                            let configNames = Object.keys(arrayOfPayloads[j].sensors[TypesArray[k]]);
                            for (let l = 0; l < configNames.length; l++) {
                                if (tempObj.sensors[sensorsCode[i]].configName == configNames[l]) {

                                    arrayOfPayloads[j].sensors[TypesArray[k]][configNames[l]] = tempObj.sensors[sensorsCode[i]].businessName;
                                }
                            }

                        }

                    }
                }

            }


        }
        for (let i = 0; i < channelCode.length; i++) {
            if (currentDevice.channel[channelCode[i]].businessName !== tempObj.channel[channelCode[i]].businessName) {
                for (let j = 0; j < arrayOfPayloads.length; j++) {
                    let TypesArray = Object.keys(arrayOfPayloads[j].sensors);
                    for (let k = 0; k < TypesArray.length; k++) {
                        if (tempObj.channel[channelCode[i]].Type == TypesArray[k]) {

                            let configNames = Object.keys(arrayOfPayloads[j].sensors[TypesArray[k]]);
                            for (let l = 0; l < configNames.length; l++) {
                                if (tempObj.channel[channelCode[i]].configName == configNames[l]) {

                                    arrayOfPayloads[j].sensors[TypesArray[k]][configNames[l]] = tempObj.channel[channelCode[i]].businessName;
                                }
                            }

                        }

                    }
                }

            }
        }

        return arrayOfPayloads;

        // else{
        //     return [];
        // }



    }
    async update(currentDevice: IDevice, modifiedDevice: any, id: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            var me = this;

            if (modifiedDevice.DeviceName == null || modifiedDevice.DeviceName.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "DeviceName is not provided."));
                return defer.promise;
            }

            if (modifiedDevice.mac == null || modifiedDevice.mac.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Mac is not provided."));
                return defer.promise;
            }

            if (modifiedDevice.assetId == null || modifiedDevice.assetId.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Assets is not provided."));
                return defer.promise;
            }

            if (modifiedDevice.subCustCd == null || modifiedDevice.subCustCd.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Sub Customer Code  Id is not provided."));
                return defer.promise;
            }

            if (modifiedDevice.roles == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Roles Id is not provided."));
                return defer.promise;
            }
            if (modifiedDevice.active == null || modifiedDevice.active.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "currentDevice State (Active/Inactive) not provided."));
                return defer.promise;
            }
            if (modifiedDevice.sensors == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Invalid structure provided (Sensors key missing)."));
                return defer.promise;
            }
            if (modifiedDevice.channel == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Invalid structure provided (Channels key missing)."));
                return defer.promise;
            }
            if (modifiedDevice.defaultGroupInfo == null || modifiedDevice.defaultGroupInfo.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Default Group information is missing."));
                return defer.promise;
            }
            let tempObj: any = {}
            tempObj.DeviceName = modifiedDevice.DeviceName;
            tempObj.mac = modifiedDevice.mac;
            tempObj.assetId = modifiedDevice.assetId;
            tempObj.asset_Id = modifiedDevice.asset_Id;
            tempObj.subCustCd = modifiedDevice.subCustCd;
            tempObj.roles = modifiedDevice.roles;
            // deviceM.deviceTemplate = deviceTemplate;
            tempObj.active = modifiedDevice.active;
            tempObj.sensors = modifiedDevice.sensors;
            tempObj.channel = modifiedDevice.channel;
            tempObj.defaultGroupInfo = modifiedDevice.defaultGroupInfo;
            tempObj.deviceTypes = modifiedDevice.deviceTypes;
            var AuditLogHelper: AuditLog = AuditLog.instance();
            let deviceStateHelper = DeviceState.instance();
            let payloadData = await me.preparePayloadForUpdate(currentDevice, tempObj);
            DeviceModel.updateOne({ _id: id, updatedTime: new Date(modifiedDevice.updatedTime) }, { "$set": tempObj }).then(async (res) => {
                if (res.nModified == 0) {
                    throw (new Error("Somethings went wrong in update function."))
                } else {
                    try {
                        await deviceStateHelper.updateDeviceState(tempObj.DeviceName, tempObj.mac, tempObj.sensors, tempObj.channel, currentDevice);

                    } catch (error) {
                        throw (new Error("Somethings went wrong in DeviceState update function."))
                    }
                    try {
                        let tempres: any[] = await payloadData.map(async item => {
                            item.mac = tempObj.mac
                            let payload = new PayloadModel(item);
                            let temp = await payload.save();
                            console.log("this is temp", temp);
                            return temp;
                        });
                    } catch (error) {
                        throw (new Error("Somethings went wrong in Payload update function."))
                    }
                    return me.getById(id, user);
                }
            }).then(async (result: Message) => {
                let temString = `DeiceName:${tempObj.DeviceName},mac:${tempObj.mac},subCustCd:${tempObj.subCustCd}`
                await AuditLogHelper.Log("Devices", id, temString, user.email, "update", currentDevice)
                defer.resolve(new Message(Message.SUCCESS, "Device Updated successfully.", result.getMessageData()));
            }).catch(err => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", 'This is Device  update  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to update Device", currentDevice));
            });
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", '[Device bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Device  update", error));
        }

        return defer.promise;
    }

    create(DeviceName: string, mac: string, assetId: string, subCustCd: string, roles: string, deviceTemplate: string, active: string, sensors: object, channel: object, defaultGroupInfo: string, deviceTypes: string, user: IUser) {
        var defer = q.defer<Message>();
        try {
            if (DeviceName == null || DeviceName.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "DeviceName is not provided."));
                return defer.promise;
            }

            if (mac == null || mac.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Mac is not provided."));
                return defer.promise;
            }

            if (assetId == null || assetId.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Assets is not provided."));
                return defer.promise;
            }

            if (subCustCd == null || subCustCd.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Sub Customer Code  Id is not provided."));
                return defer.promise;
            }

            if (roles == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Roles Id is not provided."));
                return defer.promise;
            }

            // if(deviceTemplate == null ){
            //     defer.reject(new Message(Message.INVALID_PARAM,"DeviceTemplate Id is not provided."));
            //     return defer.promise;
            // }
            if (active == null || active.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Active Id is not provided."));
                return defer.promise;
            }
            if (sensors == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Sensors Id is not provided."));
                return defer.promise;
            }
            if (channel == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Channel Id is not provided."));
                return defer.promise;
            }
            if (defaultGroupInfo == null || defaultGroupInfo.trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Default Group Info  is not provided."));
                return defer.promise;
            }
            let deviceM = new DeviceModel;
            deviceM.DeviceName = DeviceName;
            deviceM.mac = mac;
            deviceM.assetId = assetId;
            deviceM.subCustCd = subCustCd;
            deviceM.roles = roles;
            deviceM.deviceTemplate = deviceTemplate;
            deviceM.active = active;
            deviceM.sensors = sensors;
            deviceM.channel = channel;
            deviceM.defaultGroupInfo = defaultGroupInfo;
            deviceM.deviceTypes = deviceTypes;
            deviceM.save().then(result => {
                defer.resolve(new Message(Message.SUCCESS, "currentDevice Inserted.", result));

            }).catch(err => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "create", 'This is Device  create  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to currentDevice Inserted ."));

            })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "create", '[Device bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Device  create", error));
        }

        return defer.promise;
    }
    createByTemplate(DeviceName: string, mac: string, subCustCd: string, subCustId: Types.ObjectId, assetId: string, asset_Id: Types.ObjectId, active: string, deviceSetup: object, payloadSetup: any[], user: IUser) {
        var defer = q.defer<Message>();
        try {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is currentDevice createByTemplate function for insert  deviceSetup data for = " + user.email, deviceSetup);
            deviceSetup["DeviceName"] = DeviceName;
            deviceSetup["mac"] = mac;
            deviceSetup["subCustCd"] = subCustCd;
            deviceSetup["subCustId"] = subCustId;
            deviceSetup["assetId"] = assetId;
            deviceSetup["asset_Id"] = asset_Id;
            // deviceSetup["active"] = active;


            let deviceM = new DeviceModel(deviceSetup);
            var AuditLogHelper: AuditLog = AuditLog.instance();
            deviceM.save(async (err, res) => {
                if (err) {
                    GomosLogger.APILog(G.TRACE_DEBUG, "This is currentDevice create function for  failed data for = ", err);
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "create", 'This is currentDevice  update  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to currentDevice Inserted .", err));


                } else {
                    // console.log(res, "-=-result")
                    try {
                        let tempres: any[] = await payloadSetup.map(async item => {
                            item.mac = mac
                            let payload = new PayloadModel(item);
                            let temp = await payload.save();
                            return temp;

                        });
                        let tem = {
                            DeviceResult: res,
                            PayloadResult: tempres
                        }
                        let temString = `mac:${res.mac}assetId:${res.assetId},subCustCd:${res.subCustCd},DeviceName:${res.DeviceName}`
                        await AuditLogHelper.Log("currentDevice", res._id, temString, user.email, "create", tem)
                        defer.resolve(new Message(Message.SUCCESS, "currentDevice Inserted.", tem));
                    } catch (err) {
                        GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "createByTemplate", 'This is currentDevice  create  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                        defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Payload Inserted .", err));
                    }

                }
            })

            //   .then(async result => {
            //       console.log(result,"-=-result")
            //     let tempres:any[] = await payloadSetup.map(async item => {
            //         item.mac = mac
            //             let payload = new PayloadModel(item);
            //            let temp =  await payload.save();
            //            return temp;

            //         });

            //             let tem = {
            //                 DeviceResult: result,
            //                 PayloadResult: tempres
            //             }
            //             let temString = `mac:${result.mac}assetId:${result.assetId},subCustCd:${result.subCustCd},DeviceName:${result.DeviceName}`
            //             await AuditLogHelper.Log("Customers",result._id,temString,user.email,"create",tem)
            //             defer.resolve(new Message(Message.SUCCESS, "currentDevice Inserted.", tem));

            //         // defer.resolve(new Message(Message.SUCCESS, "currentDevice Inserted.", result));

            //     }).catch(err => {
            //         GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "create", 'This is currentDevice  update  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            //          defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to currentDevice Inserted .",err));

            //     })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "createByTemplate", '[Device bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Device  createByTemplate", error));
        }

        return defer.promise;
    }
    fetchAllBySubCustId(subCustId: Types.ObjectId, filterbyAsset: string[], user: IUser) {
        var defer = q.defer<Message>();

        let query: any = {};
        try {
            user.getSubCustomerList().then((result) => {
                let subCustomerList = result.getMessageData();
                if (subCustomerList.includes(subCustId)) {
                    query["subCustId"] = subCustId;

                    if (filterbyAsset != null && filterbyAsset.length > 0) {
                        query["asset_Id"] = { "$in": filterbyAsset }
                    }

                    return DeviceModel.find(query).populate("asset_Id")
                } else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[Device  bs-Logic] - ', user.email, `Insufficient access - user does not have access for : ${subCustId}`, G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }


            }).then((result: IDevice[]) => {
                defer.resolve(new Message(Message.SUCCESS, "Device fetched.", result));
            }).catch(error => {
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch Device."));
            })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "createByTemplate", '[Device bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Device  createByTemplate", error));
        }
        return defer.promise;
    }
    fetchAllBySubCustCd(subCustCd: string) {
        var defer = q.defer<Message>();

        let query: any = {};
        // if(search_string.trim().length != 0){
        query["subCustCd"] = subCustCd;
        // }
        // if(query.deleted == undefined){
        //     query['deleted']  = false;
        // }

        DeviceModel.find(query).then((result: IDevice[]) => {
            defer.resolve(new Message(Message.SUCCESS, "User fetched.", result));
        }).catch(error => {
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch user."));
        })
        return defer.promise;
    }

    fetchBymac(mac) {
        var defer = q.defer<Message>();
        if (mac == null || mac.trim().length == 0) {
            defer.reject(new Message(Message.INVALID_PARAM, "mac Id is not provided."));
            return defer.promise;
        }
        DeviceModel.find({ mac }).then((result: IDevice[]) => {
            defer.resolve(new Message(Message.SUCCESS, "currentDevice fetched.", result));
        }).catch(error => {
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch currentDevice."));
        });
        return defer.promise;
    }
    fetchAll(search_string: string,user:IUser) {
        var defer = q.defer<Message>();


        return defer.promise;
    }
    // private userSubCustomer(user: IUser) {
    //     var defer = q.defer<Message>();

    //     var helper: SubCustomer = SubCustomer.instance();
    //     // var userChannel:UserChannel  =   UserChannel.instance();
    //     if (user.userEntity ==  UserEntity.PLATFORM) {
    //         return helper.fetchAll(user);
    //     } else {
    //         var subCustomer = [];
    //         helper.fetch(user).then((result: Message) => {
    //             var subCustomer_data = result.getMessageData();
    //             subCustomer_data.forEach(element => {
    //                 subCustomer_data.push(element);
    //             });
    //             defer.resolve(new Message(Message.SUCCESS, "SubCustomer", subCustomer_data));
    //         }).catch(err => {
    //             GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "userSubCustomer", 'This is Customer userSubCustomer  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
    //             defer.reject(new Message(Message.INTERNAL_ERROR, "Error", err));
    //         })
    //     }
    //     return defer.promise;
    // }
    fetch(subCustCd_search: string, search_string: string, page: number, page_size: number, user: IUser) {
        var defer = q.defer<Message>();

        var query = {};

       

        user.getDeviceList().then((result) => {

            let deviceList = result.getMessageData();
            if (deviceList.length >= 0) {
                query['_id'] = { '$in': deviceList };
            
            if (search_string.trim().length != 0) {
                query["DeviceName"] ={
                        '$regex': '.*' + search_string + '.*',
                        '$options': 'i'
                };
            }
            query['deleted'] = false;
            if (subCustCd_search.length != 0) {
                let tempsub = subCustCd_search.split(",")
                query["subCustCd"] = {
                    '$in': tempsub,
                };
            }
            // console.log("query log", query)
            return DeviceModel.paginate(query, {
                page: page,
                limit: page_size,
                populate: [{
                    'path': 'subCustId',
                    'select': ["_id", 'name', 'subCustCd']
                }, {
                    'path': 'asset_Id',
                    'select': ["_id", 'name', 'assetId']
                }],

            })
        } else {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", '[Device  bs-Logic] - ', user.email, "Insufficient access -    user.getDeviceList() returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
        }
        }).then((result: PaginateResult<IDevice>) => {
            // console.log(result)
            defer.resolve(new Message(Message.SUCCESS, "currentDevice fetched.", result));
        }).catch(error => {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", 'This is currentDevice  fetch  error ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch currentDevice."));
        })
        return defer.promise;
    }
}