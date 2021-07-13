import { Document, Types } from "mongoose";
import { SoftDelete } from "../SoftDelete";


interface IDeviceTemplateBase {
   name: string,
   deviceSetup: object,
   payloadSetup: object[],
    createdTime: Date;
    updatedTime: Date;

}

export interface IDeviceTemplate extends IDeviceTemplateBase, Document, SoftDelete {
}