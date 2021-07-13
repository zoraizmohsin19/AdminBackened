import {IController} from "./IController";
import {Request,Response} from "express";

import Message from "../core/Util/Message";
import * as env from "../../config/env.json";
import { Types } from "mongoose";
import { stringify } from "querystring";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from "bcrypt";
import  DashboardConfig from '../core/BusinessLogic/DashboardConfig';
import G from '../core/Util/commanUtill/gConstant'
import GomosLogger from '../core/Util/commanUtill/GomosLogger';
export default class DashBoardConfigeController implements IController{
   
    constructor(){
    
                
    }
    index(request: Request, response: Response): void {
       
        throw new Error("Method not implemented.");
        }

    
    store(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
    }
    show(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
    }
    update(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
    }
    delete(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
    }
    
 
}