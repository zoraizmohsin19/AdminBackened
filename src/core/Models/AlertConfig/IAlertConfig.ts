import { Document,Types} from "mongoose";
import { SoftDelete } from "../SoftDelete";
import { ISubCustomer } from '../SubCustomer/ISubCustomer';


interface IAlertConfigBase {
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
    createdTime: Date;
    updatedTime: Date;
 
}

export interface IAlertConfig extends IAlertConfigBase, Document,SoftDelete {
 //   authenticate(password:string):Promise<any>;
}