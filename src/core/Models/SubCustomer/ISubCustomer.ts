import { Document,Types} from "mongoose";
import { SoftDelete } from "../SoftDelete";
import { IServiceProvider } from '../ServiceProvider/IServiceProvider';
import { ICustomer } from '../Customer/ICustomer';


interface ISubCustomerBase {
    name:string;
    subCustCd: string;
    custCd: string;
    custId: Types.ObjectId| ICustomer;
    spCd: string;
    spId: Types.ObjectId|IServiceProvider;
    address: Object;
    phone: string;
    email: string;
    servicesTaken: object;
    createdTime: Date;
    updatedTime: Date;
 
}

export interface ISubCustomer extends ISubCustomerBase, Document,SoftDelete {
 //   authenticate(password:string):Promise<any>;
}