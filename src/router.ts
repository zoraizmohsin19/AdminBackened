/*
 |-------------------------------------------------------------------
 |  router.ts - Defination of rountes goes here
 |-------------------------------------------------------------------
 */
import { Application, Request, Response } from 'express';
import Controller from "./controllers";
import AuthMiddleware from "./core/Middleware/AuthMiddleware"
// import controllers from './controllers';
import * as env from "../config/env.json";

export class Router {

    private application: Application;
    private loggerHepler = null;
    //Constructor For applicatin
    constructor(app: Application) {
     
     
        // console.log("this is UtilityFn", g)
        // let helper = CreateLogger.getConsoleLogger("platForm221", "1");
        // console.log("this is helper", helper)

        // UtilityFn.gomosLog(helper, g.TRACE_DEBUG, "this data which comming from client");
        this.application = app;
    }

    //Association of rounters goes here
    public associate() {
        //Defination of routes will go here 
        this.application.get("/organization", AuthMiddleware, Controller.OrganizationController.index);
        this.application.get("/organization/platform", AuthMiddleware, Controller.OrganizationController.platform);

        this.application.post('/user/authenticate', Controller.UserController.authenticate);
        this.application.get('/user/me', AuthMiddleware, Controller.UserController.me);
        this.application.post("/user", AuthMiddleware, Controller.UserController.store);
        this.application.get("/user", AuthMiddleware, Controller.UserController.index);
        this.application.get('/user/:id', AuthMiddleware, Controller.UserController.show);
        this.application.put('/user/:id', AuthMiddleware, Controller.UserController.update);
        this.application.delete('/user/:id', AuthMiddleware, Controller.UserController.delete);

        this.application.get("/userroles", AuthMiddleware, Controller.UsersRolesController.index);

        this.application.get('/serviceprovider', AuthMiddleware, Controller.ServiceProviderController.index);

        this.application.get('/customer', AuthMiddleware, Controller.CustomerController.index);
        // this.application.get('/customer/spId', AuthMiddleware, Controller.CustomerController.byspId);
        this.application.post('/customer', AuthMiddleware, Controller.CustomerController.store);
        this.application.delete('/customer/:id', AuthMiddleware, Controller.CustomerController.delete);
        this.application.get('/customer/:id', AuthMiddleware, Controller.CustomerController.show);
        this.application.put('/customer/:id', AuthMiddleware, Controller.CustomerController.update);
      


        this.application.get('/subcustomer', AuthMiddleware, Controller.SubCustomerController.index);
        // this.application.get('/subcustomer/custId', AuthMiddleware, Controller.SubCustomerController.bycustId);
        this.application.post('/subcustomer', AuthMiddleware, Controller.SubCustomerController.store);
        this.application.delete('/subcustomer/:id', AuthMiddleware, Controller.SubCustomerController.delete);
        this.application.get('/subcustomer/:id', AuthMiddleware, Controller.SubCustomerController.show);
        this.application.put('/subcustomer/:id', AuthMiddleware, Controller.SubCustomerController.update);
        
        this.application.get('/subcustomer/:subCustCd', Controller.SubCustomerController.showBysubCustCd);


        this.application.get('/asset', AuthMiddleware, Controller.AssetController.index);
        this.application.post('/asset', AuthMiddleware, Controller.AssetController.store);
        this.application.delete('/asset/:id', AuthMiddleware, Controller.AssetController.delete);
        this.application.get('/asset/:id', AuthMiddleware, Controller.AssetController.show);
        this.application.put('/asset/:id', AuthMiddleware, Controller.AssetController.update);
        this.application.get('/asset/:assetId/:subCustCd', Controller.AssetController.showByassetId);
        
        this.application.get('/device', AuthMiddleware, Controller.DeviceController.index);
        this.application.post('/device/subCustCd', AuthMiddleware, Controller.DeviceController.bySubCustCd);
        this.application.post('/device/store', Controller.DeviceController.store);
        this.application.get('/device/:mac', Controller.DeviceController.showBymac);
        this.application.get('/device/Id/:id', AuthMiddleware, Controller.DeviceController.show);
        this.application.put('/device/:id', AuthMiddleware, Controller.DeviceController.update);
        this.application.post('/device/subCustId', AuthMiddleware, Controller.DeviceController.bySubCustId);

        this.application.get('/alertConfig', AuthMiddleware, Controller.AlertConfigController.index);
        this.application.post('/alertConfig/leve1', AuthMiddleware, Controller.AlertConfigController.storeLevel1);
        this.application.delete('/alertConfig/:id', AuthMiddleware, Controller.AlertConfigController.delete);
        this.application.get('/alertConfig/:id', AuthMiddleware, Controller.AlertConfigController.show);
        this.application.put('/alertConfig/:id', AuthMiddleware, Controller.AlertConfigController.update);

        this.application.post('/payload/store', Controller.PayloadController.store);
        this.application.get('/payload', AuthMiddleware, Controller.PayloadController.index);

        this.application.get('/devicetemplate', AuthMiddleware,Controller.DeviceTemplateControlller.index);
        this.application.post('/device/storeByTemplate',AuthMiddleware, Controller.DeviceController.storeByDeviceTemplate);



    }
}
