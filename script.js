var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

var score = 0;
var bestScore = localStorage.getItem("bestScore") || 0;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var velocityX = 0;
var velocityY = 0;
var snakeBody = [];

var foodX;
var foodY;
var pulse = 1;
var pulseGrowing = true;

var gameOver = false;

// drawing helper - ponavljanje crtanja 
function drawRoundedRect(x, y, w, h, r) {
    context.beginPath();
    context.roundRect(x, y, w, h, r);
    context.fill();
    context.stroke();
}

function drawCircle(x, y, r) {
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fill();
}

window.onload = function () {
    document.getElementById("best").innerText = "Best: " + bestScore;

    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", changeDirection);

    setInterval(update, 100);
};

function update() {
    if (gameOver) return;

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    if (pulseGrowing) {
        pulse += 0.05;
        if (pulse > 1.3) pulseGrowing = false;
    } else {
        pulse -= 0.05;
        if (pulse < 1) pulseGrowing = true;
    }

    let foodGradient = context.createRadialGradient(
        foodX + blockSize / 2,
        foodY + blockSize / 2,
        2,
        foodX + blockSize / 2,
        foodY + blockSize / 2,
        12 * pulse
    );
    foodGradient.addColorStop(0, "yellow");
    foodGradient.addColorStop(1, "orange");

    context.fillStyle = foodGradient;
    drawCircle(foodX + blockSize / 2, foodY + blockSize / 2, blockSize / 2);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        score++;
        document.getElementById("score").innerText = "Score: " + score;

        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem("bestScore", bestScore);
            document.getElementById("best").innerText = "Best: " + bestScore;
        }

        placeFood();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    context.shadowColor = "rgba(0,255,0,0.5)";
    context.shadowBlur = 15;

    let headGrad = context.createLinearGradient(snakeX, snakeY, snakeX + blockSize, snakeY + blockSize);
    headGrad.addColorStop(0, "#33ff33");
    headGrad.addColorStop(1, "#009900");

    context.fillStyle = headGrad;
    context.strokeStyle = "#007700";
    context.lineWidth = 2;

    drawRoundedRect(snakeX, snakeY, blockSize, blockSize, 7);

    context.shadowBlur = 0;

    context.fillStyle = "white";
    drawCircle(snakeX + 6, snakeY + 6, 3);
    drawCircle(snakeX + blockSize - 6, snakeY + 6, 3);

    context.fillStyle = "black";
    drawCircle(snakeX + 6, snakeY + 6, 1.5);
    drawCircle(snakeX + blockSize - 6, snakeY + 6, 1.5);

    // tongue
    // context.fillStyle = "red";
    // context.fillRect(snakeX + blockSize / 2 - 1, snakeY + blockSize, 2, 6);

    for (let i = 0; i < snakeBody.length; i++) {
        let bx = snakeBody[i][0];
        let by = snakeBody[i][1];

        let bodyGrad = context.createLinearGradient(bx, by, bx + blockSize, by + blockSize);
        bodyGrad.addColorStop(0, "#66ff66");
        bodyGrad.addColorStop(1, "#008800");

        context.fillStyle = bodyGrad;
        context.strokeStyle = "#006600";
        context.lineWidth = 2;

        drawRoundedRect(bx, by, blockSize, blockSize, 7);
    }

    if (snakeX < 0) snakeX = (cols - 1) * blockSize;
    else if (snakeX >= cols * blockSize) snakeX = 0;

    if (snakeY < 0) snakeY = (rows - 1) * blockSize;
    else if (snakeY >= rows * blockSize) snakeY = 0;

    // if (snakeX < 0 || snakeX >= cols * blockSize || snakeY < 0 || snakeY >= rows * blockSize) {
    // endGame("Game Over! Udario si zid!");
    // }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            endGame("Game Over! Gricnuo si sebe!");
        }
    }
}

function endGame(message) {
    gameOver = true;

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
        document.getElementById("best").innerText = "Best: " + bestScore;
    }

    alert(message);
}

function changeDirection(e) {
    if (e.code === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}
