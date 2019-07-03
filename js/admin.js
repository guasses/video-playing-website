window.addEventListener('load',function(event){
    var query = document.getElementById('query');
    query.addEventListener('click',function(event){
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange == function(){
            if(xhr.readyState == 4){
                if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                    alert(xhr.responseText);
                }else{
                    alert("XHR接收数据失败：" + xhr.status);
                }
            }else{
                alert(222);
            }
        };
        xhr.open("post","admin.html",true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        form = {'value':'search'};
        xhr.send(form);
    })
})