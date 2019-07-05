if(CookieUtil.get('name')){
    window.location.href = 'index.html';
}else{
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
                var dlXhr = new XMLHttpRequest();
                dlXhr.onreadystatechange = function(){
                    if(dlXhr.readyState == 4){
                        if((dlXhr.status >= 200 && dlXhr.status < 300) || dlXhr.status == 304){
                            if(Number(dlXhr.responseText)){
                                CookieUtil.set("name",name);
                                window.location.href = "index.html";
                            }else{
                                tip.innerText = "用户名或密码不正确！";
                                tip.style.visibility = "visible";
                            }
                        }else{
                            alert("XHR接收数据失败：" + dlXhr.status);
                        }
                    }
                };
                dlXhr.open("post","./text/users.txt",true);
                //xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                dlXhr.send("dl_name="+name+"&dl_password="+passwd);
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
                xhr.open("post","./text/zc.txt",true);
                //xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                xhr.send("zc_name="+name+"&zc_password="+passwd+"&zc_reason="+reason);
            }
              
        },false);
        class Vector2 {
            constructor(x = 0, y = 0) {
                this.x = x;
                this.y = y;
            }
            
            add(v) {
                this.x += v.x;
                this.y += v.y;
                return this;
            }
            
            multiplyScalar(s) {
                this.x *= s;
                this.y *= s;
                return this;
            }
            
            clone() {
                return new Vector2(this.x, this.y);
            }
        }
        
        class Time {
            constructor() {
                const now = Time.now();
                
                this.delta = 0;
                this.elapsed = 0;
                this.start = now;
                this.previous = now;
            }
            
            update() {
                const now = Time.now();
                
                this.delta = now - this.previous;
                this.elapsed = now - this.start;
                this.previous = now;
            }
            
            static now() {
                return Date.now() / 1000;
            }
        }
        
        class Particle {
            constructor(position, velocity = new Vector2, color = 'white', radius = 1, lifetime = 1, mass = 1) {
                this.position = position;
                this.velocity = velocity;
                this.color = color;
                this.radius = radius;
                this.lifetime = lifetime;
                this.mass = mass;
                
                this.isInCanvas = true;
                this.createdOn = Time.now();
            }
            
            update(time) {
                if (!this.getRemainingLifetime()) {
                    return;
                }
                
                this.velocity.add(Particle.GRAVITATION.clone().multiplyScalar(this.mass));
                this.position.add(this.velocity.clone().multiplyScalar(time.delta));
            }
            
            render(canvas, context) {
                const remainingLifetime = this.getRemainingLifetime();
                
                if (!remainingLifetime) return;
                
                const radius = this.radius * remainingLifetime;
                
                context.globalAlpha = remainingLifetime;
                context.globalCompositeOperation = 'lighter';
                context.fillStyle = this.color;
                
                context.beginPath();
                context.arc(this.position.x, this.position.y, radius, 0, Math.PI * 2);
                context.fill();
            }
            
            getRemainingLifetime() {
                const elapsedLifetime = Time.now() - this.createdOn;
                return Math.max(0, this.lifetime - elapsedLifetime) / this.lifetime;
            }
        }
        
        Particle.GRAVITATION = new Vector2(0, 9.81);
        
        class Trail extends Particle {
            constructor(childFactory, position, velocity = new Vector2, lifetime = 1, mass = 1) {
                super(position, velocity);
                
                this.childFactory = childFactory;
                this.children = [];
                this.lifetime = lifetime;
                this.mass = mass;
                
                this.isAlive = true;
            }
            
            update(time) {
                super.update(time);
                
                // Add a new child on every frame
                if (this.isAlive && this.getRemainingLifetime()) {
                    this.children.push(this.childFactory(this));
                }
                
                // Remove particles that are dead
                this.children = this.children.filter(function(child) {
                    if (child instanceof Trail) {
                        return child.isAlive;
                    }
                    
                    return child.getRemainingLifetime();
                });
                
                // Kill trail if all particles fade away
                if (!this.children.length) {
                    this.isAlive = false;
                }
                
                // Update particles
                this.children.forEach(function(child) {
                    child.update(time);
                });
            }
            
            render(canvas, context) {
                // Render all children
                this.children.forEach(function(child) {
                    child.render(canvas, context);
                });
            }
        }
        
        class Rocket extends Trail {
            constructor(childFactory, explosionFactory, position, velocity = new Vector2) {
                super(childFactory, position, velocity);
                
                this.explosionFactory = explosionFactory;
                this.lifetime = 10;
            }
            
            update(time) {
                if (this.getRemainingLifetime() && this.velocity.y > 0) {
                    this.explosionFactory(this);
                    this.lifetime = 0;
                }
                
                super.update(time);
            }
        }
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const time = new Time;
        let rockets = [];
        
        const getTrustParticleFactory = function(baseHue) {
            function getColor() {
                const hue = Math.floor(Math.random() * 15 + 30);
                return `hsl(${hue}, 100%, 75%`;
            }
            
            return function(parent) {
                const position = this.position.clone();
                const velocity = this.velocity.clone().multiplyScalar(-.1);
                velocity.x += (Math.random() - .5) * 8;
                const color = getColor();
                const radius = 1 + Math.random();
                const lifetime = .5 + Math.random() * .5;
                const mass = .01;
                
                return new Particle(position, velocity, color, radius, lifetime, mass);
            };
        };
        
        const getExplosionFactory = function(baseHue) {
            function getColor() {
                const hue = Math.floor(baseHue + Math.random() * 15) % 360;
                const lightness = Math.floor(Math.pow(Math.random(), 2) * 50 + 50);
                return `hsl(${hue}, 100%, ${lightness}%`;
            }
            
            function getChildFactory() {
                return function(parent) {
                    const direction = Math.random() * Math.PI * 2;
                    const force = 8;
                    const velocity = new Vector2(Math.cos(direction) * force, Math.sin(direction) * force);
                    const color = getColor();
                    const radius = 1 + Math.random();
                    const lifetime = 1;
                    const mass = .1;
        
                    return new Particle(parent.position.clone(), velocity, color, radius, lifetime, mass);
                };
            }
            
            function getTrail(position) {
                const direction = Math.random() * Math.PI * 2;
                const force = Math.random() * 128;
                const velocity = new Vector2(Math.cos(direction) * force, Math.sin(direction) * force);
                const lifetime = .5 + Math.random();
                const mass = .075;
        
                return new Trail(getChildFactory(), position, velocity, lifetime, mass);
            }
            
            return function(parent) {
                let trails = 32;
                while (trails--) {
                    parent.children.push(getTrail(parent.position.clone()));
                }
            };
        };
        
        const addRocket = function() {
            const trustParticleFactory = getTrustParticleFactory();
            const explosionFactory = getExplosionFactory(Math.random() * 360);
            
            const position = new Vector2(Math.random() * canvas.width, canvas.height);
            const thrust = window.innerHeight * .75;
            const angle = Math.PI / -2 + (Math.random() - .5) * Math.PI / 8;
            const velocity = new Vector2(Math.cos(angle) * thrust, Math.sin(angle) * thrust);
            const lifetime = 3;
            
            rockets.push(new Rocket(trustParticleFactory, explosionFactory, position, velocity, lifetime));
            
            rockets = rockets.filter(function(rocket) {
                return rocket.isAlive;
            });
        };
        
        const render = function() {
            requestAnimationFrame(render);
            
            time.update();
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            rockets.forEach(function(rocket) {
                rocket.update(time);
                rocket.render(canvas, context);
            });
        };
        
        const resize = function() {
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
        };
        
        canvas.onclick = addRocket;
        document.body.appendChild(canvas);
        
        window.onresize = resize;
        resize();
        
        setInterval(addRocket, 2000);
        render();
    },false);
}