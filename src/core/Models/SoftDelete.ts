import { PaginateModel,Document} from "mongoose";

export interface SoftDelete {
        delete():Promise<any>;
}