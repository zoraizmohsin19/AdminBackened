import { Document,Types} from "mongoose";
import { SoftDelete } from "../SoftDelete";


interface IServiceProviderBase {
    name: string,
    "spCd": string,
    "address": string,
    "phone": string,
    "email": string,
    "mqttClient": string,
    "servicesOffered": string,
    "SubTopic": string,
    "PubTopic": string,
    "active": string
 
}

export interface IServiceProvider extends IServiceProviderBase, Document,SoftDelete {
 //   authenticate(password:string):Promise<any>;
}