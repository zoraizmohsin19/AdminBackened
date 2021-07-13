import { Document, Types } from "mongoose";
import { SoftDelete } from "../SoftDelete";


interface ICustomerBase {
    name: string,
    custCd: string,
    spCd: string,
    address: object,
    phone: string,
    email: string,
    servicesTaken: object,
    mqttClient: string,
    description: string,
    active: boolean,
    urlToSend: string,
    SubTopic: string,
    PubTopic: string,
    lastModifieduser:string,

}

export interface ICustomer extends ICustomerBase, Document, SoftDelete {
    //   authenticate(password:string):Promise<any>;
}