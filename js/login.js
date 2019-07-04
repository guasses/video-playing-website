/*CookieUtil.set("name","Nicholas");
CookieUtil.set("book","Professional Jacascript");
alert(CookieUtil.get("name"));
alert(CookieUtil.get("book"));
CookieUtil.unset("name");
CookieUtil.unset("book");*/

window.addEventListener("load",function(){
    //登录、注册按钮跳转
    var signIn = document.getElementById("signIn");
    var register = document.getElementById("register");
    var dl = document.getElementById('dl');
    var zc = document.getElementById('zc');
    signIn.addEventListener("click",function(){
        myForm.style.display = "block";
        myForm1.style.display = "none";
    },false);
    register.addEventListener("click",function(){
        myForm.style.display = "none";
        myForm1.style.display = "block";
    },false);

    //登录界面事件  
    dl.addEventListener("click",function(event){
        event.preventDefault();
        var name = document.getElementById("name").value;
        var passwd = document.getElementById("passwd").value;
        var tip = document.getElementById("tip");
        
        if(name=="" && passwd==""){
            tip.innerText = "请输入用户名和密码！"
            tip.style.visibility = "visible";
        }else if(passwd==""){
            tip.innerText = "请输入密码！";
            tip.style.visibility = "visible";
        }else if(name==""){
            tip.innerText = "请输入用户名！";
            tip.style.visibility = "visible";
        }else{
            tip.innerText = "用户名或密码不正确！";
            tip.style.visibility = "visible";
            
            form.submit();
            form.action = "index.html";
            //form.reset();
        }    
    },false);

    //注册界面事件
    zc.addEventListener("click",function(event){
        var name = document.getElementById("zc_name").value;
        var passwd = document.getElementById("zc_passwd").value;
        var reason = document.getElementById("zc_reason").value;
        var tip = document.getElementById("zc_tip");
        if(name=="" && passwd==""){
            tip.innerText = "请输入用户名和密码！"
            tip.style.visibility = "visible";
        }else if(passwd==""){
            tip.innerText = "请输入密码！";
            tip.style.visibility = "visible";
        }else if(name==""){
            tip.innerText = "请输入用户名！";
            tip.style.visibility = "visible";
        }else if(reason==""){
            tip.innerText = "请输入理由！";
            tip.style.visibility = "visible";
        }else if(passwd.length<6){
            tip.innerText = "密码必须大于6位以上!";
            tip.style.visibility = "vsiible";
        }else{
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                        if(Number(xhr.responseText)){
                            alert("注册成功，请等待审核！");
                        }else{
                            alert("用户名已存在，请重新输入！");
                        }
                    }else{
                        alert("XHR接收数据失败：" + xhr.status);
                    }
                }
            };
            xhr.open("post","zc.txt",true);
            //xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send("zc_name="+name+"&zc_password="+passwd+"&zc_reason="+reason);
            }
          
    },false);
},false);