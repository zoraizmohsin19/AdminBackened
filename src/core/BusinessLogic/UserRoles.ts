import * as q from "q";
import Message from "../Util/Message";
import Validation from "../Util/Validation";
import * as env from "../../../config/env.json";
import { Types, PaginateResult } from "mongoose"

import * as moment from "moment";
import AuditLog from "./AuditLog";
import G from "../Util/commanUtill/gConstant";
import ServiceProvider from "./ServiceProvider";
import { IUser } from "../Models/User/IUser";
import { UserRoles as UserRolesModel } from "../Models/UserRoles";
import { IUserRoles } from '../Models/UserRoles/IUserRoles';
import GomosLogger from "../Util/commanUtill/GomosLogger";

export default class UserRoles {

    private static $_instance: UserRoles = null;

    private constructor() {
        // console.log("this is called", userDetails)
    }
    public static instance() {
        if (UserRoles.$_instance == null) {
            UserRoles.$_instance = new UserRoles
        }
        return UserRoles.$_instance;
    }

    fetchAll(user: IUser) {
        var defer = q.defer<Message>();
        try {
               var query: any = {};
                    query['deleted'] = false;
 UserRolesModel.find(query)
    .then((result: IUserRoles[]) => {
                defer.resolve(new Message(Message.SUCCESS, "UserRoles fetched.", result));
            }).catch(err => {
                GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAll", '[UserRoles  bs-Logic] - ', user.email, err, G.ERROR_DATABASE, G.ERROR_TRUE, G.EXIT_FALSE);
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to fetchAll by user."));
            })
        } catch (error) {
            GomosLogger.errorCustmHandler(env["SERVICE_NAME"], "fetchAll", '[UserRoles  bs-Logic] - ', user.email, error, G.ERROR_RUNTIME, G.ERROR_TRUE, G.EXIT_FALSE);
            defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to UserRoles  fetchAll", error));
        }
        return defer.promise;
    }
    fetchdata() {
        var defer = q.defer<Message>();
        defer.resolve(new Message(Message.SUCCESS, "UserRoles fetchdata  not defined yet"));
        return defer.promise;
    }
   
}