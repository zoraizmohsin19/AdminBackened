import * as request from "request";
import * as q from "q";
var token =     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWQ0ODExM2I4MWFlMjE2MWQwMDk3OTRjIiwiaWF0IjoxNTY1ODQxOTk4LCJleHAiOjE1NjU5MjgzOTh9.KGnby5502ocEgrH3uAf2nUEp6VztVdO4Sw-R-7ZuCWs";

request({
    'url':'https://makeitmatter.hdfcergo.com/api/user?page=1&page_size=500&search_query=',
    'method':'GET',
    'headers':{
        'authorization':'Bearer '+token
    }
},function(error, response, body){
    var result  =   JSON.parse(body);
    result.data.docs.forEach(element => {
        if(element.email == "admin@vidium.com"){
            return;
        }
        if(element.email == "deepak.vaishnav@hdfcergo.com"){
            return;
        }
        if(element.email == "admin_deepak@hdfcergo.com"){
            return;
        }
        request({
            'url':'https://makeitmatter.hdfcergo.com/api/user/'+element._id,
            'method':'DELETE',
            'headers':{
                'authorization':'Bearer '+token
            }
        },function(error, response, body){
            console.log("Delete")
        });
    });
}).on('error', (e) => {
    console.log(e)
})