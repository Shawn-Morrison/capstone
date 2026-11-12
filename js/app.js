
import { getActivePlayer } from "./storage.js";

const welcomePlayer = document.getElementById("welcome-player");

const activePlayer = getActivePlayer();

if (activePlayer) {
    welcomePlayer.textContent =
        `Welcome back, ${activePlayer.name}!`;
}
