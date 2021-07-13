import * as q from "q";
import { UserRole, IUser } from '../Models/User/IUser';
import { User as UserModel } from "../Models/User";
import { Organization as OrganizationModel  } from "../Models/Organization";
import Message from "../Util/Message";
import Validation from "../Util/Validation";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import * as env from "../../../config/env.json";
import { Types, PaginateResult } from "mongoose"
import G from '../Util/commanUtill/gConstant';
import GomosLogger from '../Util/commanUtill/GomosLogger';

// import Mail from "../Util/Mail";
import * as moment from "moment";
const saltRounds = 10;
import * as CryptoJS from "crypto-js";
import AuditLog from "./AuditLog";


export default class User {

    private static $_instance: User = null;

    private constructor() {
    }

    public static instance() {
        if (User.$_instance == null) {
            User.$_instance = new User
        }
        return User.$_instance;
    }
    fetchAll(user: IUser) {
        var defer = q.defer<Message>();

        let query: any = {};
        // if(search_string.trim().length != 0){
        query = {
        };
        // }
        return defer.promise;
    }

    delete(UserData: IUser, user: IUser) {
        var defer = q.defer<Message>();
        try{
        GomosLogger.APILog(G.TRACE_DEBUG, "This is User delete function for delete data for = " + user.email, UserData);
        if (UserData == null) {
            defer.reject(new Message(Message.INVALID_PARAM, "User should not be null."));
            return defer.promise;
        }
        var AuditLogHelper: AuditLog = AuditLog.instance();
        UserData.delete().then(async (res) => {
            let temString = `spCd:${res.spCd},custCd:${res.custCd},name:${res.name}`
            await AuditLogHelper.Log("User", res.id, temString, user.email, "delete", res)

            defer.resolve(new Message(Message.SUCCESS, "User removed successfully."));
        }).catch(err => {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", 'This is User  delete  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to remove User", UserData));
        });
    } catch (error) {
        GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "delete", '[User  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
        defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to User  delete", error));
    }
        return defer.promise;
    }

    fetchdata(organizationId,search_string: string, page: number, page_size: number, user: IUser) {
        var defer = q.defer<Message>();
    let OrganizationIntance = new OrganizationModel();
    var ListOrgDataList = []
    OrganizationIntance.getUserOrganizationIdBasedList(user).then(result => {
            var query = {};
           ListOrgDataList = result.getMessageData();
           let listOrg = ListOrgDataList.map(item => item._id);
           if (listOrg.length >= 0) {
               console.log("listOrg", listOrg)
            // query["organizationId"] = { "$in": listOrg }

            if (search_string.trim().length != 0) {
                query["$or"] = [
                    {"userFN":{
                    '$regex': '.*' + search_string + '.*',
                    '$options': 'i'
                    }}, 
                   { "userLN": {
                        '$regex': '.*' + search_string + '.*',
                        '$options': 'i'
                        }
                    }
                    ]
            };

            if (organizationId.length > 0) {
                let tempId = organizationId.split(",")

                query["organizationId"] = {
                    '$in': tempId,
                };
            }
            query["deleted"] = false;
            return  UserModel.paginate(query, {
                page: page,
                limit: page_size,
        })

        }
        else {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", '[User  bs-Logic] - ', user.email, "Insufficient access -    Organization returned empty", G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
        }
        }).then((result) => {
            
            var  resultCopy = JSON.parse(JSON.stringify(result))
             for(let i =0 ; i< resultCopy["docs"].length ; i++){
                
              let organizationIdObj = ListOrgDataList.find(item => item._id.equals(resultCopy["docs"][i]["organizationId"]));
             if( organizationIdObj != undefined){
                resultCopy["docs"][i]["organizationId"] = organizationIdObj;
              }
             }
            defer.resolve(new Message(Message.SUCCESS, "User fetched.", resultCopy));
        })
            .catch(error => {
                console.log("This is user fetch errp", error)
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetch", 'This is User  fetch  error ', user.email, error, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetch User."));
            })
        return defer.promise;
    }
    getById(User_Id: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            if (User_Id == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User id should not be empty."));
                return defer.promise;
            }
            // user.getAssetsList().then((result) => {
            //     let assetList = result.getMessageData();
            //     if (assetList.includes(User_Id)) {
            //         return UserModel.findOne({ _id: User_Id })
            //     } else {
            //         GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[User  bs-Logic] - ', user.email, `Insufficient access - user does not have access for User_Id : ${User_Id}`, G.ERROR_APPLICATION, G.ERROR_FALSE, G.EXIT_FALSE);
            //         defer.reject(new Message(Message.INTERNAL_ERROR, "Insufficient access"));
            //     }

            // })
            UserModel.findOne({ _id: User_Id })
             .then((user: IUser) => {
                if (user == null) {
                    defer.reject(new Message(Message.NOT_FOUND, "User with id does not exists."));
                } else {
                    defer.resolve(new Message(Message.SUCCESS, "User found.", user));
                }
            }).catch(err => {
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to to find user", err));
            })
        }
        catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "getById", '[User bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to User  getById", error));
        }

        return defer.promise;
    }
    //Method is used to authenticate the user
    authenticate(email: string, password: string, role: UserRole = UserRole.GENERAL) {
        var defer = q.defer();
        GomosLogger.APILog(G.TRACE_DEBUG, `This is User  authenticate  ${email} : ${password} : ${role}  `);

        if (email == null || email.trim().length == 0) {
            defer.reject(new Message(Message.INVALID_PARAM, "Email is not provided."));
            return defer.promise;
        }

        if (password == null || password.length == 0) {
            defer.reject(new Message(Message.INVALID_PARAM, "Password is not provided."));
            return defer.promise;
        }

        var check_email = email;
        // if(email.indexOf("@") == -1){
        //     check_email     =   email+"@hdfcergo.com";
        // }
        //   UserModel
        UserModel.findOne({
            email: check_email,
            deleted: false
        }).then((user) => {
            if (user == null) {
                defer.reject(new Message(Message.AUTH_FAILED, "Invalid Credential."));
            } else {
                //  console.log("this is Called",user);

                //  defer.resolve(user)
                var promise = new Promise<Boolean>((resolve, reject) => {
                    // if(role == UserRole.ADMIN){
                    // if(user.role == UserRole.ADMIN){
                    //     resolve(true);
                    // } else {
                    //     var userChannelHelper:UserChannel     =     UserChannel.instance();
                    //     userChannelHelper.fetchChannelForUserId(user._id).then((result:Message)=>{
                    //         var results     =   result.getMessageData();
                    //         if(results.length > 0){
                    //             resolve(true);
                    //         } else {
                    //             resolve(false);
                    //         }
                    //     }).catch(err=>{
                    //         resolve(false);
                    //     })
                    // }
                    // } else {
                    resolve(true);
                    // }
                });


                promise.then(has_access => {
                    if (has_access) {
                        var current_time = (new Date()).getTime();
                        var is_locked = false;
                        if (user.locked_till != undefined) {
                            if (current_time < moment(user.locked_till).toDate().getTime()) {
                                is_locked = true;
                            }
                        }
                        if (is_locked) {
                            defer.reject(new Message(Message.AUTH_FAILED, "Your account is locked due to continuos failed attempts. It will unlocked in " + moment(user.locked_till).diff(moment(), 'minutes') + " minutes."));
                        } else {

                            var dechiper = CryptoJS.AES.decrypt(password, email);
                            var dec_password = dechiper.toString(CryptoJS.enc.Utf8);
                            return user.authenticate(dec_password);
                        }
                    } else {
                        defer.reject(new Message(Message.AUTH_FAILED, "Unautherized to login"));
                    }
                }).then(result => {
                    defer.resolve(result)
                }).catch(err => {
                    GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "authenticate", 'This is Usrer  authenticate  error ', email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                    defer.reject(err);
                });
            }
        });
        return defer.promise;
    }
    create(userData, user) {
        var defer = q.defer<Message>();
        try {
            GomosLogger.APILog(G.TRACE_DEBUG, "This is user create function for insert data for = " + user.email, userData);
            if (userData['organizationId'] == null || userData["organizationId"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User organizationId  is not provided."));
                return defer.promise;
            }
            if (userData['userFN'] == null || userData["userFN"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User userFN  is not provided."));
                return defer.promise;
            }

            if (userData['userLN'] == null || userData["userLN"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User userFN  is not provided."));
                return defer.promise;
            }
            const validator = Validation.getInstance();
            if (!validator.validateEmail(userData["email"])) {
                defer.reject(new Message(Message.INVALID_PARAM, "Email provided is invalid."));
                return defer.promise;
            }

            if (userData['phone'] == null || userData["phone"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User Phone  is not provided."));
                return defer.promise;
            }

            if (userData['userId'] == null || userData["userId"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User userId  is not provided."));
                return defer.promise;
            }

            if (userData['password'] == null || userData["password"].trim().length == 0 || !validator.validatePassword(userData["password"])) {
                defer.reject(new Message(Message.INVALID_PARAM, "User password  is not provided."));
                return defer.promise;
            }
            if (userData['userEntity'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User userEntity  is not provided."));
                return defer.promise;
            }
            if (userData['spFlag'] == null || userData["spFlag"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User spFlag  is not provided."));
                return defer.promise;
            }

            if (userData['spCds'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User spCds  is not provided."));
                return defer.promise;
            }
            if (userData['custFlag'] == null || userData["custFlag"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User custFlag  is not provided."));
                return defer.promise;
            }
            if (userData['custCds'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User custCds  is not provided."));
                return defer.promise;
            }

            if (userData['subCustFlag'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User subCustFlag  is not provided."));
                return defer.promise;
            }

            if (userData['subCustCds'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User subCustCds  is not provided."));
                return defer.promise;
            }

            if (userData['assetFlag'] == null || userData["assetFlag"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User assetFlag  is not provided."));
                return defer.promise;
            }

            if (userData['Assets'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User Assets  is not provided."));
                return defer.promise;
            }

            if (userData['deviceFlag'] == null || userData["deviceFlag"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User deviceFlag  is not provided."));
                return defer.promise;
            }

            if (userData['Devices'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User Device  is not provided."));
                return defer.promise;
            }

            let pwdhass = bcrypt.hashSync(userData["password"], saltRounds);
            userData["password"] = pwdhass;
            let userMInsTance = new UserModel(userData)
            var AuditLogHelper: AuditLog = AuditLog.instance();
            UserModel.find({ email: userData["email"] }).then((res: IUser[]) => {
                if (res.length != 0) {
                    defer.reject(new Message(Message.ALREADY_EXISTS, "User with email already exists."));
                } else {
                    userMInsTance.save(async (err, res) => {
                        if (err) {
                            GomosLogger.APILog(G.TRACE_DEBUG, "This is User create function for  failed data for = ", err);
                            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "create", 'This is User create  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                            defer.reject(new Message(Message.INTERNAL_ERROR, " user  failed to insert."));
                        } else {
                            let temString = `userFN:${res.userFN}email:${res.email}`
                            await AuditLogHelper.Log("SubCustomers", res._id, temString, user.email, "create", userData)
                            defer.resolve(new Message(Message.SUCCESS, "User sucessfully  created  .", res));
                        }
                    })
                }
            })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "create", '[User  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to User  create", error));
        }
        return defer.promise;
    }
    update(userOld: IUser, userData: any, id: Types.ObjectId, user: IUser) {
        var defer = q.defer<Message>();
        try {
            var me = this;
            GomosLogger.APILog(G.TRACE_DEBUG, "This is user update function for insert data for = " + user.email, userData);
            if (userData['organizationId'] == null || userData["organizationId"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User organizationId  is not provided."));
                return defer.promise;
            }
            if (userData['userFN'] == null || userData["userFN"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User userFN  is not provided."));
                return defer.promise;
            }

            if (userData['userLN'] == null || userData["userLN"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User userFN  is not provided."));
                return defer.promise;
            }
            const validator = Validation.getInstance();
            if (!validator.validateEmail(userData["email"])) {
                defer.reject(new Message(Message.INVALID_PARAM, "Email provided is invalid."));
                return defer.promise;
            }

            if (userData['phone'] == null || userData["phone"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User Phone  is not provided."));
                return defer.promise;
            }

            if (userData['userId'] == null || userData["userId"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User userId  is not provided."));
                return defer.promise;
            }

            if (userData['password'] == null ) {
                userData['password'] = userOld["password"]
            }else if( !validator.validatePassword(userData["password"])){
                defer.reject(new Message(Message.INVALID_PARAM, "User password  is not Valid."));
                return defer.promise;
            }else {
                let pwdhass = bcrypt.hashSync(userData["password"], saltRounds);
                userData["password"] = pwdhass;
            }
            if (userData['userEntity'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User userEntity  is not provided."));
                return defer.promise;
            }
            if (userData['spFlag'] == null || userData["spFlag"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User spFlag  is not provided."));
                return defer.promise;
            }

            if (userData['spCds'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User spCds  is not provided."));
                return defer.promise;
            }
            if (userData['custFlag'] == null || userData["custFlag"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User custFlag  is not provided."));
                return defer.promise;
            }
            if (userData['custCds'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User custCds  is not provided."));
                return defer.promise;
            }

            if (userData['subCustFlag'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User subCustFlag  is not provided."));
                return defer.promise;
            }

            if (userData['subCustCds'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User subCustCds  is not provided."));
                return defer.promise;
            }

            if (userData['assetFlag'] == null || userData["assetFlag"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User assetFlag  is not provided."));
                return defer.promise;
            }

            if (userData['Assets'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User Assets  is not provided."));
                return defer.promise;
            }

            if (userData['deviceFlag'] == null || userData["deviceFlag"].trim().length == 0) {
                defer.reject(new Message(Message.INVALID_PARAM, "User deviceFlag  is not provided."));
                return defer.promise;
            }

            if (userData['Devices'] == null) {
                defer.reject(new Message(Message.INVALID_PARAM, "User Device  is not provided."));
                return defer.promise;
            }

        

            let tempObj: any = {};
            tempObj.organizationId = userData['organizationId'];
            tempObj.userFN = userData['userFN'];
            tempObj.userLN = userData['userLN'];
            tempObj.email = userData['email'];
            tempObj.phone = userData['phone'];
            tempObj.userId = userData['userId'];
            tempObj.password = userData['password'];
            tempObj.userEntity = userData['userEntity'];
            tempObj.spFlag = userData['spFlag'];
            tempObj.spCds = userData['spCds'];
            tempObj.custFlag = userData['custFlag'];
            tempObj.custCds = userData['custCds'];
            tempObj.subCustFlag = userData['subCustFlag'];
            tempObj.subCustCds = userData['subCustCds'];
            tempObj.assetFlag = userData['assetFlag'];
            tempObj.Assets = userData['Assets'];
            tempObj.deviceFlag = userData['deviceFlag'];
            tempObj.Devices = userData['Devices'];
             tempObj.userRoles = userData['userRoles'];
             tempObj.pwdSent = userData['pwdSent'];
            tempObj.updatedTime = userData['updatedTime'];
            // tempObj.deviceFlag = userData['deviceFlag'];

            GomosLogger.APILog(G.TRACE_DEBUG, "This is user update function for update data for = " + user.email, userData);
            tempObj.lastModifieduser = user.email;
            var AuditLogHelper: AuditLog = AuditLog.instance();
            
            UserModel.updateOne({ _id: id, updatedTime: new Date(userData.updatedTime) }, { "$set": tempObj }).then((res) => {
                //   console.log("this is true", res.nModified)
                if (res.nModified == 0) {
                    throw (new Error("Somethings going wrong in update function ."))
                } else {
                    return me.getById(id, user);
                }
            }).then(async (result: Message) => {
                let temString = `userEmail:${tempObj.email}phone:${tempObj.phone}`
                await AuditLogHelper.Log("User", id, temString, user.email, "update", userData)
                defer.resolve(new Message(Message.SUCCESS, "User Updated successfully.", result.getMessageData()));
            }).catch(err => {
                // console.log("this is false", err)
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", 'This is USer  update  error ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to update update", userData));
            });
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "update", '[User bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to User  update", error));
        }

        return defer.promise;

    }
    isAdminRole(email: string) {
        var defer = q.defer();

        if (email == null || email.trim().length == 0) {
            defer.resolve(new Message(Message.INVALID_PARAM, "Email is not provided.", false));
            return defer.promise;
        }

        UserModel.findOne({
            email: email
        }).then((user: IUser) => {
            if (user == null) {
                defer.resolve(new Message(Message.SUCCESS, "Invalid user.", false));
            } else {
                defer.resolve(new Message(Message.SUCCESS, "ADMIN", true));
                // if(user.role == UserRole.ADMIN){
                //     defer.resolve(new Message(Message.SUCCESS,"ADMIN",true));
                // } else {
                //     var userChannelHelper:UserChannel     =     UserChannel.instance();
                //     userChannelHelper.fetchChannelForUserId(user._id).then((result:Message)=>{
                //         var results     =   result.getMessageData();
                //         if(results.length > 0){
                //             defer.resolve(new Message(Message.SUCCESS,"ADMIN",true));
                //         } else {
                //             defer.resolve(new Message(Message.SUCCESS,"User",false));
                //         }
                //     }).catch(err=>{
                //         defer.resolve(new Message(Message.SUCCESS,"User",false));
                //     })
                // }
            }
        });
        return defer.promise;
    }

    getUserFromToken(token: string) {
        var defer = q.defer();

        jwt.verify(token, env['SECRET'], function (error, decoded) {
            if (error != null) {
                var err = new Message(Message.INVALID_PARAM, "Invalid token", error);
                defer.reject(err);
            } else {
                //  console.log(decoded.user_id);
                UserModel.findOne({
                    "_id": new Types.ObjectId(decoded.user_id)
                }).populate({ path: 'userRoles' }).then((user: IUser) => {
                    //   console.log(user);
                    if (user == null) {
                        var err = new Message(Message.INVALID_PARAM, "Invalid token");
                        defer.reject(err);
                    } else {
                        defer.resolve(new Message(Message.SUCCESS, "Valid token", user));
                    }
                })
            }
        });
        return defer.promise;
    }



}
