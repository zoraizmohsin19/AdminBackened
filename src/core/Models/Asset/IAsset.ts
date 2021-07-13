import { Document,Types} from "mongoose";
import { SoftDelete } from "../SoftDelete";
import { ISubCustomer } from "../SubCustomer/ISubCustomer";


interface IAssetBase {
    name: string,
    subCustCd:string,
    subCustId:Types.ObjectId| ISubCustomer,
    assetId:string,
    assetType:string,
    createdTime: Date;
    updatedTime: Date;
 
}

export interface IAsset extends IAssetBase, Document,SoftDelete {
 //   authenticate(password:string):Promise<any>;
}