var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 670;
canvas.height = 600;

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const modalEl = document.querySelector('#modalEl');
const givePermissionBtn = document.querySelector('#givePermissionBtn');

var panelX = 300;
var panelY = 590;
var panelWidth = 250;
var panelHeight = 20;
var panelSpeed = 8;

var ballRadius = 7;
var BALL_RADIUS = 8;
var ballX = 350;
var ballY = 550;
var speedY = -3;
var speedX = 3;
var ballAngle = 0;

var rows = 12;
var cols = 10;

var brickHeight = 20;
var brickWidth = 60;
var brickPadding = 5;
var brickTopOffset = 65;
var brickLeftOffset = 25;

var score = 0;
var stop = 0;
var dzialko = 0;
var executedTimer = false;
let bullets = [];

var x = 0;
var y = 0;
var z = 0;

var keys = {};
var bricks = {};

function init() {
    panelX = 300;
    panelY = 590;
    panelWidth = 250;
    panelHeight = 20;
    panelSpeed = 8;

    ballRadius = 7;
    BALL_RADIUS = 8;
    ballX = 350;
    ballY = 550;
    speedY = -3;
    speedX = 3;
    ballAngle = 0;

    rows = 12;
    cols = 10;

    brickHeight = 20;
    brickWidth = 60;
    brickPadding = 5;
    brickTopOffset = 65;
    brickLeftOffset = 25;

    score = 0;
    stop = 0;
    dzialko = 0;
    executedTimer = false;
    bullets = [];

    x = 0;
    y = 0;
    z = 0;

    keys = {};
    bricks = {};

    for (i = 0; i < cols; i++) {
        bricks[i] = {};
        for (j = 0; j < rows; j++) {
            if(j == 10) {
                bricks[i][j] = { x: 0, y: 0, status: 1, isspecial: 1}
            } else {
                bricks[i][j] = { x: 0, y: 0, status: 1, isspecial: 0}
            }
        }
    }

    
    
    for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
            if(i == 0 && j == 10 || i == 1 && j == 10 || i == 2 && j == 10 || i == 3 && j == 10 || i == 4 && j == 10
                || i == 5 && j == 10 || i == 6 && j == 10 || i == 7 && j == 10 || i == 8 && j == 10 || i == 9 && j == 10) {
                bricks[i][j].color = 'rgb(' + 0 + ',' + 0 + ',' + 0 + ')';
            } else {
                bricks[i][j].color = 'rgb(' + Math.floor(Math.random() * 256) + ',' + 
                Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
            }
        }
    }
}

for (i = 0; i < cols; i++) {
    bricks[i] = {};
    for (j = 0; j < rows; j++) {
        if(j == 10) {
            bricks[i][j] = { x: 0, y: 0, status: 1, isspecial: 1}
        } else {
            bricks[i][j] = { x: 0, y: 0, status: 1, isspecial: 0}
        }
    }
}

for (i = 0; i < cols; i++) {
    for (j = 0; j < rows; j++) {
        if(i == 0 && j == 10 || i == 1 && j == 10 || i == 2 && j == 10 || i == 3 && j == 10 || i == 4 && j == 10
            || i == 5 && j == 10 || i == 6 && j == 10 || i == 7 && j == 10 || i == 8 && j == 10 || i == 9 && j == 10) {
            bricks[i][j].color = 'rgb(' + 0 + ',' + 0 + ',' + 0 + ')';
        } else {
            bricks[i][j].color = 'rgb(' + Math.floor(Math.random() * 256) + ',' + 
            Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
        }
    }
}

window.addEventListener('keydown', function (e) {
    let key = event.which
    keys[e.keyCode] = true;
    e.preventDefault();

    if(key === 32 && dzialko == 1) {
        // SPACJA - Strzelanie
        bulletsPush();
}
});

window.addEventListener('touchstart', process_touchstart, false);

function process_touchstart(e){
    if(dzialko == 1) {
        bulletsPush();
    }
}

window.addEventListener('keyup', function (e) {
    delete keys[e.keyCode];
});

function bulletsPush() {
    bullets.push({  x: panelX-8, y: panelY-50 });
    bullets.push({  x: panelX+196, y: panelY-50 });
}

function DrawBullets(){
    for (let i in bullets) {
        if (bullets.hasOwnProperty(i)) {
          var image = document.getElementById("bullet");
          ctx.drawImage(image, bullets[i].x, bullets[i].y);
        }
    }
}

function MoveBullets(){
    for (let i in bullets) {
        if (bullets.hasOwnProperty(i)) {
            bullets[i].y -= 7;
        }
    }
}

function bulletHitBrick() {
    for (let i in bullets) {
        if (bullets.hasOwnProperty(i)){
            for (c = 0; c < cols; c++) {
                for (r = 0; r < rows; r++) {
                    var b = bricks[c][r];
                    if (b.status == 1) {
                        if (bullets[i].x+20 > b.x && bullets[i].x+20 < b.x + brickWidth &&
                            bullets[i].y > b.y && bullets[i].y < b.y + brickHeight) {
                            b.status = 0;
                            score++;
                            scoreEl.innerHTML = score;
                            bullets[i].x = 1000;
                        }
                    }
                }
            }
        }
    }
}

function collisionDetection() {
    for (c = 0; c < cols; c++) {
        for (r = 0; r < rows; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (ballX + BALL_RADIUS > b.x && ballX - BALL_RADIUS < b.x + brickWidth &&
                     ballY + BALL_RADIUS > b.y && ballY - BALL_RADIUS < b.y + brickHeight) {
                    speedY = -speedY;
                    b.status = 0;
                    score++;
                    scoreEl.innerHTML = score;
                    if(b.isspecial == 1) {
                        dzialko = 1;
                        timerStart();
                    }
                }
            }
        }
    }
}

function drawBricks() {
    for (c = 0; c < cols; c++) {
        for (r = 0; r < rows; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickLeftOffset;
                var brickY = (r * (brickHeight + brickPadding)) + brickTopOffset;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPanel() {
    ctx.beginPath();
    ctx.rect(panelX, panelY, panelWidth, panelHeight);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, BALL_RADIUS);
    ctx.fillStyle = "darkblue";
    ctx.fill();
    ctx.closePath();
}

function ballPaddleCollision(){
    if(ballX < panelX + panelWidth && ballX > panelX && panelY < panelY + panelHeight && ballY > panelY){
        ballAngle = ((panelX + panelWidth / 2) - ballX) * 0.05;
        speedX = speedX + ballAngle;
        speedY = -speedY;
    }
}

window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(e) {
    x = e.gamma; // range [-90,90], left-right
    y = e.beta;  // range [-180,180], top-bottom
    z = e.alpha; // range [0,360], up-down
    
    if(window.innerHeight < window.innerWidth){
        if (y > 0 && panelX + panelWidth < canvas.width) { 
            panelX += y*0.15;
        } else if(y < 0 && panelX > 0){
            panelX += y*0.15;
        }
    } else {
        if (x > 0 && panelX + panelWidth < canvas.width) { 
            panelX += x*0.35;
        }
        else if(x < 0 && panelX > 0) {
            panelX += x*0.35;
        }
    }
}

function timerStart() {
    date1  = new Date();
    executedTimer = true;
  }
  
  function timerCheck() {
    var date2  = new Date();
    dateDiff = Math.abs(date1 - date2);
    if(dateDiff >= 2000) {
        date1 = date2;
        dzialko = 0;
    }
  }

  function drawDzialko() {
    ctx.beginPath();
    ctx.rect(panelX, panelY-40, 30, 50);
    ctx.rect(panelX+220, panelY-40, 30, 50);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  }


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Arial";
    ctx.fillStyle = "red";
    ctx.fillText('Score : '+score, canvas.width/2-40, 50);

        // Game over
    if(ballY >= 600){
        cancelAnimationFrame(game);
        modalEl.style.display = 'flex';
        stop = 1;
    } 
    
    DrawBullets();
    MoveBullets();
    bulletHitBrick();
    drawBricks();
    drawPanel();
    drawBall();
    collisionDetection();
    ballPaddleCollision();
    if(dzialko == 1) { 
        timerCheck();   
        if(dateDiff <= 2000) {
            drawDzialko();
        }
    }

    if(ballX + speedX > canvas.width-ballRadius || ballX + speedX < ballRadius) {
        speedX = -speedX;
    }
    
    if (37 in keys) {
        if (panelX - panelSpeed > 0) {
            panelX -= panelSpeed;
        }
    } 
    else if (39 in keys) {
        if (panelX + panelWidth + panelSpeed < canvas.width) {
            panelX += panelSpeed;
        }
    }

    ballX += speedX;
    ballY += speedY;
}

function game() {
    if( stop == 1) return;
    draw();
    window.requestAnimationFrame(game);
}

startGameBtn.addEventListener('click', () => {
    init();
    game();
    givePermissionBtn.style.display = 'none';
    modalEl.style.display = 'none';
})