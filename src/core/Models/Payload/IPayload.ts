import { Document, Types } from "mongoose";
import { SoftDelete } from "../SoftDelete";


interface IPayloadBase {
    payloadId: string;
    mac: string;
    processByFact: string;
    AckProcess: string;
    processByState: string;
    processByActiveJobs: string;
    processByInstructionError: string;
    originatedFrom: string;
    formStructure: string;
    sensors: object;
    processByDeviceUpTime: string;
    createdTime: Date;
    updatedTime: Date;

}

export interface IPayload extends IPayloadBase, Document, SoftDelete {
    //   authenticate(password:string):Promise<any>;
}