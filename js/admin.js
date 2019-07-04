window.addEventListener('load',function(event){
    var query = document.getElementById('query');
    var tbody = document.getElementById('tbody');
    var check = document.getElementById('check');
    var checkXhr = new XMLHttpRequest();
    checkXhr.onreadystatechange = function(){
        if(checkXhr.readyState == 4){
            if((checkXhr.status >= 200 && checkXhr.status < 300) || checkXhr.status == 304){
                var checkData = JSON.parse(checkXhr.responseText);
                for(var i=0;i<checkData.length;i++){
                    var tr = document.createElement('tr');
                    tr.innerHTML +="<tr><td>" + checkData[i]['id'] + "</td><td>" + 
                    checkData[i]['name'] + "</td><td>" + 
                    checkData[i]['reason'] + "</td></tr><button>通过</button><button>删除</button>";
                    check.appendChild(tr);
                }
            }else{
                alert("XHR接收数据失败："+xhr.status);
            }
        }
    }
    checkXhr.open("post","/pre_users.txt",true);
    //xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    checkXhr.send(null);
    query.addEventListener('click',function(event){
        tbody.innerHTML = '';
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                    var data = JSON.parse(xhr.responseText);
                    for(var i =0;i<data.length;i++){
                        var tr = document.createElement('tr');
                        tr.innerHTML += "<tr><td>" + data[i]['id'] + "</td><td>" +
                        data[i]['name'] + "</td><td>" +
                        data[i]['ename'] + "</td><td>" +
                        data[i]['country'] + "</td><td>" +
                        data[i]['type'] + "</td><td>" +
                        data[i]['link'] + "</td><td>" +                        
                        data[i]['cover_link'] + "</td><td>" +
                        data[i]['click'] + "</td><td>" +
                        data[i]['watch'] + "</td><td>" +
                        data[i]['heat'] + "</td><td>" +
                        data[i]['score'] + "</td></tr>";
                        tbody.appendChild(tr);
                    }
                }else{
                    alert("XHR接收数据失败：" + xhr.status);
                }
            }
        };
        xhr.open("post","/ajax.txt",true);
        //xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(null);
    });
});

function getJsonLength(jsonData){
    var jsonLength = 0;
    for (var item in jsonData){
        jsonLength++;
    }
    return jsonLength;
}