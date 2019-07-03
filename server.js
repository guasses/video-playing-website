//原生模块
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

//自定义模块
var router = require('./router.js');
var BaseModel = require('./base_model.js');

http.createServer(function(request,response){
    var post = "";
    var pathname = url.parse(request.url).pathname;
    var ipv4 = get_client_ipv4(request);
    if(pathname=="/"){
        pathname='/index.html';
    }else if(pathname == '/favicon.ico'){
        response.writeHead(200,{'Content-Type':'text/plain'});
        response.write("The Server does not provide favicon.ico");
        response.end();
        return;
    }else if(pathname == '/admin.html'){
        request.on('data',function(chunk){
            post += chunk;
        });
        request.on('end',function(){
            console.log(post);
            post = querystring.parse(post);
            console.log(post);
            if(post.value != undefined){
                var baseModel = new BaseModel();
                baseModel.find('movie',null,null,[0,20],null,function(results){
                    if(results){
                        response.writeHead(200,{'Content-type':'text/plain'});
                        response.write(results);
                        response.end();
                    }
                });
            }else if(post.name!=undefined){
                var baseModel = new BaseModel();
                baseModel.findOneById('movie',{'link':post.link},function(set){
                    if(set){
                        console.log("重复插入数据！");
                        baseModel = null;
                    }else{
                        baseModel.insert('movie',post,function(set){
                            console.log(set);
                            baseModel = null;
                        });
                    }
                });
            }
        });
    }
    
    showLog(ipv4,("请求"+decodeURI(pathname)));
    //判断文件是否存在，不存在显示并发送错误信息
    fs.exists(__dirname + decodeURI(pathname),function(exists){
        if(exists){
            router.readFileBySuffixName(pathname,fs,request,response);
        }else{
            console.log(decodeURI(pathname)+"文件不存在！")
            response.end(pathname+"文件不存在！");
        }
    });
    
}).listen(8080);

/**
 * @desc 获取IPV4地址
 * @param req htttp.request
 */
var get_client_ipv4 = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = (ip.split(',')[0]).match(/(\d+\.\d+\.\d+\.\d+)/)[0];
    }
    return ip;
};

/**
 * @desc 向控制台输出日志，自动在头部添加时间、地址
 * @param ipv4 string
 * @param message string
 */
var showLog = function(ipv4,message){
    var date = new Date();
    console.log(date.toLocaleDateString() + " " + date.toLocaleTimeString() +
        " " + ipv4 + " " + message);
    date = null;
}

console.log('web服务已运行！');