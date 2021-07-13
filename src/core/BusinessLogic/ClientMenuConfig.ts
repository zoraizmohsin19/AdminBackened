import * as q from "q";
import { ClientMenuConfig as ClientMenuConfigModel } from '../Models/ClientMenuConfig';
import Message from "../Util/Message";
import Validation from "../Util/Validation";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import * as env from "../../../config/env.json";
import {Types, PaginateResult} from "mongoose"

import * as moment from "moment";
const saltRounds = 10;
import * as CryptoJS from  "crypto-js";
import { IClientMenuConfig } from '../Models/ClientMenuConfig/IClientMenuConfig';

 

export default class ClientMenuConfig{

     private static $_instance:ClientMenuConfig      =   null;

    private constructor(){
    }
    public static instance(){
        if(ClientMenuConfig.$_instance == null){
            ClientMenuConfig.$_instance = new ClientMenuConfig
        }
        return ClientMenuConfig.$_instance;
    }
}