import { startGame } from "./initialize.js";
export class InputHandler {
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
                startGame.canMove = true;
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
