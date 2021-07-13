import * as q from "q";
import { Asset as AssetModel } from '../Models/Asset';
import Message from "../Util/Message";
import * as env from "../../../config/env.json";
import { Types, PaginateResult } from "mongoose"
import { IAsset } from '../Models/Asset/IAsset';
import { IUser } from '../Models/User/IUser';
import GomosLogger from "../Util/commanUtill/GomosLogger";
import G from "../Util/commanUtill/gConstant";
import AuditLog from "./AuditLog";



export default class Asset {

    private static $_instance: Asset = null;

    private constructor() {
    }
    public static instance() {
        if (Asset.$_instance == null) {
            Asset.$_instance = new Asset
        }
        return Asset.$_instance;
    }
    fetchByAssetId(assetId, subCustCd) {
        var defer = q.defer<Message>();

        AssetModel.findOne({ assetId, subCustCd }).then((result: IAsset) => {
            defer.resolve(new Message(Message.SUCCESS, "Asset fetched.", result));
        }).catch(error => {
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch Asset."));
        });
        return defer.promise;
    }

    fetchAllBySubCustomer(subCustId: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            if (subCustId == null) {
                defer.reject(new Message(Message.INTERNAL_ERROR, "Sub Customer undefined."));

            }
            var query: any = {};
            user.getSubCustomerList().then((result) => {
                let subCustomerList = result.getMessageData();
                if (subCustomerList.includes(subCustId)) {
                    query["subCustId"] = subCustId
                    query['deleted'] = false;
                    return AssetModel.find(query)
                } else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAllBycustId", '[Asset  bs-Logic] - ', user.email, "Insufficient access -    user.getCustomerList() returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }
            }).then((result: IAsset[]) => {
                defer.resolve(new Message(Message.SUCCESS, "Asset fetched.", result));
            }).catch(error => {
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch Asset."));
            })
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAllBySubCustomer", '[Asset bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Asset  fetchAllBySubCustomer", error));
        }
        return defer.promise;
    }
    fetchAll(subCustCd: string, user: IUser) {
        var defer = q.defer<Message>();
        try {
            if (subCustCd == null) {
                defer.reject(new Message(Message.INTERNAL_ERROR, "Sub Customer undefined."));

            }
            var query: any = {};
            user.getAssetsList().then((result) => {
                let assetList = result.getMessageData()
                if (assetList.length >= 0) {
                    query["_id"] = { "$in": assetList }

                    if (subCustCd.trim().length != 0) {
                        query["subCustCd"] = subCustCd
                    }

                    query["deleted"] = false;
                    return AssetModel.find(query)
                } else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAll", '[Asset  bs-Logic] - ', user.email, "Insufficient access -    user.getAssetsList() returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }
            }).then((result: IAsset[]) => {
                defer.resolve(new Message(Message.SUCCESS, "Asset fetched.", result));
            }).catch(error => {
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch Asset."));
            })
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAll", '[Asset bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Asset  fetchAll", error));
        }
        return defer.promise;
    }
    fetch(search_string: string, subcustomer_query: string, page: number, page_size: number, user: IUser) {
        var defer = q.defer<Message>();
        try {
            user.getAssetsList().then(result => {
                var query = {};
                let assetList = result.getMessageData();
                if (assetList.length >= 0) {
                    query["_id"] = { "$in": assetList }

                    if (search_string.trim().length != 0) {
                        query["name"] = {
                            '$regex': '.*' + search_string + '.*',
                            '$options': 'i'
                        }
                    };

                    if (subcustomer_query.length != 0) {
                        let tempsub = subcustomer_query.split(",")
                        query["subCustCd"] = {
                            '$in': tempsub,
                        };
                    }
                    query["deleted"] = false;
                    return AssetModel.paginate(query, {
                        page: page,
                        limit: page_size,
                        populate: [{ "path": "subCustId" }]

                    })

                }
                else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", '[Asset  bs-Logic] - ', user.email, "Insufficient access -    user.getAssetsList() returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }

            }).then((result: PaginateResult<IAsset>) => {
                defer.resolve(new Message(Message.SUCCESS, "Asset fetched.", result));
            }).catch(error => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", 'This is Asset  fetch  error ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch Asset."));
            })
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", '[Asset bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Asset  fetch", error));
        }
        return defer.promise;
    }

    create(AssetData: any, user: IUser) {
        var defer = q.defer<Message>();
        try {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is Asset create function for insert data for = " + user.email, AssetData);
            if (AssetData["name"] == null || AssetData["name"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Name is not provided."));
                return defer.promise;
            }
            if (AssetData["subCustCd"] == null || AssetData["subCustCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "sub customer code Code is not provided."));
                return defer.promise;
            }

            if (AssetData["assetId"] == null || AssetData["assetId"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "AssetId Provider is not provided."));
                return defer.promise;
            }
            if (AssetData["assetType"] == null || AssetData["assetType"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "AssetType Provider is not provided."));
                return defer.promise;
            }

            AssetData.lastModifieduser = user.email;
            let asset = new AssetModel(AssetData)
            var AuditLogHelper: AuditLog = AuditLog.instance();
            asset.save(async (err, res) => {
                if (err) {
                    GomosLogger.APILog(G.TRACE_DEBUG, "This is Asset create function for  failed data for = ", err);
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "create", 'This is Asset create  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, " Asset  failed to insert."));

                } else {
                    let temString = `assetId:${res.assetId}subCustCd:${res.subCustCd},name:${res.name}`
                    await AuditLogHelper.Log("Asset", res._id, temString, user.email, "create", res)
                    defer.resolve(new Message(Message.SUCCESS, " Asset sucessfully  created  .", res));
                }
            })
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "create", '[Asset bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Asset  create", error));
        }
        return defer.promise;
    }
    getById(Asset_id: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            if (Asset_id == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Asset id should not be empty."));
                return defer.promise;
            }
            user.getAssetsList().then((result) => {
                let assetList = result.getMessageData();
                if (assetList.includes(Asset_id)) {
                    return AssetModel.findOne({ _id: Asset_id })
                } else {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[Asset  bs-Logic] - ', user.email, `Insufficient access - user does not have access for Asset_Id : ${Asset_id}`, G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
                    defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
                }

            }).then((asset: IAsset) => {
                if (asset == null) {
                    defer.reject(new Message(Message.NOT_FOUND, "Asset with id does not exists."));
                } else {
                    defer.resolve(new Message(Message.SUCCESS, "Asset found.", asset));
                }
            }).catch(err => {
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to to find Asset", err));
            })
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[Asset bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Asset  getById", error));
        }

        return defer.promise;
    }


    update(asset: IAsset, AssetData: any, id: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            var me = this;
            GomosLogger.APILog(G.TRACE_DEBUG, "This is Asset create function for insert data for = " + user.email, AssetData);
            if (AssetData["name"] == null || AssetData["name"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "Name is not provided."));
                return defer.promise;
            }
            if (AssetData["subCustCd"] == null || AssetData["subCustCd"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "sub customer code Code is not provided."));
                return defer.promise;
            }

            if (AssetData["assetId"] == null || AssetData["assetId"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "AssetId Provider is not provided."));
                return defer.promise;
            }
            if (AssetData["assetType"] == null || AssetData["assetType"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "AssetType Provider is not provided."));
                return defer.promise;
            }

            let tempObj: any = {};
            tempObj.name = AssetData.name;
            tempObj.assetId = AssetData.assetId;
            tempObj.subCustCd = AssetData.subCustCd;
            tempObj.subCustId = AssetData.subCustId;
            tempObj.assetType = AssetData.assetType;

            tempObj.lastModifieduser = user.email;
            var AuditLogHelper: AuditLog = AuditLog.instance();
            AssetModel.updateMany({ _id: id, updatedTime: new Date(AssetData.updatedTime) }, { "$set": tempObj }).then((res) => {
                //   console.log("this is true", res.nModified)
                if (res.nModified == 0) {
                    throw (new Error("Somethings going wrong in update function ."))
                } else {
                    return me.getById(id, user);
                }
            }).then(async (result: Message) => {
                let temString = `assetId:${tempObj.assetId}subCustCd:${tempObj.subCustCd},name:${tempObj.name}`
                await AuditLogHelper.Log("Asset", id, temString, user.email, "update", asset)
                defer.resolve(new Message(Message.SUCCESS, "Asset Updated successfully.", result.getMessageData()));
            }).catch(err => {
                // console.log("this is false", err)
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", 'This is Asset  update  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to update update", asset));
            });
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", '[Asset bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Asset  updare", error));
        }

        return defer.promise;

    }
    delete(asset: IAsset, user: IUser) {
        var defer = q.defer<Message>();
        try {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is Asset delete function for delete data for = " + user.email, asset);
            if (asset == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "Asset should not be null."));
                return defer.promise;
            }
            var AuditLogHelper: AuditLog = AuditLog.instance();
            asset.delete().then(async (res) => {
                let temString = `assetId:${res.assetId}name:${res.name}`
                await AuditLogHelper.Log("Asset", res.id, temString, user.email, "delete", res)

                defer.resolve(new Message(Message.SUCCESS, "Asset removed successfully."));
            }).catch(err => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", 'This is Asset  delete  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to remove Asset", asset));
            });
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", '[Asset bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to Asset  delete", error));
        }

        return defer.promise;
    }


}