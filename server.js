var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring')
var mysql = require('mysql');


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
    if(request.url == '/admin.html'){
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
                connection.connect();
                insertSql(connection,post);
                connection.end();
            }
        });
    }
    
    
    var pathname = url.parse(request.url).pathname;
    /*if(pathname=="/"){
        pathname='/index.html';
    }*/
    console.log("文件" + decodeURI(pathname) + "被请求。来自"+get_client_ip(request));
    var ext = pathname.match(/(\.[^.]+|)$/)[0];//取得后缀名
    switch(ext){
        case ".css":
        case ".js":
            fs.readFile("."+request.url,'utf-8',function(err,data){
                if(err) throw err;
                response.writeHead(200,{
                    "Content-Type":{
                        ".css":"text/css",
                        ".js":"application/javascript",
                    }[ext]
                });
                response.write(data);
                response.end();
            });
            break;
        case ".jpg":
        case ".gif":
        case ".png":
            fs.readFile("."+decodeURI(request.url),'binary',function(err,data){
                //console.log(decodeURI(request.url));
                if(err)throw err;
                response.writeHead(200,{
                    "Content-Type":{
                        ".jpg":"image/jpeg",
                        ".gif":"image/gif",
                        ".png":"image/png",
                    }[ext]
                });
                response.write(data,'binary');
                response.end();
            });
            break;
        default:
            console.log(pathname);
            fs.readFile('.'+pathname,'utf-8',function(err,data){    
                response.writeHead(200,{
                    "Content-Type":"text/html"
                });
                response.write(data);
                response.end();
            });
    }
    
}).listen(8080);

//获取url请求客户端ip
var get_client_ip = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    return ip;
};

console.log('web服务已运行！');