let myCanva = document.querySelector("canvas");
let ctx = myCanva.getContext('2d');
myCanva.height = innerHeight;
myCanva.width = innerWidth;
let crows;
let gameOver;
let score;
// used for delta time calculation and it is set only once even after game restarts 
let lastTime = 0; 
let enemyTimer;
let enemyInterval;
const backgroundAudio = document.getElementById("audio");
let restartBtn = document.getElementById("restart");
let game_Over = document.getElementsByClassName("game_over")[0];
let highScore = document.getElementById('highScore');
let powerUpDetail = document.getElementById("powerUp");

// game restart
restartBtn.onclick = () => {
    game_Over.style.display = "none";
    startGame();
}
let input;
let wiresPos;
let wires;
let bug;
let background;
let startTime;
let bonusTime;
let crowXIndex;
// width between crows
let crowSpacing; 
let powerUp;  
let powerUpTimer;
let powerX;
let powerUpInterval;

function startGame() {
    crows = [];
    gameOver = false;
    score = 0;
    crowXIndex = 1;
    // power up active flag
    powerUp = false;   
    // red shield ball position
    powerX = 3000;    
    powerUpTimer = 0;
    crowSpacing = 300;
    startTime = Date.now(); 
    enemyTimer = 0;
    bonusTime = 0;
    enemyInterval = 1500;
    input = new InputHandler();
    wiresPos = [400, 500, 600];
    wires = new Wires();
    bug = new Bug();
    backgroundAudio.play();
    background = new Background(myCanva.width, myCanva.height);
    animate(0);
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
    bug.update(ctx, input, crows, deltaTime);
    bug.draw(ctx);
    powerUps(bug);
    handleEnemies(deltaTime);
    displayScore(ctx);
    pauseAudio();
    game_over();

    // run the animate function again if gameOver equlas to true otherwise stop the game
    if (!gameOver) {   
        score = (Date.now() - startTime) / 1000 + bonusTime;
        requestAnimationFrame(animate);
    }
}

window.onload = () => {
    startGame();
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

class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener("keydown", (event) => {
            // take the user input for keydown
            if ((event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "ArrowRight"
                || event.key === "w" || event.key === "W" || event.key === "s" || event.key === "S"
                || event.key === "a" || event.key === "d" || event.keys === "A" || event.keys === "D")
                && this.keys.indexOf(event.key) === -1) {
                this.keys.push(event.key);
            }
        });
        // remove user input after key up
        window.addEventListener("keyup", (event) => {
            // forbid the bug to move from the top and bottom line
            if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "s" || event.key === "w" || event.key === "W" || event.keys === "S") {
                bug.canMove = true;
            }
            if ((event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "ArrowRight"
                || event.key === "w" || event.key === "s"
                || event.key === "a" || event.key === "d")
            ) {
                this.keys.splice(this.keys.indexOf(event.key), 1);
            }
        });
    }
}

class Wires {
    drawWires(ctx, wires) {
        this.wires = wires;
        ctx.strokeStyle = "#9111F2";
        ctx.lineWidth = 2
        this.wires.forEach(pos => {
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(myCanva.width, pos);
            ctx.stroke();
        });
    }
}

class Bug {
    constructor() {
        this.bugX = 500;
        this.bugY = 435;
        this.width = 100;
        this.height = 100;
        this.spritHeight = 174;
        this.spritWidth = 140;
        this.bugImage = new Image();
        this.bugImage.src = "photos/bug.png";
        this.loaded = false;
        this.canMove = true;
        this.frameX = 0;
        this.maxFrame = 3;
        this.bugImage.onload = () => {
            this.loaded = true;
        };
        this.changeBug = 0;
        this.chanegBugTime = 100;
    }
    draw(ctx) {
        if (this.loaded) {
            if (!gameOver) {
                // update different bug in interval of 100 ms
                ctx.drawImage(this.bugImage, this.frameX * this.spritWidth, 0, this.spritWidth, this.spritHeight, this.bugX, this.bugY, this.width, this.height);
            }
        }
    }
    update(ctx, input, crows, deltaTime) {
        this.changeBug += deltaTime;
        if (this.changeBug > this.chanegBugTime) {
            this.frameX++;
            if (this.frameX >= this.maxFrame) this.frameX = 0;
            this.changeBug = 0;
        }
        if ((input.keys.indexOf("ArrowUp") > -1 || input.keys.indexOf("w") > -1) && this.canMove) {
            this.bugY = Math.max(335, this.bugY - 100);
            this.canMove = false;
        }
        if ((input.keys.indexOf("ArrowDown") > -1 || input.keys.indexOf("s") > -1) && this.canMove) {
            this.bugY = Math.min(535, this.bugY + 100);
            this.canMove = false;
        }
        crows.forEach(crow => {
            let distance = crow.crowX - (this.bugX + this.width);
            // dont run this logic if powerUp is activated
            if (!powerUp) { 
                // chck for collision and 
                if (this.bugX + this.width > crow.crowX + 5 && this.bugX < crow.crowX + crow.width && this.bugY === crow.crowY) {
                    ctx.drawImage(this.bugImage, 3 * this.spritWidth, this.spritHeight, this.spritWidth, this.spritHeight, this.bugX, this.bugY, this.width, this.height);
                    const crowSound = document.getElementById("crow_sound");
                    crowSound.play();
                    gameOver = true;
                }
            }
            // don't give bonus if powerUp is activated
            else if (!crow.bonusGiven && !powerUp) { 
                if (distance < 40 && distance > 0 && this.bugY === crow.crowY) {
                    bonusTime += 5;
                    crow.bonusGiven = true;
                }

            }

        });
    }
}

class Background {
    constructor(gameWidth, gameHeight) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.image1 = new Image();
        this.image1.src = "photos/bg.jpg"
        this.loaded1 = false;
        this.image1.onload = () => {
            this.loaded1 = true;
        };
        this.x = 0;
        this.y = 0;
        this.speed = 20;
        this.height = 4001;
        this.width = 6001;
    }
    draw(ctx) {
        if (this.loaded1) {
            ctx.drawImage(this.image1, this.x, this.y, 6001, 4001);
            ctx.drawImage(this.image1, this.x + this.width, this.y, this.width, this.height);
        }
    }
    update(input) {
        if (input.keys.indexOf("ArrowRight") > -1 || input.keys.indexOf("d") > -1) {
            if (score > 15) {
                this.speed = 27;
            }
            else if (score > 100) {
                this.speed = 35;
            }
            else {
                this.speed = 20;
            }
        }
        else if (input.keys.indexOf("ArrowLeft") > -1 || input.keys.indexOf("a") > -1) {
            this.speed = 10;
        }
        else {
            if (score > 40) {
                this.speed = 25;
            }
            else if (score > 65) {
                this.speed = 35;
            }
            else if (score > 80) {
                this.speed = 45;
            }
            else {
                this.speed = 14;
            }
        }
        this.x -= this.speed;
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }

}

class Crow {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.crowX = this.gameWidth + (crowXIndex * crowSpacing);
        crowXIndex++;
        if (crowXIndex > 10) crowXIndex = 1;
        if (score > 35) {
            crowSpacing = 700;
        }
        if (score > 80) {
            // increase crow width as speed increases
            crowSpacing = 1200;  
        }
        this.pos = [335, 435, 535];
        this.crowY = this.pos[Math.floor(Math.random() * 3)];
        this.spritHeight = 180;
        this.spritWidth = 250;
        this.speed = 10;
        this.width = 100;
        this.height = 100;
        this.frameX = 0;
        this.maxFrame = 4;
        this.image2 = new Image();
        this.image2.src = "photos/crow.png";
        this.loaded = false;
        this.image2.onload = () => {
            this.loaded = true;
        }
        this.deleteCrow = false;
        this.bonusGiven = false;
        this.crowChange = 0;
        this.changeCrowTime = 200;
    }
    draw(ctx) {
        if (this.loaded) {
            ctx.drawImage(this.image2, this.frameX * this.spritWidth, 0, this.spritWidth, this.spritHeight, this.crowX, this.crowY, this.width, this.height);
        }
    }
    update(input, deltaTime) {

        // change crow image in the interval of 200ms
        this.crowChange += deltaTime;
        if (this.crowChange >= this.changeCrowTime) {
            this.frameX++;
            if (this.frameX >= this.maxFrame) this.frameX = 0;
            this.crowChange = 0;
        }

        if (input.keys.indexOf("ArrowRight") > -1 || input.keys.indexOf("d") > -1) {
            if (score > 15) {
                this.speed = 25;
            }
            else if (score > 25) {
                this.speed = 35;
            }
            else if (score > 50) {
                this.speed = 44;
            }
            else if (score > 90) {
                this.speed = 65;
            }
            else {
                this.speed = 15;
            }
        }
        else if (input.keys.indexOf("ArrowLeft") > -1 || input.keys.indexOf("a") > -1) {
            if (score > 15) {
                this.speed = 10;
            }
            else {
                this.speed = 5;
            }
        }
        else {
            if (score > 15) {
                this.speed = 15;
            }
            else if (score > 25) {
                this.speed = 30;
            }
            else if (score > 50) {
                this.speed = 40;
            }
            else if (score > 90) {
                this.speed = 50;
            }
            else {
                this.speed = 7;
            }
        }
        this.crowX -= this.speed;
        if (this.crowX <= -this.width) {
            this.deleteCrow = true;
        }
    }
}

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
    if (gameOver) {
        window.removeEventListener("keydown", playAudio);
        backgroundAudio.pause();
    }
}

function game_over() {
    if (gameOver) {
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


