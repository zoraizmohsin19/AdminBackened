import { Document,Types} from "mongoose";
import { SoftDelete } from "../SoftDelete";
import { IServiceProvider } from '../ServiceProvider/IServiceProvider';
import { ICustomer } from '../Customer/ICustomer';
import { ISubCustomer } from '../SubCustomer/ISubCustomer';
import { IAsset } from '../Asset/IAsset';
import { IDevice } from '../Device/IDevice';
import { IUserRoles } from '../UserRoles/IUserRoles';

export enum UserEntity {
    PLATFORM, SERVICE_PROVIDER,CLIENT,SUB_CUSTOMER
}
export enum UserRole {
    ADMIN,
    GENERAL
}



interface IUserBase {
    organizationId:Types.ObjectId | Object
    dashboardConfigId:string;
    clientID: string;
    userId: string;
    password: string;
    spCds: Types.ObjectId[] | IServiceProvider[] ;
    spFlag: string;
    custCds:Types.ObjectId[] | ICustomer[]  ;
    custFlag: string;
    subCustCds: Types.ObjectId[] | ISubCustomer[]; 
    subCustFlag:string;
    Assets: Types.ObjectId[] | IAsset[];
    assetFlag:string;
    Devices: Types.ObjectId[] | IDevice[];
    deviceFlag:string;
    userFN: string;
    userLN: string;
    devicePreference: Object;
    subscription:Object;
    phone: string;
    userEntity: UserEntity;
    userRoles: Types.ObjectId | IUserRoles;
    lastLoginAt: Date;
    failed_login: Number;
    locked_till: Date;
    pwdSent: boolean;
    email: string;
    status: string;
    createdTime: Date;
    updatedTime: Date;
 
}

export interface IUser extends IUserBase, Document,SoftDelete {
    authenticate(password:string):Promise<any>;
    getServiceProviderList():Promise<any>;
    getCustomerList():Promise<any>;
    getSubCustomerList():Promise<any>;
    getAssetsList():Promise<any>;
    getDeviceList():Promise<any>;
    // getUserOrganizationIdBasedList():Promise<any>;
}