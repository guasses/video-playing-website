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
    var login_post = "";
    var check_post = "";
    var dl_post = "";
    var pathname = url.parse(request.url).pathname;
    var ipv4 = get_client_ipv4(request);
    if(pathname=="/"){
        pathname = "/login.html";
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
            //console.log(post);
            post = querystring.parse(post);
            //console.log(post);  
            if(post.name!=undefined){
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
    }else if(pathname == '/text/ajax.txt'){
        var baseModel = new BaseModel();
        baseModel.find('movie',{'and':[],'or':[]},{'key':'id','type':'desc'},[0,20],[],function(results){
            if(results){
                var resultsStr = JSON.stringify(results);
                response.write(resultsStr);
                response.end();
            }else{
                console.log("未查找到数据！");
            }
        });
        baseModel = null;  
    }else if(pathname == '/text/zc.txt'){
        request.on('data',function(chunk){
            login_post += chunk;
        });
        request.on('end',function(){
            login_post = querystring.parse(login_post);
            var baseModel = new BaseModel();
            baseModel.findOneById('pre_users',{'name':login_post.zc_name},function(result){
                if(result){
                    console.log("用户注册，重复插入数据！");
                    response.write('0');
                    response.end();
                }else{
                    
                    baseModel.insert('pre_users',{'name':login_post.zc_name,'password':
                    login_post.zc_password,'reason':login_post.zc_reason},function(id){
                        if(id){
                            console.log("用户注册，成功插入注册数据库，用户id为"+id);
                            response.write('1');
                            response.end();
                        }else{
                            console.log("用户注册，插入注册数据库失败！");
                        }  
                    });
                }
            });
        });
        
    }else if(pathname == '/text/pre_users.txt'){
        var baseModel = new BaseModel();
        baseModel.find('pre_users',{'and':[],'or':[]},{'key':'id','type':'desc'},[0,20],[],function(results){
            if(results){
                var resultsStr = JSON.stringify(results);
                response.write(resultsStr);
                response.end();
            }else{
                console.log("未查找到数据！");
            }
        });
    }else if(pathname == '/text/check.txt'){
        var baseModel = new BaseModel();
        request.on('data',function(chunk){
            check_post += chunk;
        });
        request.on('end',function(){
            check_post = querystring.parse(check_post);
            if(check_post.pass){
                baseModel.findOneById('pre_users',{'id':check_post.zc_id},function(result){
                    if(result){
                        baseModel.insert('users',{'name':result.name,'password':result.password},function(id){
                            if(id){
                                console.log("正式库插入数据成功！");
                                baseModel.remove('pre_users',{'id':check_post.zc_id},function(result){
                                    if(result){
                                        console.log("通过，删除注册数据库数据成功！");
                                    }else{
                                        console.log("通过，删除注册数据库数据失败！");
                                    }
                                });
                            }else{
                                console.log("正式库插入数据失败！");
                            }
                        })
                    }else{
                        console.log("通过审核查询数据失败！");
                    }
                })
            }else if(check_post.delete){
                baseModel.remove('pre_users',{'id':check_post.zc_id},function(result){
                    if(result){
                        console.log("删除，删除注册数据库数据成功！");
                    }else{
                        console.log("删除，删除注册数据库数据失败！");
                    }
                });
            }
        });
    }else if(pathname == '/text/users.txt'){
        var baseModel = new BaseModel();
        request.on('data',function(chunk){
            dl_post += chunk;
        });
        request.on('end',function(){
            dl_post = querystring.parse(dl_post);
            baseModel.find('users',{'and':[{'key':'name','opts':'=','value':'\"'+dl_post.dl_name+'\"'},
            {'key':'password','opts':'=','value':'\"'+dl_post.dl_password+'\"'}],'or':[]},
            {'key':'id','type':'desc'},[0,1],[],function(results){
                if(results.length != 0){
                    response.write('1');
                    response.end();
                }else{
                    console.log("登录，未查找到数据！");
                    response.write('0');
                    response.end();
                }
            });
        })
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