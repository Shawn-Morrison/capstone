
import {
    getPlayers,
    createPlayer,
    getActivePlayer,
    setActivePlayer
} from "./storage.js";

const playerList = document.getElementById("player-list");
const playerCount = document.getElementById("player-count");

const createPlayerSection = document.getElementById(
    "create-player-section"
);

const createPlayerForm = document.getElementById(
    "create-player-form"
);

const playerNameInput = document.getElementById("player-name");
const formMessage = document.getElementById("form-message");

const playerLimitMessage = document.getElementById(
    "player-limit-message"
);

const continueButton = document.getElementById("continue-button");
const selectionMessage = document.getElementById("selection-message");

let selectedPlayerId = getActivePlayer()?.id || null;

const MAX_PLAYERS = 2;

// Display all player profiles
function renderPlayers() {

    const players = getPlayers();

    playerList.innerHTML = "";

    playerCount.textContent = `${players.length} / ${MAX_PLAYERS} Players`;

    // Clear an outdated selection
    if (!players.some(player => player.id === selectedPlayerId)) {
        selectedPlayerId = getActivePlayer()?.id || null;
    }

    if (players.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-message";
        emptyMessage.textContent =
            "No players have been created yet. Create your first profile below!";

        playerList.appendChild(emptyMessage);

    }

    players.forEach(player => {

        const isSelected = player.id === selectedPlayerId;

        const card = document.createElement("button");

        card.type = "button";
        card.className = "player-card";

        if (isSelected) {
            card.classList.add("selected");
        }

        card.setAttribute("aria-pressed", String(isSelected));

        const avatar = document.createElement("div");
        avatar.className = "player-avatar";
        avatar.textContent = player.name.charAt(0).toUpperCase();

        const details = document.createElement("div");
        details.className = "player-details";

        const name = document.createElement("h3");
        name.textContent = player.name;

        const stats = document.createElement("p");

        const stateCount = player.discoveredStates?.length || 0;

        stats.textContent =
            `${stateCount} states discovered · ${player.totalPoints || 0} points`;

        details.append(name, stats);

        const status = document.createElement("span");
        status.className = "player-status";
        status.textContent = isSelected ? "Selected" : "Select";

        card.append(avatar, details, status);

        card.addEventListener("click", () => {

            try {

                setActivePlayer(player.id);

                selectedPlayerId = player.id;

                formMessage.textContent = "";

                renderPlayers();

            } catch (error) {

                selectionMessage.textContent = error.message;

            }

        });

        playerList.appendChild(card);

    });

    // Show or hide the profile creation form
    const canCreatePlayer = players.length < MAX_PLAYERS;

    createPlayerSection.hidden = !canCreatePlayer;

    playerLimitMessage.hidden = canCreatePlayer;

    // Enable Continue only when a valid player is selected
    const validSelection = players.some(
        player => player.id === selectedPlayerId
    );

    continueButton.disabled = !validSelection;

    selectionMessage.textContent = validSelection
        ? `${players.find(player => player.id === selectedPlayerId).name} is ready to play!`
        : "Select a player to continue.";

}

// Create a new player
createPlayerForm.addEventListener("submit", event => {

    event.preventDefault();

    const name = playerNameInput.value.trim();

    try {

        const newPlayer = createPlayer(name);

        selectedPlayerId = newPlayer.id;

        playerNameInput.value = "";

        formMessage.textContent = "";

        renderPlayers();

    } catch (error) {

        formMessage.textContent = error.message;

    }

});

// Continue to the game
continueButton.addEventListener("click", () => {

    if (!selectedPlayerId) {
        return;
    }

    const activePlayer = getActivePlayer();

    if (!activePlayer || activePlayer.id !== selectedPlayerId) {
        return;
    }

    window.location.href = "./game.html";

});

// Initial page setup
renderPlayers();
