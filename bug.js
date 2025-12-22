import { startGame, powerUp, myCanva, wiresPos } from "./initialize.js";
export class Bug {
    constructor() {
        this.bugX = myCanva.width/4;
        this.bugY = wiresPos[1]-50;
        this.bugIndex = 1
        this.width = 100;
        this.height = 100;
        this.gap = wiresPos[1] - wiresPos[0]
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
            this.bugY = Math.max(wiresPos[0]-50, this.bugY - this.gap);
            this.bugIndex = Math.max(0,this.bugIndex -= 1)
            console.log(this.bugIndex)
            startGame.canMove = false;
        }
        if ((input.keys.indexOf("ArrowDown") > -1 || input.keys.indexOf("s") > -1) && startGame.canMove) {
            this.bugY = Math.min(wiresPos[2]-50, this.bugY + this.gap);
            this.bugIndex = Math.min(2, this.bugIndex += 1)
            startGame.canMove = false;
            console.log(this.bugIndex)
        }
        crows.forEach(crow => {
            let distance = crow.crowX - (this.bugX + this.width);
            // dont run this logic if powerUp is activated
            if (!powerUp) {
                // chck for collision only if powerUp is not activated
                if (this.bugX + this.width > crow.crowX + 5 && this.bugX < crow.crowX + crow.width && this.bugIndex === crow.crowIndex) {
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