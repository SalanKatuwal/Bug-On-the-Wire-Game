import { Wires } from "./wire.js";
import { InputHandler } from "./input_handler.js";
import { Bug } from "./bug.js";
import { Crow } from "./crow.js";
import { Background } from "./background.js";
export let myCanva = document.querySelector("canvas");
export let ctx = myCanva.getContext('2d');
myCanva.height = innerHeight;
myCanva.width = innerWidth;
export let crows;
export let gameOver;
export let score;
// used for delta time calculation and it is set only once even after game restarts 
export let lastTime = 0;
export let enemyTimer;
export let enemyInterval;
export const backgroundAudio = document.getElementById("audio");
export let restartBtn = document.getElementById("restart");
export let game_Over = document.getElementsByClassName("game_over")[0];
export let highScore = document.getElementById('highScore');
export let powerUpDetail = document.getElementById("powerUp");
// game restart
restartBtn.onclick = () => {
    game_Over.style.display = "none";
    startGame();
}
export var bonusScore;
export let canMove;
export let input;
export let wiresPos;
export let wires;
export let bug;
export let background;
export let startTime;
// export let crowXIndex;
// width between crows
// export let crowSpacing; 
export let powerUp;
export let powerUpTimer;
export let powerX;
export let powerUpInterval;

export function startGame() {
    crows = [];
    startGame.gameOver = false;
    score = 0;
    canMove = true;
    // crowXIndex = 1;
    // power up active flag
    powerUp = false;
    // red shield ball position
    powerX = 3000;
    powerUpTimer = 0;
    startGame.bonusScore = 0;
    // crowSpacing = 300;
    startTime = Date.now();
    enemyTimer = 0;
    enemyInterval = 1500;
    input = new InputHandler();
    wiresPos = [400, 500, 600];
    wires = new Wires();
    bug = new Bug();
    backgroundAudio.play();
    background = new Background(myCanva.width, myCanva.height);
    animate(0);
}

startGame();


function displayScore(ctx) {
    ctx.fillStyle = 'Red';
    ctx.font = '40px Airal';
    ctx.fillText('Score: ' + Math.floor(score), 5, 50);
}

function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval) {
        crows.push(new Crow(myCanva.width, myCanva.height));
        enemyTimer = 0;
        if (score > 10) {
            // spwan new crow in the inertval of 700ms
            enemyInterval = 700;
        }
        if (score > 25) {
            // spwan new crow in the inertval of 500ms
            enemyInterval = 500;
        }
        if (score > 30) {
            // spwan new crow in the inertval of 400ms
            enemyInterval = 400;
        }
        if (score > 80) {
            // spwan new crow in the inertval of 200ms
            enemyInterval = 200;
        }
    }
    else {
        enemyTimer += deltaTime;
    }
    crows.forEach(crow => {
        crow.draw(ctx);
        crow.update(input, deltaTime);
    });
    crows = crows.filter(crow => !crow.deleteCrow);
}

function playAudio() {
    backgroundAudio.volume = 0.5;
    // play background audio and stop after gameover
    backgroundAudio.play();
}

window.addEventListener("keydown", playAudio);
function pauseAudio() {
    if (startGame.gameOver) {
        window.removeEventListener("keydown", playAudio);
        backgroundAudio.pause();
    }
}

function game_over() {
    if (startGame.gameOver) {
        // get the highscore from the local storage if not 0 is returned
        let highscore = localStorage.getItem("highscore") || 0;
        if (score > highscore) {
            highscore = Math.floor(score);
            // if currentscrore is greater then highscore set new high score
            localStorage.setItem("highscore", highscore);
        }
        let span1 = document.getElementById("score");
        span1.innerHTML = Math.floor(score);
        highScore.style.color = "red";
        highScore.innerHTML = highscore;
        game_Over.style.display = "flex";
    }

}

// handle the shield logic
function powerUps(bug) {
    if (score > 50) {
        ctx.beginPath();
        ctx.arc(powerX, 375, 20, 0, Math.PI * 2, false);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        powerX -= 30;
        ctx.stroke();
        if (bug.bugY + 40 == 375) {
            let radius = bug.width / 2;
            const dx = powerX - bug.bugX;
            const dy = 0;
            const distance = Math.hypot(dx, dy);
            if (distance < radius + 20) {
                powerUp = true;
                powerUpTimer = Date.now();
                // activate shield for 5 seconds
                powerUpInterval = powerUpTimer + 5000;
                // display powerUp activate notice
                powerUpDetail.style.display = "inline";
                powerUpDetail.innerHTML = "PowerUp Activated for 5 seconds";
            }
        }
        if (Date.now() > powerUpInterval) {
            powerUp = false;
            // remove notice after powerUp ends
            powerUpDetail.style.display = "none";
        }
    }

}

//main game loop
function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    // clear the canvas 
    ctx.clearRect(0, 0, myCanva.width, myCanva.height);

    // draw and update everything
    background.update(input);
    background.draw(ctx);
    wires.drawWires(ctx, wiresPos);
    bug.update(ctx, input, crows, deltaTime), gameOver;
    bug.draw(ctx), gameOver;
    powerUps(bug);
    handleEnemies(deltaTime);
    displayScore(ctx);
    pauseAudio();
    game_over();

    // run the animate function again if gameOver equlas to true otherwise stop the game
    if (!startGame.gameOver) {
        score = (Date.now() - startTime) / 1000 + startGame.bonusScore;
        requestAnimationFrame(animate);
    }
}