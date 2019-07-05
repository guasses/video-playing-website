if(CookieUtil.get('name')){
    $(function(){
        $(".list li").click(function(){
            //获取标题
            var text = $(this).find("span").text();
            window.location.href = encodeURI("play.html?data="+text);
        });
    });
}else{
    window.location.href = 'login.html';
}
