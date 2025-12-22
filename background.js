import { myCanva, score } from "./initialize.js";
export class Background {
    constructor(gameWidth, gameHeight) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.bg_image = new Image();
        this.bg_image.src = "photos/sky.jpg";
        this.loaded1 = false;
        this.bg_image.onload = () => {
            this.loaded1 = true;
        };
        this.x = 0;
        this.y = 0;
        this.speed = 20;
        this.width = 2048;
    }
    draw(ctx) {
        if (!this.loaded1) return;

        let x = this.x % this.width;

        if (x > 0) x -= this.width;

        ctx.drawImage(this.bg_image, x, this.y, this.width, myCanva.height);
        ctx.drawImage(this.bg_image, x + this.width, this.y, this.width, myCanva.height);
    }

    update(input) {
        if (input.keys.indexOf("ArrowRight") > -1 || input.keys.indexOf("d") > -1) {
            if (score > 50) {
                this.speed = 27;
            }
            else if (score > 15) {
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