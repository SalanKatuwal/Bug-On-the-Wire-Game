import { startGame, powerUp } from "./initialize.js";
export class Bug {
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
            if (!startGame.gameOver) {
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
        if ((input.keys.indexOf("ArrowUp") > -1 || input.keys.indexOf("w") > -1) && startGame.canMove) {
            this.bugY = Math.max(335, this.bugY - 100);
            startGame.canMove = false;
        }
        if ((input.keys.indexOf("ArrowDown") > -1 || input.keys.indexOf("s") > -1) && startGame.canMove) {
            this.bugY = Math.min(535, this.bugY + 100);
            startGame.canMove = false;
        }
        crows.forEach(crow => {
            let distance = crow.crowX - (this.bugX + this.width);
            // dont run this logic if powerUp is activated
            if (!powerUp) {
                // chck for collision only if powerUp is not activated
                if (this.bugX + this.width > crow.crowX + 5 && this.bugX < crow.crowX + crow.width && this.bugY === crow.crowY) {
                    ctx.drawImage(this.bugImage, 3 * this.spritWidth, this.spritHeight, this.spritWidth, this.spritHeight, this.bugX, this.bugY, this.width, this.height);
                    const crowSound = document.getElementById("crow_sound");
                    crowSound.play();   
                    startGame.gameOver = true;
                }
            }
            // don't give bonus if powerUp is activated
            if (!crow.bonusGiven && !powerUp) {
                if (distance < 50 && distance > 0 && this.bugY === crow.crowY) {
                    crow.bonusGiven = true;
                    startGame.bonusScore +=3;
                }
            }
        });
    }
}