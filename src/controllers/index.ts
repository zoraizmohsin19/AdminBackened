import UserController from "./UserController";
import SubCustomerController from './SubCustomerController';
import DeviceController from "./DeviceController";
import AlertConfigController from './AlertConfigController';
import AssetController from './AssetController';
import ClientMenuConfigController from './ClientMenuConfigController';
import CustomerController from './CustomerController';
import DashBoardConfigeController from './DashboardConfigController';
import DeviceStateController from './DeviceStateController';
import PayloadController from './PayloadController';
import SensorController from './SensorController';
import ServiceProviderController from './ServiceProviderController';
import DeviceTemplateControlller from './DeviceTemplateController';
import UsersRolesController from "./UsersRolesController";
import OrganizationController from "./OrganizationController";
export default {
    UserController:new UserController(),
    SubCustomerController : new SubCustomerController(),
    DeviceController : new DeviceController(),
    AlertConfigController: new AlertConfigController(),
    AssetController : new AssetController(),
    ClientMenuConfigController : new ClientMenuConfigController(),
    CustomerController : new CustomerController(),
    DashBoardConfigeController : new DashBoardConfigeController(),
    DeviceStateController : new DeviceStateController(),
    PayloadController : new PayloadController(),
    SensorController : new SensorController(),
    ServiceProviderController: new ServiceProviderController(),
    DeviceTemplateControlller: new DeviceTemplateControlller(),
    UsersRolesController: new UsersRolesController(),
    OrganizationController: new OrganizationController()
    


}