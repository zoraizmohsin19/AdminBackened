import { Document,Types} from "mongoose";
import { SoftDelete } from "../SoftDelete";
import { ISubCustomer } from '../SubCustomer/ISubCustomer';

export interface AlertConfigBody {
    name: string,
    spCd: string,
    custCd: string,
    subCustCd: string ,
    subCustId: Types.ObjectId| ISubCustomer,
    sensorNm: string,
    businessNm: string,
    configBNm: string,
    lastModifieduser:string,
    shortName:string,
    type:string,
    criteria:string,
    emailRecipientRole: object,
    alertText:string,
    alertTriggeredBy: string,
}
export interface DeviceBody{
    DeviceName: string;
    mac: string
}
interface IAuditLogBase {
    collectionName: String;
    collectionDocID : Types.ObjectId;
    collectionEntity :String;
    actionBy: String;
    action: String;
    alertsConfigBody?: AlertConfigBody;
    deviceBody?:DeviceBody;
    createdTime: Date;
    updatedTime: Date;
 
}

export interface IAuditLog extends IAuditLogBase, Document,SoftDelete {
 //   authenticate(password:string):Promise<any>;
}