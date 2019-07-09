if(CookieUtil.get('name')){
    var id = 1;
    window.addEventListener('load',function(event){

        const indicator = document.querySelector('.nav-indicator');
        const items = document.querySelectorAll('.nav-item');

        function handleIndicator(el) {
            items.forEach(item => {
                item.classList.remove('is-active');
                item.removeAttribute('style');
            });

            indicator.style.width = `${el.offsetWidth}px`;
            indicator.style.left = `${el.offsetLeft}px`;
            indicator.style.backgroundColor = el.getAttribute('active-color');

            el.classList.add('is-active');
            el.style.color = el.getAttribute('active-color');
        }

        items.forEach((item, index) => {
            item.addEventListener('click', e => {handleIndicator(e.target);});
            item.classList.contains('is-active') && handleIndicator(item);
        });

        /*var pages = document.querySelectorAll('.page');
        pages.forEach((item,index)=>{
            item.addEventListener('click',function(event){
                var current = document.getElementsByClassName('current')[0];
                current.classList.remove('current');
                item.classList.add('current');
            });
        });*/
        function hasScrollbar() {
            return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
        }
        function useXhr(xhr,id){
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                        var data = JSON.parse(xhr.responseText);
                        for(var i =0;i<data.length;i++){
                            var li = document.createElement('li');
                            li.classList.add('cover');
                            li.innerHTML += `<img src="${data[i]['cover_link']}" 
                            alt="${data[i]['ename']}"><span>${data[i]['name']}</span><span class="hidden">${data[i]['id']}</span>`;
                            movie_list.appendChild(li);
                        }
                        window.addEventListener('scroll',sc);
                        var list = document.querySelectorAll('.cover');
                        list.forEach((item,index) => {
                            item.addEventListener('click',function(event){
                                var text = item.getElementsByTagName('span')[1].innerText;
                                window.location.href = encodeURI("play.html?data="+text);
                            });
                        });
                        if(hasScrollbar()){
                            return ;
                        }else{
                            id++;
                            useXhr(xhr,id);
                        }
                    }else{
                        alert("XHR接收数据失败：" + xhr.status);
                    }
                }
            };
            xhr.open("post","./text/movie_list.txt",true);
            xhr.send(id);     
        }
        if(hasScrollbar()){
            
        }else{
            var movie_list = document.getElementById('movie_list');
            var xhr = new XMLHttpRequest();
            useXhr(xhr,id);
        }
        function re(event){
            if(hasScrollbar()){
                return ;
            }else{
                id++;
                useXhr(xhr,id);
                window.removeEventListener('resize',re);
            }
        }
        window.addEventListener('resize',re);

        function getScrollDiffer(){
            if(document.body.scrollTop){
                var scrollTop = document.body.scrollTop;
            }else if(document.documentElement.scrollTop){
                var scrollTop = document.documentElement.scrollTop;
            }
            return (document.body.scrollHeight - (document.body.clientHeight+scrollTop));
        }
        function sc(event){
            if(getScrollDiffer() < 20){
                id++;
                useXhr(xhr,id);
                window.removeEventListener('scroll',re);
            }
        }
        window.addEventListener('scroll',sc);

        //var current = document.getElementsByClassName('current')[0].innerText;
        
    });    
}else{
    window.location.href = 'login.html';
}
