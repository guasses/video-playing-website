/**
 * 
 * @desc 根据后缀名读取文件
 * @param pathname string 文件路径 url.parse(request.url).pathname
 * @param fs fs
 * @param request htttp.request
 * @param response https.response
 */
exports.readFileBySuffixName = function(pathname,fs,request,response){
    var ext = pathname.match(/(\.[^.]+|)$/)[0];//取得后缀名
    switch(ext){
        case ".css":
        case ".js":
        //case ".html":
            fs.readFile("."+request.url,'utf-8',function(err,data){
                if(err) throw err;
                response.writeHead(200,{
                    "Content-Type":{
                        ".css":"text/css",
                        ".js":"application/javascript",
                        //".html":"text/html",
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
        case ".mp4":
            fs.stat('.'+decodeURI(request.url),function(err,stats){
                if(err){
                    if(err.code === 'ENOENT'){
                        return response.sendStatus(404);
                    }
                    response.end(err);
                }
                var range = request.headers.range;
                if(!range){
                    return response.sendStatus(416);
                }
                var positions = range.replace(/bytes=/,"").split("-");
                var start = parseInt(positions[0]);
                var total = stats.size;
                var end = positions[1] ? parseInt(positions[1],10):total -1;
                var chunksize = (end-start) + 1;

                response.writeHead(206,{
                    "Content-Range":"bytes "+ start+"-"+end+"/"+total,
                    "Accept-Ranges":"bytes",
                    "Content-Length":chunksize,
                    "Content-Type":"video/mp4"
                });
                var stream = fs.createReadStream('.'+decodeURI(request.url),{start:start,end:end})
                .on("open",function(){
                    stream.pipe(response);
                }).on("error",function(err){
                    response.end(err);
                });
            });
            break;
        case ".txt":
            break;
        case ".ico":
            fs.readFile('.'+decodeURI(request.url),'binary',function(err,data){    
                response.writeHead(200,{
                    "Content-Type":"image/x-icon"
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
}