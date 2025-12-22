import { startGame } from "./initialize.js";
const introScreen = document.getElementById("introScreen");
const startBtn = document.getElementById("startGameBtn");


startBtn.addEventListener("click", () => {
    introScreen.style.display = "none";
    startGame();
});
