window.addEventListener("load",function(){
    //登录、注册按钮跳转
    var signIn = document.getElementById("signIn");
    var register = document.getElementById("register");
    var form = document.getElementById("myForm");
    var form1 = document.getElementById("myForm1");
    signIn.addEventListener("click",function(){
        myForm.style.display = "block";
        myForm1.style.display = "none";
    },false);
    register.addEventListener("click",function(){
        myForm.style.display = "none";
        myForm1.style.display = "block";
    },false);

    //登录界面事件  
    form.addEventListener("submit",function(event){
        event.preventDefault();
        var name = document.getElementById("name").value;
        var passwd = document.getElementById("passwd").value;
        var tip = document.getElementById("tip");
        if(name=="aaa" && passwd=="aaa"){
            form.action = "index.html";
            form.submit();
        }else{
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
                //form.reset();
            }
            
        }
    },false);

    //注册界面事件
    form1.addEventListener("submit",function(event){
        event.preventDefault();
    },false);
},false);