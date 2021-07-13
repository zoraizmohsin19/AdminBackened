import * as q from "q";
import {Sensor as SensorModel} from "../Models/Sensor";
import Message from "../Util/Message";
import Validation from "../Util/Validation";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import * as env from "../../../config/env.json";
import {Types, PaginateResult} from "mongoose"

import * as moment from "moment";
const saltRounds = 10;
import * as CryptoJS from  "crypto-js";
import { ISensor } from '../Models/Sensor/ISensor';

 

export default class Sensor{

     private static $_instance:Sensor      =   null;

    private constructor(){
    }
    public static instance(){
        if(Sensor.$_instance == null){
            Sensor.$_instance = new Sensor
        }
        return Sensor.$_instance;
    }
}