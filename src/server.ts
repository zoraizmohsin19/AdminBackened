/*
 |-------------------------------------------------------------------
 |  server.ts - File for server defination
 |-------------------------------------------------------------------
 |  File contains the class to manage the server. It consist of logic
 |  for bootstraping of server and Middleware initization and biniding
 |  with server port.
 |
 */
import * as express from 'express';
import {Router}     from './router';
import * as bodyparser from 'body-parser';
import * as fileUpload from 'express-fileupload';
import * as path  from 'path';
import * as http from "http";
import * as dot from "dot";
import * as helmet from 'helmet';
import * as env from './../config/env.json';
var renderer  =  require('./../render');

export class Server{

    private env:string;
    private port:string;
    private app:express.Application     =   null;
    private router:Router  =   null;
    private server:http.Server  =   null

    //Constructor For applicatin
    constructor(env:string,port:string){
        if(env == null || env == undefined || env.trim().length == 0){
            throw new Error('Empty/Null/Undefined eviorment provided.');
        }

        if(port == null || port == undefined){
            throw new Error('Port not provided.');
        }

        this.env        =   env;
        this.port       =   port;
        this.bootstarp();
    }

    //Bootstarping the server
    private bootstarp():void{
        //Initializing the express
        this.app    =   express();
        this.app.use(fileUpload());

        this.server = new http.Server(this.app);

        dot.templateSettings = {
            evaluate:    /\[\[([\s\S]+?)\]\]/g,
            interpolate: /\[\[=([\s\S]+?)\]\]/g,
            encode:      /\[\[!([\s\S]+?)\]\]/g,
            use:         /\[\[#([\s\S]+?)\]\]/g,
            define:      /\[\[##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\]\]/g,
            conditional: /\[\[\?(\?)?\s*([\s\S]*?)\s*\]\]/g,
            iterate:     /\[\[~\s*(?:\]\]|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\]\])/g,
            varname: 'it',
            strip: true,
            append: true,
            selfcontained: false
        };
        
        dot.process({ global: "_page.render"
             ,destination: __dirname + "/../render"
             ,path: (__dirname + "/../views")
        });

        // parse application/x-www-form-urlencoded
        var upperBound = '1gb';
        this.app.use(bodyparser.urlencoded({ extended: false , limit: upperBound}));
        // parse application/json
        this.app.use(bodyparser.json());

        // console.log(),"LOKEHS");
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", (env['ORIGIN']==undefined?"*":env['ORIGIN']));
            if(env['ORIGIN']==undefined || env['ORIGIN']=="*"){
                res.header("Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT, HEAD, DELETE");
                res.header('Access-Control-Expose-Headers', 'Content-Length');
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Accept-Language");
            } else{
                // res.header("Access-Control-Allow-Methods","GET, POST, PUT, HEAD, DELETE");
            }
            
            res.setHeader("Access-Control-Allow-Origin", (env['ORIGIN']==undefined?"*":env['ORIGIN']));
            if(env['ORIGIN']==undefined || env['ORIGIN']=="*"){
                res.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT, HEAD, DELETE");
                res.setHeader('Access-Control-Expose-Headers', 'Content-Length');
                res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Accept-Language");
            } else {
                // res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, HEAD, DELETE");
            }
            
            if (req.method === 'OPTIONS' || req.method === 'OPTIONS') {
                if(env['ORIGIN']==undefined || env['ORIGIN']=="*"){
                    res.send(200);
                } else {
                    res.status(404);
                    return res.send('404: Page not Found');
                }
             } else {
                return next();
             }
            // next();
        });

        this.app.use(helmet());
        this.app.use(express.static(path.join(__dirname,"../public")));
        
       

        this.router     =   new Router(this.app);

        //Associating the routers to application
        this.router.associate();

        // Handle 404
        this.app.use(function(req, res) {
            res.status(404);
            res.send('404: Page not Found');
        });
  
        // Handle 500
        this.app.use(function(error, req, res, next) {
            res.status(500);
            res.send('500: Internal Server Error', );
        });
    }

    //Running the server
    public run():void{
        var me      =   this;
        if(this.server  == null){
            throw new Error('Express application is not initialized.');
        }
        
        this.server.listen(this.port,function(){
            console.log('Application started on port '+me.port);
        });
           
    }
}
