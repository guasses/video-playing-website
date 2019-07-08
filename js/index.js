if(CookieUtil.get('name')){
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

        var current = document.getElementsByClassName('current')[0].innerText;
        var movie_list = document.getElementById('movie_list');
        var xhr = new XMLHttpRequest();
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

                    var list = document.querySelectorAll('.cover');
                    list.forEach((item,index) => {
                        item.addEventListener('click',function(event){
                            var text = item.getElementsByTagName('span')[1].innerText;
                            window.location.href = encodeURI("play.html?data="+text);
                        });
                    });  
                }else{
                    alert("XHR接收数据失败：" + xhr.status);
                }
            }
        };
        xhr.open("post","./text/movie_list.txt",true);
        xhr.send(current);  
    });    
}else{
    window.location.href = 'login.html';
}
