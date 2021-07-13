import { Document,Types} from "mongoose";
import { SoftDelete } from "../SoftDelete";
import { IUser } from '../User/IUser';

interface IOrganizationBase {
    organizationId:Types.ObjectId
    name: String;
    createdTime: Date;
    updatedTime: Date;
 
}

export interface IOrganization extends IOrganizationBase, Document,SoftDelete {

    getUserOrganizationIdBasedList(user: IUser):Promise<any>;
}