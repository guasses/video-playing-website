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
    var movie_list_post = "";
    var movie_post = "";
    var ajax_post = "";
    var pathname = url.parse(request.url).pathname;
    var ipv4 = get_client_ipv4(request);
    if(pathname=="/"){
        pathname = "/login.html";
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
                        
                    }else{
                        baseModel.insert('movie',post,function(set){
                            console.log(set);
                        });
                    }
                });
            }
        });
    }else if(pathname == '/text/ajax.txt'){
        request.on('data',function(chunk){
            ajax_post += chunk;
        });
        request.on('end',function(){
            console.log(ajax_post);
            var baseModel = new BaseModel();
            baseModel.find('movie',{'and':[],'or':[]},{'key':'id','type':'desc'},[(20*(Number(ajax_post)-1)),20],[],function(results){
                if(results){
                    var resultsStr = JSON.stringify(results);
                    response.write(resultsStr);
                    response.end();
                }else{
                    console.log("未查找到数据！");
                }
            });
        }); 
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
                        });
                    }else{
                        console.log("通过审核查询数据失败！");
                    }
                });
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
        });
    }else if(pathname == '/text/movie_list.txt'){
        request.on('data',function(chunk){
            movie_list_post += chunk;
        });
        request.on('end',function(){
            var data = querystring.parse(movie_list_post);
            console.log(`请求查找id=${data['id']},country=${data['country']},type=${data['type']},time=${data['time']},sort=${data['sort']}的数据,name=${data['name']}`);
            var baseModel = new BaseModel();
            function findMovies(result,data,whereJson){
                if(result){
                    if(Math.ceil(result/12.0)<Number(data['id'])){
                        response.write('1');
                        response.end();
                    }else{
                        var sort = '';
                        if(data['sort'] == '默认'){
                            sort = 'id';
                        }else if(data['sort'] == '豆瓣评分'){
                            sort = 'score';
                        }else if(data['sort'] == '观看次数'){
                            sort = 'click';
                        }
                        var orderByJson = {'key':`${sort}`,'type':'desc'};
                        baseModel.find('movie',whereJson,orderByJson,[(12*(Number(data['id'])-1)),
                        12],[],function(results){
                            if(results.length != 0){
                                var resultsStr = JSON.stringify(results);
                                response.write(resultsStr);
                                response.end();
                            }else{
                                console.log("未查找到电影数据！id="+data['id']);
                                response.write('0');
                                response.end(); 
                            }
                        });
                    }
                }
            }
            var whereJson = {};
            if(data['name'] != ""){
                baseModel.count('movie',`name like "%${data['name']}%"`,function(result){
                    whereJson = {
                        'and':[{'key':'name','opts':' like ','value':`"%${data['name']}%"`}],
                        'or':[]
                    };
                    findMovies(result,data,whereJson);
                });
            }else if(data['country'] == '全部' && data['type'] == '全部' && data['time'] == '全部'){
                baseModel.totalCount('movie',function(result){
                    whereJson = {
                        'and':[],'or':[]
                    }
                    findMovies(result,data,whereJson);
                });
            }else if(data['country'] == '全部' && data['type'] == '全部'){
                if(data['time'] == '00年代'){
                    baseModel.count('movie','time < 2010 and time >= 2000',function(result){
                        whereJson = {
                            'and':[{'key':'time','opts':'<','value':`2010`},
                            {'key':'time','opts':'>=','value':`2000`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    }); 
                }else if(data['time'] == '90年代'){
                    baseModel.count('movie','time < 2000 and time >= 1990',function(result){
                        whereJson = {
                            'and':[{'key':'time','opts':'<','value':`2000`},
                            {'key':'time','opts':'>=','value':`1990`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });
                }else if(data['time'] == '80年代'){
                    baseModel.count('movie','time < 1990 and time >= 1980',function(result){
                        whereJson = {
                            'and':[{'key':'time','opts':'<','value':`1990`},
                            {'key':'time','opts':'>=','value':`1980`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });
                }else if(data['time'] == '70年代'){
                    baseModel.count('movie','time < 1980 and time >= 1970',function(result){
                        whereJson = {
                            'and':[{'key':'time','opts':'<','value':`1980`},
                            {'key':'time','opts':'>=','value':`1970`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    }); 
                }else if(data['time'] == '更早'){
                    baseModel.count('movie','time < 1970',function(result){
                        whereJson = {
                            'and':[{'key':'time','opts':'<','value':`1970`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    }); 
                }else{
                    baseModel.count('movie','time = '+data['time'],function(result){
                        whereJson = {
                            'and':[{'key':'time','opts':'=','value':`"${data['time']}"`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });
                }
            }else if(data['country'] == '全部' && data['time'] == '全部'){
                baseModel.count('movie',`type like "%${data['type']}%"`,function(result){
                    whereJson = {
                        'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`}],'or':[]
                    }
                    findMovies(result,data,whereJson);
                });
            }else if(data['type'] == '全部' && data['time'] == '全部'){
                baseModel.count('movie',`country like "%${data['country']}%"`,function(result){
                    whereJson = {
                        'and':[{'key':'country','opts':' like ','value':`"%${data['country']}%"`}],'or':[]
                    }
                    findMovies(result,data,whereJson);
                });
            }else if(data['country'] == '全部'){
                if(data['time'] == '00年代'){
                    baseModel.count('movie',`time < 2010 and time >= 2000 and type like "%${data['type']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`},
                            {'key':'time','opts':'<','value':`2010`},
                            {'key':'time','opts':'>=','value':`2000`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });  
                }else if(data['time'] == '90年代'){
                    baseModel.count('movie',`time < 2000 and time >= 1990 and type like "%${data['type']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`},
                            {'key':'time','opts':'<','value':`2000`},
                            {'key':'time','opts':'>=','value':`1990`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });
                }else if(data['time'] == '80年代'){
                    baseModel.count('movie',`time < 1990 and time >= 1980 and type like "%${data['type']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`},
                            {'key':'time','opts':'<','value':`1990`},
                            {'key':'time','opts':'>=','value':`1980`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });
                }else if(data['time'] == '70年代'){
                    baseModel.count('movie',`time < 1980 and time >= 1970 and type like "%${data['type']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`},
                            {'key':'time','opts':'<','value':`1980`},
                            {'key':'time','opts':'>=','value':`1970`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    }); 
                }else if(data['time'] == '更早'){
                    baseModel.count('movie',`time < 1970 and type like "%${data['type']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`},
                            {'key':'time','opts':'<','value':`1970`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    }); 
                }else{
                    baseModel.count('movie',`time = ${data['time']} and type like "%${data['type']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`},
                            {'key':'time','opts':'=','value':`"${data['time']}"`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });
                }
            }else if(data['type'] == '全部'){
                if(data['time'] == '00年代'){
                    baseModel.count('movie',`time < 2010 and time >= 2000 and country like "%${data['country']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                            {'key':'time','opts':'<','value':`2010`},
                            {'key':'time','opts':'>=','value':`2000`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });  
                }else if(data['time'] == '90年代'){
                    baseModel.count('movie',`time < 2000 and time >= 1990 and country like "%${data['country']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                            {'key':'time','opts':'<','value':`2000`},
                            {'key':'time','opts':'>=','value':`1990`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });
                }else if(data['time'] == '80年代'){
                    baseModel.count('movie',`time < 1990 and time >= 1980 and country like "%${data['country']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                            {'key':'time','opts':'<','value':`1990`},
                            {'key':'time','opts':'>=','value':`1980`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });
                }else if(data['time'] == '70年代'){
                    baseModel.count('movie',`time < 1980 and time >= 1970 and country like "%${data['country']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                            {'key':'time','opts':'<','value':`1980`},
                            {'key':'time','opts':'>=','value':`1970`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    }); 
                }else if(data['time'] == '更早'){
                    baseModel.count('movie',`time < 1970 and country like "%${data['country']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                            {'key':'time','opts':'<','value':`1970`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    }); 
                }else{
                    baseModel.count('movie',`time = ${data['time']} and country like "%${data['country']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                            {'key':'time','opts':'=','value':`"${data['time']}"`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });
                }
            }else if(data['time'] == '全部'){
                baseModel.count('movie',`country like "%${data['country']}%" and type like "%${data['type']}%"`,function(result){
                    whereJson = {
                        'and':[{'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                        {'key':'type','opts':' like ','value':`"%${data['type']}%"`}],
                        'or':[]
                    };
                    findMovies(result,data,whereJson);
                });
            }else{
                if(data['time'] == '00年代'){
                    baseModel.count('movie',`time < 2010 and time >= 2000 and type like "%${data['type']}%" and country like "%${data['country']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`},
                            {'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                            {'key':'time','opts':'<','value':`2010`},
                            {'key':'time','opts':'>=','value':`2000`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });  
                }else if(data['time'] == '90年代'){
                    baseModel.count('movie',`time < 2000 and time >= 1990 and type like "%${data['type']}%" and country like "%${data['country']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`},
                            {'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                            {'key':'time','opts':'<','value':`2000`},
                            {'key':'time','opts':'>=','value':`1990`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });
                }else if(data['time'] == '80年代'){
                    baseModel.count('movie',`time < 1990 and time >= 1980 and type like "%${data['type']}%" and country like "%${data['country']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`},
                            {'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                            {'key':'time','opts':'<','value':`1990`},
                            {'key':'time','opts':'>=','value':`1980`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });
                }else if(data['time'] == '70年代'){
                    baseModel.count('movie',`time < 1980 and time >= 1970 and type like "%${data['type']}%" and country like "%${data['country']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`},
                            {'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                            {'key':'time','opts':'<','value':`1980`},
                            {'key':'time','opts':'>=','value':`1970`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    }); 
                }else if(data['time'] == '更早'){
                    baseModel.count('movie',`time < 1970 and type like "%${data['type']}%" and country like "%${data['country']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`},
                            {'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                            {'key':'time','opts':'<','value':`1970`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    }); 
                }else{
                    baseModel.count('movie',`time = ${data['time']} and type like "%${data['type']}%" and country like "%${data['country']}%"`,function(result){
                        whereJson = {
                            'and':[{'key':'type','opts':' like ','value':`"%${data['type']}%"`},
                            {'key':'country','opts':' like ','value':`"%${data['country']}%"`},
                            {'key':'time','opts':'=','value':`${data['time']}`}],'or':[]
                        }
                        findMovies(result,data,whereJson);
                    });
                }
            }
        });
    }else if(pathname == '/text/movie.txt'){
        request.on('data',function(chunk){
            movie_post += chunk;
        });
        request.on('end',function(){
            var baseModel = new BaseModel();
            baseModel.findOneById('movie',{'id':movie_post},function(result){
                if(result){
                    var resultStr = JSON.stringify(result);
                    response.write(resultStr);
                    response.end();
                }else{
                    console.log("未找到视频数据！id="+movie_post);
                    response.write('0');
                    response.end();
                }
            });
        });
    }else if(pathname == '/text/count.txt'){
        var baseModel = new BaseModel();
        baseModel.totalCount('movie',function(result){
            if(result){
                response.write(String(result));
                response.end();
            }else{
                console.log("获取数据总条数失败！");
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