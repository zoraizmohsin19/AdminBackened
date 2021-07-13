import { Document,Types} from "mongoose";
import { SoftDelete } from "../SoftDelete";
import { ISubCustomer } from "../SubCustomer/ISubCustomer";
import { IAsset } from '../Asset/IAsset';


interface IDeviceBase {
    DeviceName: string;
    mac: string;
    assetId: string;
    asset_Id:Types.ObjectId| IAsset;
    deviceTemplate: string;
    roles: string;
    subCustCd: string;
    subCustId: Types.ObjectId|ISubCustomer;
    active: string;
    sensors:object;
    channel:object;
    defaultGroupInfo: string;
    deviceTypes: string;
    createdTime: Date;
    updatedTime: Date;
}


export interface IDevice extends IDeviceBase, Document,SoftDelete {
}