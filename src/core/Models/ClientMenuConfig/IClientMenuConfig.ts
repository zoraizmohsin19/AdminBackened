import { Document,Types} from "mongoose";
import { SoftDelete } from "../SoftDelete";


interface IClientMenuConfigBase {
    clientID: string;
    viewDashBoard: string;
    activeDashBoard:object;
    createdTime: Date;
    updatedTime: Date;
 
}

export interface IClientMenuConfig extends IClientMenuConfigBase, Document,SoftDelete {
 //   authenticate(password:string):Promise<any>;
}