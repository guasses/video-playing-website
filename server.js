//原生模块
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring')
//npm添加模块
var mysql = require('mysql');
//自定义模块
var router = require('./router.js')


function insertSql(connection,value){
    connection.query("select * from 'movie' where 'name' = ?",value.movie_name,function(error,results,fields){
        //console.log(results.id);
        console.log(results);
        if(error)throw error;
    });
    var tmp = [value.movie_name,value.movie_ename,value.movie_country,value.movie_type,
        value.movie_link,value.movie_cover_link,value.movie_click,value.movie_watch,
        value.movie_heat,value.movie_score];
    //console.log(tmp);
    var sql = 'insert into movie(id,name,ename,country,type,link,cover_link,click,watch,heat,score) values(0,?,?,?,?,?,?,?,?,?,?)';
    connection.query(sql,tmp,function(error,results,fields){
        if(error) throw error;
        console.log("插入数据成功！");
    });
}

http.createServer(function(request,response){
    var post = "";
    var pathname = url.parse(request.url).pathname;
    if(pathname=="/"){
        pathname='/index.html';
    }else if(pathname == '/favicon.ico'){
        return;
    }else if(pathname == '/admin.html'){
        request.on('data',function(chunk){
            post += chunk;
        });
        request.on('end',function(){
            post = querystring.parse(post);
            if(post.movie_name!=undefined){
                var connection = mysql.createConnection({
                    host:'47.101.130.152',
                    user:'root',
                    password:'kn0ckknOck',
                    database:'video',
                });
                connection.connect(function(err){
                    if(err){
                        console.log(date.toLocaleDateString() + " " + date.toLocaleTimeString() +" " +get_client_ipv4(request)+" 数据库连接失败！");
                    }else{
                        console.log(date.toLocaleDateString() + " " + date.toLocaleTimeString() +" " +get_client_ipv4(request)+" 数据库连接成功！");
                        insertSql(connection,post);
                    }
                });
            }
        });
    }
    
    var date = new Date();
    console.log(date.toLocaleDateString() + " " + date.toLocaleTimeString() +" " +get_client_ipv4(request)+" 请求 " + decodeURI(pathname));
    //console.log(__dirname + pathname);
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

//获取url请求客户端ip
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

console.log('web服务已运行！');