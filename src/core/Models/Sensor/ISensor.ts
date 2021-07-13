import { Document,Types} from "mongoose";
import { SoftDelete } from "../SoftDelete";


interface ISensorBase {
    spCd: string,
    subCustCd:string,
    custCd:string,
    sensorNm: string,
    operations: object,
    createdTime: Date,
    updatedTime: Date
 
}

export interface ISensor extends ISensorBase, Document,SoftDelete {
 //   authenticate(password:string):Promise<any>;
}