import { Document, Types } from "mongoose";
import { SoftDelete } from "../SoftDelete";


interface IDashboardConfigBase {

    dashboardConfigId: string;
    ActiveSpCd: string;
    ActiveCustCd: string;
    ActiveSubCustCd: string;
    Assets: object;
    ActiveAssets: string;
    Devices: object;
    ActiveDeviceName: string;
    ActiveMac: string;
    SensorsBgC: object;
    Nevigation: string;
    ActiveDashBoardEnable: boolean;
    OpratingDashBoardEnable: boolean;
    createdTime: Date;
    updatedTime: Date;
}

export interface IDashboardConfig extends IDashboardConfigBase, Document, SoftDelete {
    //   authenticate(password:string):Promise<any>;
}