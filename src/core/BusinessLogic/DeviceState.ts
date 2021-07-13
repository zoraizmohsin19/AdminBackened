import * as q from "q";
import {DeviceState as DeviceStateModel} from "../Models/DeviceState";
import Message from "../Util/Message";
import Validation from "../Util/Validation";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import * as env from "../../../config/env.json";
import {Types, PaginateResult} from "mongoose"

import * as moment from "moment";
const saltRounds = 10;
import * as CryptoJS from  "crypto-js";
import { IDeviceState } from '../Models/DeviceState/IDeviceState';

 

export default class DeviceState{

     private static $_instance:DeviceState      =   null;

    private constructor(){
    }
    public static instance(){
        if(DeviceState.$_instance == null){
            DeviceState.$_instance = new DeviceState
        }
        return DeviceState.$_instance;
    }
    getByDeviceName(DeviceName:string ) {
        var defer = q.defer<Message>();

        if (DeviceName == null) {
            defer.reject(new Message(Message.INVALID_PARAM, "DeviceName should not be empty."));
            return defer.promise;
        }

        DeviceStateModel.findOne({
            DeviceName: DeviceName
        })
            .then((DeviceState: IDeviceState) => {
                if (DeviceState == null) {
                    defer.reject(new Message(Message.NOT_FOUND, "DeviceState with id does not exists."));
                } else {
                    defer.resolve(new Message(Message.SUCCESS, "DeviceState found.", DeviceState));
                }
            }).catch(err => {
                defer.reject(new Message(Message.INTERNAL_ERROR, "Failed to to find DeviceState", err));
            })

        return defer.promise;
    }
    create(DeviceName: string, mac: string, sensors:object, channel:object) {
        var defer   =   q.defer<Message>();
        if(DeviceName == null || DeviceName.trim().length == 0){
            defer.reject(new Message(Message.INVALID_PARAM,"DeviceName is not provided."));
            return defer.promise;
        }
        
        if(mac == null || mac.trim().length == 0){
            defer.reject(new Message(Message.INVALID_PARAM,"Mac is not provided."));
            return defer.promise;
        }
        
        if(sensors == null ){
            defer.reject(new Message(Message.INVALID_PARAM,"Sensors is not provided."));
            return defer.promise;
        }
        if(channel == null ){
            defer.reject(new Message(Message.INVALID_PARAM,"Channel is not provided."));
            return defer.promise;
        }
        let now = new Date();
        var sensorsObj = {};
        var channelObj = {};
        let sensorKey  = Object.keys(sensors);
        if(sensorKey.length > 0){
            for(let i = 0; i < sensorKey.length; i++){
                let temp = {};
                temp[sensors[sensorKey[i]]["businessName"]] = '';
                temp["sortName"] = sensors[sensorKey[i]]["sortName"];
                temp["Type"] = sensors[sensorKey[i]]["Type"];
                temp["displayPosition"] = sensors[sensorKey[i]]["displayPosition"];
                temp["valueChangeAt"] = now;
                temp["dateTime"] = now;
                sensorsObj[sensorKey[i]] = temp;

            }
        }
        let channelkey  = Object.keys(channel);
        if(channelkey.length > 0){
            for(let j = 0; j < channelkey.length; j++){

                let temp = {};
                temp[channel[channelkey[j]]["businessName"]] = '';
                temp["sortName"] = channel[channelkey[j]]["sortName"];
                temp["Type"] = channel[channelkey[j]]["Type"];
                temp["displayPosition"] = channel[channelkey[j]]["displayPosition"];
                temp["valueChangeAt"] = now;
                temp["dateTime"] = now;
                channelObj[channelkey[j]] = temp;
            }
        }
      let   deviceStateM   = new DeviceStateModel;
     
      deviceStateM.DeviceName = DeviceName;
      deviceStateM.mac    = mac;
      deviceStateM.sensors  = sensorsObj;
      deviceStateM.channel  = channelObj;


      deviceStateM.save().then( result => {
        defer.resolve(new Message(Message.SUCCESS,"DeviceState Inserted.",result));

    }).catch( err => {
        defer.reject(new Message(Message.INTERNAL_ERROR,"Failed to DeviceState Inserted ."));

    })


        return defer.promise;
    }
    updateDeviceState(DeviceName: string, mac: string, sensors:object, channel:object, currentDevice:any) {
        var defer   =   q.defer<Message>();
        if(DeviceName == null || DeviceName.trim().length == 0){
            defer.reject(new Message(Message.INVALID_PARAM,"DeviceName is not provided."));
            return defer.promise;
        }
        
        if(mac == null || mac.trim().length == 0){
            defer.reject(new Message(Message.INVALID_PARAM,"Mac is not provided."));
            return defer.promise;
        }
        
        if(sensors == null ){
            defer.reject(new Message(Message.INVALID_PARAM,"Sensors is not provided."));
            return defer.promise;
        }
        if(channel == null ){
            defer.reject(new Message(Message.INVALID_PARAM,"Channel is not provided."));
            return defer.promise;
        }
         this.getByDeviceName(DeviceName).then((result1 ) => {
            var deviceState = result1.getMessageData();
        let now = new Date();
        var sensorsObj = {};
        var channelObj = {};
        let sensorKey  = Object.keys(sensors);
        if(sensorKey.length > 0){
            for(let i = 0; i < sensorKey.length; i++){
                let temp = {};
                temp[sensors[sensorKey[i]]["businessName"]] = deviceState.sensors[sensorKey[i]][currentDevice.sensors[sensorKey[i]]["businessName"]];
                temp["sortName"] = sensors[sensorKey[i]]["sortName"];
                temp["Type"] = sensors[sensorKey[i]]["Type"];
                temp["displayPosition"] = sensors[sensorKey[i]]["displayPosition"];
                temp["valueChangeAt"] = deviceState.sensors[sensorKey[i]].valueChangeAt;
                temp["dateTime"] = deviceState.sensors[sensorKey[i]].dateTime;
                sensorsObj[sensorKey[i]] = temp;

            }
        }
        let channelkey  = Object.keys(channel);
        if(channelkey.length > 0){
            for(let j = 0; j < channelkey.length; j++){

                let temp = {};
                temp[channel[channelkey[j]]["businessName"]] = deviceState.channel[channelkey[j]][currentDevice.channel[channelkey[j]]["businessName"]];
                temp["sortName"] = channel[channelkey[j]]["sortName"];
                temp["Type"] = channel[channelkey[j]]["Type"];
                temp["displayPosition"] = channel[channelkey[j]]["displayPosition"];
                temp["valueChangeAt"] = deviceState.channel[channelkey[j]].valueChangeAt;
                temp["dateTime"] = deviceState.channel[channelkey[j]].dateTime;
                channelObj[channelkey[j]] = temp;
            }
        }
      let   deviceStateM :any = {};
     
    //  deviceStateM.DeviceName = DeviceName;
    //  deviceStateM.mac    = mac;
      deviceStateM.sensors  = sensorsObj;
      deviceStateM.channel  = channelObj;


      DeviceStateModel.updateOne({ _id: deviceState._id }, { "$set": deviceStateM }).then( result => {
        defer.resolve(new Message(Message.SUCCESS,"DeviceState Updated.",result));

    }).catch( err => {
        defer.reject(new Message(Message.INTERNAL_ERROR,"Failed to DeviceState Updated ."));

    })
})
.catch( err => {
    defer.reject(new Message(Message.INTERNAL_ERROR,"Failed to DeviceState Updated ."));

})


        return defer.promise;
    }
    
}