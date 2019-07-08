if(CookieUtil.get('name')){
    window.addEventListener('load',function(event){
        var url = window.location.href;
        var id = decodeURI(url.split("=")[1]);
        var video = document.getElementById('video');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                    var data = JSON.parse(xhr.responseText); 
                    video.innerHTML = `<source src="${data['link']}" type="video/mp4"/>`;
                }else{
                    alert("XHR接收数据失败：" + xhr.status);
                }
            }
        };
        xhr.open("post","./text/movie.txt",true);
        xhr.send(id);
    });
    
    /*$(function(){
        var video = document.querySelector("video")
        var playBtn = $(".switch");
        var currProgress = $(".curr-progress");
        var currTime = $(".curr-time");
        var totalTime = $(".total-time");
        var extend = $(".extend");
        var tTime = 0;
        var url = window.location.href;
        var data = decodeURI(url.split("=")[1]);
        $("figcaption").text(data);
        $(".home").click(function(){
            window.location.href = "index.html";
        });
        $(".right > ul > li").click(function(){
            $(this).children("span").addClass("current").parent("li").siblings("li").children("span").removeClass("current");
            $(this).children("ul").removeClass("hidden").parent("li").siblings("li").children("ul").addClass("hidden");
        });
    
        playBtn.click(function(){
            if(video.paused){
                video.play();
                playBtn.removeClass("icon-play");
                playBtn.addClass("icon-pause");
            }else{
                video.pause()
                playBtn.removeClass("icon-pause");
                playBtn.addClass("icon-play");
            }
        });
        $("video").click(function(){
            if(video.paused){
                video.play();
                playBtn.removeClass("icon-play");
                playBtn.addClass("icon-pause");
            }else{
                video.pause()
                playBtn.removeClass("icon-pause");
                playBtn.addClass("icon-play");
            }
        });
        video.oncanplay = function(){
            tTime = video.duration;
            
            var h = Math.floor(tTime/3600);
            var m = Math.floor(tTime%3600/60);
            var s = Math.floor(tTime%60);
    
            h = h>10?h:"0"+h;
            m = m>10?m:"0"+m;
            s = s>10?s:"0"+s;
    
            totalTime.text(h+":"+m+":"+s);
        }
        video.ontimeupdate = function(){
            var cTime=video.currentTime;
            var h = Math.floor(cTime/3600);
            var m = Math.floor(cTime%3600/60);
            var s = Math.floor(cTime%60);
    
            h = h>10?h:"0"+h;
            m = m>10?m:"0"+m;
            s = s>10?s:"0"+s;
    
            currTime.text(h+":"+m+":"+s);
            var value = cTime/tTime*100+"%";
            
            currProgress.css("width",value);
        }
        extend.click(function(){
            video.webkitEnterFullScreen();
        });
    });*/
    
}else{
    window.location.href = 'login.html';
}