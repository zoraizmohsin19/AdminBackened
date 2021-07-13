import User from "../core/BusinessLogic/User";
import * as env from "./../../config/env.json";
import { UserRole } from "../core/Models/User/IUser";

var user    =   User.instance();

// user.create("Admin",env['INIT_ADMIN'],env['INIT_ADMIN_PASS'],UserRole.ADMIN,null,null).then(result=>{
//     console.log("User created successfully.");
//     process.exit(0);
// }).catch(err=>{
//     console.error("User failed to create");
//     console.error(err);
//     process.exit(1);
// })