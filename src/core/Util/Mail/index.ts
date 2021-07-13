/*
 |-------------------------------------------------------------------
 |  User.ts - Module User is use to manage the user of the application
 |-------------------------------------------------------------------
 */

import * as nodemailer from 'nodemailer';
import * as q from 'q';
import * as mail from './../../../../config/mail.json';
import Message  from '../Message';
import * as path from 'path';
var renderer  =  require('./../../../../render');

export default class Mail {

    private  connection:string  =   null;
    private  data:any  =   null;
    private  attachments  =   [{
        filename:"logo.png",
        path:path.join(__dirname,"../../../../public/images/dep_logo.png"),
        cid:"logo"
    }];
    private  toEmail:string          =   null;
    private  mailSubject:string          =   null;

    public constructor(connection:string="default"){
        this.connection     =   connection;
    }

    public subject(subject:string=null){
        this.mailSubject    = subject;
    }

    public to(email:string=null){
        this.toEmail    = email;
    }

    public setData(data:any={}){
        this.data   =    data;
    }
    
    public addAttachment(name:string=null,attachment:string=null,cid:string=null){
        if(attachment != null){
            this.attachments.push({
                filename: name,
                path: attachment,
                cid:cid
            });
        }
    }
    //Method is used to send the email to user
    public  send(template_name:string){
        var defer       =   q.defer();
        if(mail[this.connection] == undefined){
            defer.reject(new Message(Message.INVALID_PARAM,"Mail connection does not exists"));
            return defer.promise;
        }
        var  transport   =   mail[this.connection]
        var transporter             =   nodemailer.createTransport(transport);

        // console.log(template_name);

        // console.log(renderer[template_name]);
        var data        =       {
            from: '"'+transport.name+'" <'+transport.auth.user+'>', // sender address
            to: this.toEmail, // list of receivers
            subject: this.mailSubject, // Subject line
            html: renderer[template_name](this.data), // html body,
            attachments:this.attachments
        };


        transporter.sendMail(data,function(error){
            if (error) {
                console.log(error);
                defer.reject(new Message(Message.INTERNAL_ERROR,"Failed to send mail.",error));
                return ;
            }
            defer.resolve({});
        });
        return defer.promise;
    }
}
