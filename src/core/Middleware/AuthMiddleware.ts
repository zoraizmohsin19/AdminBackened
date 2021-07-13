/*
 |-----------------------------------------------------------------------------
 |  TokenMiddleware.js  - Token middleware handle request and validate whether 
 |                        valid token is present with request or not
 |-----------------------------------------------------------------------------
 */
import Message from '../Util/Message';
import User from '../BusinessLogic/User';

export default function(request,response,next){
    var headers     =   request.headers;

    if(headers.authorization == undefined){
        var message         =    new Message(
            Message.INVALID_HEADER,
            "Authoration Header not passed"
        );
        response.status(message.getResponseCode());
        response.json(message.toJson());
        return;
    }

    var authorization_header    =   headers.authorization;
    var check_head_star         =   authorization_header.substr(0,6);
    if(check_head_star != 'Bearer'){
        var message         =   new Message(
            Message.INVALID_HEADER,
            "Invalid Authoration Header"
        );
        response.status(message.getResponseCode());
        response.json(message.toJson());

    }
    var token           =   authorization_header.substr(7);

    var user    =   User.instance();
    user.getUserFromToken(token).then((result:Message)=>{
        var user    =   result.getMessageData();
        request['auth_user']    =   user
        next();
    }).catch(err=>{
        var message     = new Message(Message.INTERNAL_ERROR,"Failed to validate token");
        response.status(message.getResponseCode());
        response.json(message.toJson());
    });
}