(function(){
    let canvas = document.createElement('canvas');
    canvas.classList.add('snake');
    let ctx = canvas.getContext('2d');
    let w, h,
        menu = document.querySelector('.menu'),
        properties = {
            gameSpeed: 0.17,
            cellSize: 0,
            cellW: 10,
            cellH: 10,
            border: 5,
            cellColor1: 'rgba(10,10,10,0.2)',
            cellColor2: 'rgba(0,0,0,0.5)',
            snakeColor: '#55ff55',
            img: new Image()
        },
        snakeImg = new Image(),
        snakeBody,
        dirX, dirY, dirDone,
        fruit = {
            img: new Image(),
            x: 0,
            y: 0
        },
        time,
        score,
        menuOpen = false,
        menuOption,
        ID,
        detectingTouch = false,
        touch, touchstartX, touchstartY, touchendX, touchendY, dtTouch,
        startedTouch = false,
        pause;
    
    document.querySelector('section').appendChild(canvas);
    
    function sizeCalc(){
        w = document.documentElement.clientWidth,
        h = document.documentElement.clientHeight;
        w -= w/100*properties.border;
        h -= h/100*properties.border;
        if(w > h){
            properties.cellSize = h / properties.cellH;
            w = h;
            canvas.height = h;
            canvas.width = h;
        }
        else{
            properties.cellSize = w / properties.cellW;
            h = w;
            canvas.height = w;
            canvas.width = w;
        } 
    }
    
    window.addEventListener('resize', () => {
        sizeCalc();
    });
    
    window.addEventListener('touchstart', (event) => {
       if (event.touches.length != 1 || startedTouch)return;
        detectingTouch = true;
        touch = event.changedTouches[0];
        touchstartX = touch.pageX;
        touchstartY = touch.pageY;
        startedTouch = true;
    });
    
    window.addEventListener('touchmove', (event) => {
       if (!startedTouch && !detectingTouch)return;
    });
    
    window.addEventListener('touchend', (event) => { 
        if(!startedTouch)return;
        
        touch = event.changedTouches[0];
        touchendX = touch.pageX;
        touchendY = touch.pageY;
        if(Math.abs(touchstartX - touchendX) >= Math.abs(touchstartY - touchendY)){
        if(touchstartX - touchendX < 0){
        if(dirX === 0 && !dirDone){
        dirX = 1;
        dirY = 0;
        dirDone = true;
        }
        }else{
        if(dirX === 0 && !dirDone){
        dirX = -1;
        dirY = 0;
        dirDone = true;
        }
        }   
        }else{
        if(touchstartY - touchendY < 0){
        if(dirY === 0 && !dirDone){
        dirX = 0;
        dirY = 1;
        dirDone = true;
        }
        }else{
        if(dirY === 0 && !dirDone){
        dirX = 0;
        dirY = -1;
        dirDone = true;
        }
        }                 
        }
        startedTouch = false;
        detectingTouch = false;
    });
    
    window.addEventListener('keydown', (event) => {
        switch(event.keyCode){
            case 37 : {
                if(dirX === 0 && !dirDone){
                dirX = -1;
                dirY = 0;
                dirDone = true;
                }
            };
                break;
            case 38 : {
                if(dirY === 0 && !dirDone){
                dirX = 0;
                dirY = -1;
                dirDone = true;
                }
            };
                break;
            case 39 : {
                if(dirX === 0 && !dirDone){
                dirX = 1;
                dirY = 0;
                dirDone = true;
                }
            };
                break;
            case 40 : {
                if(dirY === 0 && !dirDone){
                dirX = 0;
                dirY = 1;
                dirDone = true;
                }
            };
                break;
            case 27:{
                if(menuOpen === true){
                    pause = false;
                    menuOpen = false;
                    loop();
                }else{
                    pause = true;
                    menuOpen = true;
                    menuOption = 'menu';   
                } 
                Menu();
            }
                break;
        }
    });
    
    
    function reDrawFruit(){
        ctx.drawImage(fruit.img,0,0,128,128,fruit.x*properties.cellSize,fruit.y*properties.cellSize,properties.cellSize,properties.cellSize);
    }
    
    function reDrawSnake(){
        for(let i = 1; i < snakeBody.length; i++){
            ctx.drawImage(snakeImg,0,0,128,128,snakeBody[i].x*properties.cellSize,snakeBody[i].y*properties.cellSize,properties.cellSize,properties.cellSize)
        }   
        if(dirX === 0 && dirY === 0){
         ctx.drawImage(snakeBody[0].img[0], 0, 0, 128, 148,snakeBody[0].x*properties.cellSize,snakeBody[0].y*properties.cellSize,properties.cellSize,properties.cellSize);
        }
        if(dirX === 1){
        ctx.drawImage(snakeBody[0].img[1], 0, 0, 148, 128,snakeBody[0].x*properties.cellSize,snakeBody[0].y*properties.cellSize,properties.cellSize,properties.cellSize);
        }
        if(dirX === -1){
        ctx.drawImage(snakeBody[0].img[3], 0, 0, 148, 128,snakeBody[0].x*properties.cellSize,snakeBody[0].y*properties.cellSize,properties.cellSize,properties.cellSize);
        }
        if(dirY === 1){
        ctx.drawImage(snakeBody[0].img[2], 0, 0, 128, 148,snakeBody[0].x*properties.cellSize,snakeBody[0].y*properties.cellSize,properties.cellSize,properties.cellSize);
        }
        if(dirY === -1){
        ctx.drawImage(snakeBody[0].img[0], 0, 0, 128, 148,snakeBody[0].x*properties.cellSize,snakeBody[0].y*properties.cellSize,properties.cellSize,properties.cellSize);
        }
        
    }
    
    function reDrawBackground(){
        ctx.drawImage(properties.img, 0, 0 , w, h);
        for(let i = 0; i < properties.cellH; i++)
            for(let j = 0; j < properties.cellW; j++){
                ctx.fillStyle = (i+j) % 2 ===0 ?  properties.cellColor1 : properties.cellColor2;
                ctx.fillRect(j*properties.cellSize,i*properties.cellSize,properties.cellSize,properties.cellSize);
            }
    }
    
    function Menu(){
        let text = document.querySelector('#text');
        if(menuOption === 'gameover')text.innerHTML = `Конец игры <br> Счёт:${score}`;
        if(menuOption === 'menu')text.innerHTML = "Пауза";
        menu.style.height = `${h}px`;
        menu.style.width = `${w}px`;
        menu.style.display = menuOpen ? "flex" : 'none';
        menuOpen ? cancelAnimationFrame(ID): '';
    }
    
    document.querySelector('#again').addEventListener('click',init);
    
    function render(){
        reDrawBackground();
        reDrawFruit();
        reDrawSnake();
    }
    
    function generateFruit(){
            fruit.x =  Math.round(Math.random()*(properties.cellW-1));
            fruit.y =  Math.round(Math.random()*(properties.cellH-1));
            for(let i = 0; i < snakeBody.length; i++){
                if(fruit.x === snakeBody[i].x && fruit.y === snakeBody[i].y){
                    generateFruit();
                    break;
                }
            }
    }
    
    function moveBody(){
        for(let i = snakeBody.length-1; i >= 1; i--){
            snakeBody[i].x = snakeBody[i-1].x;
            snakeBody[i].y = snakeBody[i-1].y;
        }
    }
    
    function moveHead(){
        if(snakeBody[0].x + dirX > properties.cellW-1)snakeBody[0].x = 0;
        else if(snakeBody[0].x + dirX < 0)snakeBody[0].x = properties.cellW-1;
        else if(snakeBody[0].y + dirY > properties.cellH-1)snakeBody[0].y = 0;
        else if(snakeBody[0].y + dirY < 0)snakeBody[0].y = properties.cellH-1;
        else{     
        snakeBody[0].x += dirX;
        snakeBody[0].y += dirY;
        }
    }
    
    function colisionFruit(){
        if(fruit.x === snakeBody[0].x && fruit.y ===  snakeBody[0].y){
            snakeBody.push({
                img: new Image(),
                x: snakeBody[snakeBody.length-1].x,
                y: snakeBody[snakeBody.length-1].y
            });
            if(score === snakeBody.length-2)score++;
            generateFruit();
        }
    }
    
    function colisionBody(){
        for(let i = 1; i < snakeBody.length; i++){
            if(snakeBody[0].x === snakeBody[i].x && snakeBody[0].y === snakeBody[i].y){
                menuOpen = true;
                menuOption = 'gameover';
                Menu();
                break;
            }
        }
    }
    
    function update(){
        moveBody();
        moveHead();
        colisionBody();
        colisionFruit();
        dirDone = false;
    }
    
    function loop(){
        if(!(pause) && !(menuOpen)){
            ID = requestAnimationFrame(loop);
        }
        time += properties.gameSpeed;
        if(time >= 1){
            update();
            time = 0;
        }
        render();
    }
    
    function init(){
        snakeImg.src = 'sprites/shield.png';
        properties.img.src = 'sprites/background.jpg';
        menu.style.display = 'none';
        menuOpen = pause = dirDone = false;
        dirX = dirY = score = time = 0;
        snakeBody = [{
            img: [new Image(),new Image(),new Image(),new Image()],
            x: 0,
            y: 0
        }];
        sizeCalc();
        snakeBody[0].img[0].src = 'sprites/head-up.png';
        snakeBody[0].img[1].src = 'sprites/head-right.png';
        snakeBody[0].img[2].src = 'sprites/head-down.png';
        snakeBody[0].img[3].src = 'sprites/head-left.png';
        x = snakeBody[0].x = Math.round(Math.random()*properties.cellW-1);
        y = snakeBody[0].y = Math.round(Math.random()*properties.cellH-1);
        fruit.img.src = 'sprites/sheep.png';
        generateFruit();
        loop();
    }
    
    init();

    
})();