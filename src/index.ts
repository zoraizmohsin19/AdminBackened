/*
 |-----------------------------------------------------------------
 |  index.ts    - Start point of application.
 |-----------------------------------------------------------------
 |
 */

 //Including the typing
/// <reference path="typing.d.ts" />

//Including the dependencies for server
import {Server} from './server';
import * as env from './../config/env.json';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var server:Server;

process.env.TZ = env['TIMEZONE'];

try{
    //Setting up the server
    server      =   new     Server(env['ENV'],env['PORT']);
    server.run();
} catch(e){
    console.log(e);
    process.exit(0);
}

