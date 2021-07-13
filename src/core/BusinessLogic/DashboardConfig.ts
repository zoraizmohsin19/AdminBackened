import * as q from "q";
import { DashboardConfig as DashboardConfigModel } from '../Models/DashboardConfig';
import Message from "../Util/Message";
import Validation from "../Util/Validation";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import * as env from "../../../config/env.json";
import {Types, PaginateResult} from "mongoose"

import * as moment from "moment";
const saltRounds = 10;
import * as CryptoJS from  "crypto-js";
import { IDashboardConfig } from '../Models/DashboardConfig/IDashboardConfig';

 

export default class DashboardConfig{

     private static $_instance:DashboardConfig      =   null;

    private constructor(){
    }
    public static instance(){
        if(DashboardConfig.$_instance == null){
            DashboardConfig.$_instance = new DashboardConfig
        }
        return DashboardConfig.$_instance;
    }
}