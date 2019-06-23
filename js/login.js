window.addEventListener("load",function(){
    var form = document.getElementById("myForm");
    form.addEventListener("submit",function(event){
        event.preventDefault();
        var name = document.getElementById("name").value;
        if(name=="aaa"){
            form.action = "index.html";
            form.submit();
        }else{
            form.reset();
        }
    },false);
},false);