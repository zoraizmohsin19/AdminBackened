import { Document,Types} from "mongoose";
import { SoftDelete } from "../SoftDelete";



interface IUsersRolesBase {
  
    createdTime: Date;
    updatedTime: Date;
 
}

export interface IUserRoles extends IUsersRolesBase, Document,SoftDelete {
 //   authenticate(password:string):Promise<any>;
}