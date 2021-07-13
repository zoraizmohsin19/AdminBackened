import { Document, Types } from "mongoose";
import { SoftDelete } from "../SoftDelete";


interface IDeviceStateBase {

    DeviceName: string,
    mac: string,
    sensors: object,
    channel: object,
    createdTime: string,
    updateTime: string,
}

export interface IDeviceState extends IDeviceStateBase, Document, SoftDelete {

}