import { score } from "./initialize.js";
let crowXIndex = 1;
let crowSpacing = 300;
export class Crow {
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
    update(input,deltaTime) {

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