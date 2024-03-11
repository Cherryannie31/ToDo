function clickEffect() {
    let balls = [];  // 求数组
    let longPressed = false;  // 是否长按
    let longPress;  // 长按计时器
    let multiplier = 0;  // 倍率
    let width, height;  // 宽度&&高度
    let origin;  // 原点
    let normal;  // 法向量
    let ctx;  // 画布上下文

     // 颜色数组
    const colours = [
        "#F73859", 
        "#14FFEC", 
        "#00E0FF", 
        "#FF99FE", 
        "#FAF15D"
      ]; 

    // 创建画布元素
    const canvas = document.createElement("canvas");

    // 将画布添加到body
    document.body.appendChild(canvas);

    // 设置画布样式
    canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;");

    // 创建指针元素，并为其设计样式添加到body中
    const pointer = document.createElement("span");
    pointer.classList.add("pointer");
    document.body.appendChild(pointer);
 
    // 判断浏览器是否支持canvas和addElementListener
    if (canvas.getContext && window.addEventListener) {
      // 获取画布上下文
        ctx = canvas.getContext("2d");

        // 更新画布尺寸
        updateSize();

        // 监听窗口resize事件
        window.addEventListener('resize', updateSize, false);

        // 动画循环
        loop();

        // 监听鼠标摁下事件
        window.addEventListener("mousedown", function(e) {
            // 随机生成一定数量的小球 
            pushBalls(randBetween(5, 10), e.clientX, e.clientY);

            // 添加'is-pressed'类名
            document.body.classList.add("is-pressed");

            // 长按计时器
            longPress = setTimeout(function(){
                // 添加'is-longpressed'类名
                document.body.classList.add("is-longpress");
                // 设定长按状态为true
                longPressed = true;
            }, 500);
        }, false);

        // 监听鼠标抬起事件
        window.addEventListener("mouseup", function(e) {
            // 清除长按计时器
            clearInterval(longPress);
            if (longPressed == true) {
                // 移除'is-longpress'类名
                document.body.classList.remove("is-longpress");
                // 生成更多数量的球
                pushBalls(randBetween(50 + Math.ceil(multiplier), 100 + Math.ceil(multiplier)), e.clientX, e.clientY);
                // 重置长按状态
                longPressed = false;
            }
            // 移除'is-pressed'类名
            document.body.classList.remove("is-pressed");
        }, false);

        // 监听鼠标移动事件
        window.addEventListener("mousemove", function(e) {
            // 鼠标位置
            let x = e.clientX;
            let y = e.clientY;
            pointer.style.top = y + "px";
            pointer.style.left = x + "px";
        }, false);
    } else {
        console.log("canvas or addEventListener is unsupported!");
    }
 

    // 更新画布尺寸
    function updateSize() {
        // 设置画布的宽高
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        
        // 设置画布的css宽高 
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';

        // 缩放画布
        ctx.scale(2, 2);

        // 获取画布宽高
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);

        // 设置原点
        origin = {
          x: width / 2,
          y: height / 2
        };
        // 设置法向量
        normal = {
          x: width / 2,
          y: height / 2
        };
    }

    // 设置小球
    class Ball {
        constructor(x = origin.x, y = origin.y) {
            this.x = x;
            this.y = y;
            this.angle = Math.PI * 2 * Math.random();
            if (longPressed == true) {
              this.multiplier = randBetween(14 + multiplier, 15 + multiplier);
            } else {
              this.multiplier = randBetween(2, 3);
            }

            this.vx = (this.multiplier + Math.random() * 0.01) * Math.cos(this.angle);
            this.vy = (this.multiplier + Math.random() * 0.01) * Math.sin(this.angle);
            this.r = randBetween(2, 3) + 3 * Math.random();
            this.color = colours[Math.floor(Math.random() * colours.length)];
        }

        update() {
            this.x += this.vx - normal.x;
            this.y += this.vy - normal.y;
            normal.x = -2 / window.innerWidth * Math.sin(this.angle);
            normal.y = -2 / window.innerHeight * Math.cos(this.angle);
            this.r -= 0.3;
            this.vx *= 0.9;
            this.vy *= 0.9;
        }
    }
   
    function pushBalls(count = 1, x = origin.x, y = origin.y) {
        for (let i = 0; i < count; i++) {
            balls.push(new Ball(x, y));
        }
    }
   
    function randBetween(min, max) {
        return Math.floor(Math.random() * max) + min;
    }
   
    function loop() {
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < balls.length; i++) {
            let b = balls[i];
            if (b.r < 0) continue;
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
            ctx.fill();
            b.update();
        }
        if (longPressed == true) {
            multiplier += 0.2;
        } else if (!longPressed && multiplier >= 0) {
            multiplier -= 0.4;
        }
        removeBall();
        requestAnimationFrame(loop);
    }
   
    function removeBall() {
        for (let i = 0; i < balls.length; i++) {
            let b = balls[i];
            if (b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height || b.r < 0) {
                balls.splice(i, 1);
            }
        }
    }
}