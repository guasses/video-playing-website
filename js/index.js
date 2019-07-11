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

        var signOut = document.getElementById('signOut');
        signOut.addEventListener('click',function(event){
            CookieUtil.unset('name');
        });
        var xhr = new XMLHttpRequest();
        var movie_list = document.getElementById('movie_list');
        var categoryItems = document.querySelectorAll('.category a');
        var searchIcon = document.getElementById('search_icon');
        var search = document.getElementById('search');
        searchIcon.addEventListener('click',function(){
            if(search.style.display == '' || search.style.display == 'none'){
                search.style.display = 'block';
                window.scrollTo(0,0);
            }else if(search.style.display == 'block'){
                search.style.display = 'none';
            }
        });
        var searchText = document.getElementById('search_text');
        var searchButton = document.getElementById('search_button');
        searchButton.addEventListener('click',searchFc);
        window.addEventListener('keyup',function(event){
            if(event.keyCode == 13){
                searchFc(event);
            }
        });
        function searchFc(event){
            id = 1;
            movie_list.innerHTML = "";
            useXhr(xhr,id,"全部","全部","全部","豆瓣评分",searchText.value);
        }
        categoryItems.forEach((item,index)=>{
            item.addEventListener('click',e=>{
                searchText.value = "";
                var tmps =  item.parentElement.querySelectorAll('a');
                tmps.forEach((tmp,index)=>{
                    tmp.classList.remove('selected');
                });
                item.classList.add('selected');
                var country = document.querySelector('#country .selected').innerText;
                var type = document.querySelector('#type .selected').innerText;
                var time = document.querySelector('#time .selected').innerText;
                var sort = document.querySelector('#sort .selected').innerText;
                id = 1;
                movie_list.innerHTML = "";
                useXhr(xhr,id,country,type,time,sort);
            });
        });
        
        if(hasScrollbar()){
            
        }else{
            var country = document.querySelector('#country .selected').innerText;
            var type = document.querySelector('#type .selected').innerText;
            var time = document.querySelector('#time .selected').innerText;
            var sort = document.querySelector('#sort .selected').innerText;
            useXhr(xhr,id,country,type,time,sort);
        }
        
        window.addEventListener('resize',re);
        window.addEventListener('scroll',sc);

        function getScrollDiffer(){
            if(document.body.scrollTop){
                var scrollTop = document.body.scrollTop;
            }else if(document.documentElement.scrollTop){
                var scrollTop = document.documentElement.scrollTop;
            }
            return (document.body.scrollHeight - (document.body.clientHeight+scrollTop));
        }
        function sc(event){
            if(getScrollDiffer() < 30){
                id++;
                var country = document.querySelector('#country .selected').innerText;
                var type = document.querySelector('#type .selected').innerText;
                var time = document.querySelector('#time .selected').innerText;
                var sort = document.querySelector('#sort .selected').innerText;
                useXhr(xhr,id,country,type,time,sort);
                window.removeEventListener('scroll',sc);
            }
        }
        function re(event){
            if(hasScrollbar()){
                return ;
            }else{
                id++;
                var country = document.querySelector('#country .selected').innerText;
                var type = document.querySelector('#type .selected').innerText;
                var time = document.querySelector('#time .selected').innerText;
                var sort = document.querySelector('#sort .selected').innerText;
                useXhr(xhr,id,country,type,time,sort);
                window.removeEventListener('resize',re);
            }
        }

        function hasScrollbar() {
            return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
        }
        function useXhr(xhr,id,country,type,time,sort,name=searchText.value){
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                        //window.removeEventListener('scroll',sc);
                        if(xhr.responseText == 1){
                            var bottom = document.getElementById('bottom');
                            bottom.style.display = 'block';
                        }//else if(xhr.responseText == 0){
                            //alert("拉取数据库数据失败，请联系管理员！");
                        //}
                        else if(xhr.responseText){
                            var data = JSON.parse(xhr.responseText);
                            for(var i =0;i<data.length;i++){
                                var li = document.createElement('li');
                                li.classList.add('cover');
                                li.innerHTML += `<img src="${data[i]['cover_link']}" 
                                alt="${data[i]['ename']}"><span>${data[i]['name']}</span><span 
                                class="hidden">${data[i]['id']}</span><span>${data[i]['score']}</span>`;
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
                                var country = document.querySelector('#country .selected').innerText;
                                var type = document.querySelector('#type .selected').innerText;
                                var time = document.querySelector('#time .selected').innerText;
                                var sort = document.querySelector('#sort .selected').innerText;
                                useXhr(xhr,id,country,type,time,sort);
                            }
                        }else{
                            alert('服务器返回值为false');
                        }
                    }else{
                        //alert("获取服务器数据失败：" + xhr.status);
                    }
                }
            };
            xhr.open("post","./text/movie_list.txt",true);
            xhr.send(`id=${id}&country=${country}&type=${type}&time=${time}&sort=${sort}&name=${name}`);     
        }
        //var current = document.getElementsByClassName('current')[0].innerText;
        
    });    
}else{
    window.location.href = 'login.html';
}
