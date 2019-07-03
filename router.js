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
        case ".txt":
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