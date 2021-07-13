import { Document,Types} from "mongoose";
import { SoftDelete } from "../SoftDelete";


interface IServiceScheduleBase {

}

export interface IServiceSchedule extends IServiceScheduleBase, Document,SoftDelete {
 //   authenticate(password:string):Promise<any>;
}