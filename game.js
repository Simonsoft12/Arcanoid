var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 670;
canvas.height = 600;

var panelX = 300;
var panelY = 590;
var panelWidth = 300;
var panelHeight = 20;
var panelSpeed = 8;

var ballRadius = 7;
const BALL_RADIUS = 8;
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

var x = 0;
var y = 0;
var z = 0;

var keys = {};
var bricks = {};

for (i = 0; i < cols; i++) {
    bricks[i] = {};
    for (j = 0; j < rows; j++) {
        bricks[i][j] = { x: 0, y: 0, status: 1}
    }
}

for (i = 0; i < cols; i++) {
    for (j = 0; j < rows; j++) {
        bricks[i][j].color = 'rgb(' + Math.floor(Math.random() * 256) + ',' + 
        Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
    }
}

window.addEventListener('keydown', function (e) {
    keys[e.keyCode] = true;
    e.preventDefault();
});

window.addEventListener('keyup', function (e) {
    delete keys[e.keyCode];
});

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
                }
            }
        }
    }
}
window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(e) {
    x = e.gamma; // range [-90,90], left-right
    y = e.beta;  // range [-180,180], top-bottom
    z = e.alpha; // range [0,360], up-down
    
    if(window.innerHeight < window.innerWidth){
        if (y > 0 && panelX + panelWidth < canvas.height) { 
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



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Arial";
    ctx.fillStyle = "red";
    ctx.fillText('Score : '+score, canvas.width/2-40, 50);

    drawBricks();
    drawPanel();
    drawBall();
    collisionDetection();
    ballPaddleCollision();
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
    draw();
    window.requestAnimationFrame(game);
}
game();