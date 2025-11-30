import { score } from "./initialize.js";
export class Background {
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
            else if (score > 50) {
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
            if (score > 15) {
                this.speed = 20;
            }
            else if (score > 55) {
                this.speed = 27;
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