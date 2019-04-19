$(function(){
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
});
