import { PaginateModel,Document} from "mongoose";

export interface IPaginatedModel<T extends Document> extends PaginateModel<T> {
   
    
}