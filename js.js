(function(){
    let canvas = document.querySelector('.snake');
    let ctx = canvas.getContext('2d');
    let w, h,
        size,
        snakeBody,
        dirX, dirY, dirDone,
        fruit = {
            x: 0,
            y: 0
        },
        time,
        score,
        gameOver,
        ID,
        pause;
    
    function sizeCalc(){
        w = document.documentElement.clientWidth,
        h = document.documentElement.clientHeight;
        w -= w/10;
        h -= h/10;
        if(w > h){
            size = h / 11;
            canvas.height = h;
            canvas.width = h;
        }
        else{
           size = w / 11; 
            canvas.height = w;
            canvas.width = w;
        } 
    }
    
    window.addEventListener('resize', () => {
        sizeCalc();
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
        }
    });
    
    
    function reDrawFruit(){
        ctx.fillStyle = "#F00";
        ctx.beginPath();
         ctx.arc(fruit.x*size+size/2, fruit.y*size+size/2,size/2,0,Math.PI*2);
         ctx.fill();
    }
    
    function reDrawSnake(){
        for(let i = 1; i < snakeBody.length; i++){
            ctx.fillStyle = '#990099'; 
            ctx.beginPath();
            ctx.arc(snakeBody[i].x*size+size/2, snakeBody[i].y*size+size/2,size/3,0,Math.PI*2);
            ctx.fill();
        }   
        ctx.fillStyle = "#E0E"; 
        ctx.beginPath();
        ctx.arc(snakeBody[0].x*size+size/2, snakeBody[0].y*size+size/2,size/2,0,Math.PI*2);
        ctx.fill();
    }
    
    function reDrawBackground(){
        for(let i = 0; i < 10; i++)
            for(let j = 0; j < 10; j++){
                ctx.fillStyle = (i+j) % 2 ===0 ?  "#229922" : "#33DD33";
                ctx.fillRect(j*size,i*size,size,size);
            }
        ctx.fillStyle = "#117711";
        ctx.fillRect(0,10*size,size*11,size);
        ctx.fillRect(size*10, 0, size, size*11);
        ctx.fillStyle = "#EEEE00";
        ctx.fillRect(0,10*size,size*10+size/10,size/10);
        ctx.fillRect(size*10, 0, size/10,size*10+size/10);
        ctx.fillStyle = "#fff";
        ctx.textBaseline = "center";
        ctx.font = `italic ${size/2}pt Arial`;
        ctx.fillText(`Score: ${snakeBody.length-1} Max score: ${score}`, size/2, size*11-size/4);
    }
    
    function reDrawGameOver(bool){
        document.querySelector('.gameOver').style.display = bool ? "flex" : 'none';
        bool ? cancelAnimationFrame(ID): '';
    }
    
    document.querySelector('#again').addEventListener('click',init);
    
    function render(){
        reDrawBackground();
        reDrawFruit();
        reDrawSnake();
        reDrawGameOver(gameOver);
    }
    
    function generateFruit(){
            fruit.x =  Math.round(Math.random()*9);
            fruit.y =  Math.round(Math.random()*9);
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
        if(snakeBody[0].x + dirX > 9)snakeBody[0].x = 0;
        else if(snakeBody[0].x + dirX < 0)snakeBody[0].x = 9;
        else if(snakeBody[0].y + dirY > 9)snakeBody[0].y = 0;
        else if(snakeBody[0].y + dirY < 0)snakeBody[0].y = 9;
        else{     

        snakeBody[0].x += dirX;
        snakeBody[0].y += dirY;
        
        }
    }
    
    function colisionFruit(){
        if(fruit.x === snakeBody[0].x && fruit.y ===  snakeBody[0].y){
            snakeBody.push({
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
                gameOver = true;
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
        if(!(pause) && !(gameOver)){
            ID = requestAnimationFrame(loop);
        }
        time += 0.17;
        console.log();
        if(time >= 1){
            update();
            time = 0;
        }
        render();
    }
    
    function init(){
        gameOver = pause = dirDone = false;
        dirX = dirY = score = time = 0;
        snakeBody = [{
            x: 0,
            y: 0
        }];
        sizeCalc();
        x = snakeBody[0].x = Math.round(Math.random()*9);
        y = snakeBody[0].y = Math.round(Math.random()*9);
        generateFruit();
        loop();
    }
    
    init();
    
})();