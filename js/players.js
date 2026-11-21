
import {
    getPlayers,
    createPlayer,
    getActivePlayer,
    setActivePlayer,
    MAX_PLAYERS
} from "./storage.js";

const playerList = document.getElementById("player-list");
const playerCount = document.getElementById("player-count");
const continueButton = document.getElementById("continue-button");
const selectionMessage = document.getElementById("selection-message");

const dialog = document.getElementById("create-player-dialog");
const createPlayerForm = document.getElementById("create-player-form");
const playerNameInput = document.getElementById("player-name");
const dialogMessage = document.getElementById("dialog-message");
const formMessage = document.getElementById("form-message");
const closeDialogButton = document.getElementById("close-create-dialog");

let selectedPlayerId = getActivePlayer()?.id || null;

function renderPlayers() {
    const players = getPlayers();

    playerList.innerHTML = "";
    playerCount.textContent = `${players.length} / ${MAX_PLAYERS} Players`;

    if (!players.some(player => player.id === selectedPlayerId)) {
        selectedPlayerId = getActivePlayer()?.id || null;
    }

    for (let index = 0; index < MAX_PLAYERS; index++) {
        const player = players[index];

        if (player) {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "player-card";

            const isSelected = player.id === selectedPlayerId;

            if (isSelected) card.classList.add("selected");

            card.setAttribute("aria-pressed", String(isSelected));

            const avatar = document.createElement("span");
            avatar.className = "player-avatar";
            avatar.textContent = player.name.charAt(0).toUpperCase();

            const name = document.createElement("strong");
            name.textContent = player.name;

            const stats = document.createElement("small");
            stats.textContent =
                `${player.discoveredStates?.length || 0} states · ${player.totalPoints || 0} points`;

            const status = document.createElement("span");
            status.className = "player-status";
            status.textContent = isSelected ? "✓" : "›";

            card.append(avatar, name, stats, status);

            card.addEventListener("click", () => {
                try {
                    setActivePlayer(player.id);
                    selectedPlayerId = player.id;
                    formMessage.textContent = "";
                    renderPlayers();
                } catch (error) {
                    formMessage.textContent = error.message;
                }
            });

            playerList.appendChild(card);
        } else {
            const addCard = document.createElement("button");
            addCard.type = "button";
            addCard.className = "player-card add-player-card";

            addCard.innerHTML = `
                <span class="add-player-icon">+</span>
                <strong>Add player</strong>
                <small>Create a profile</small>
            `;

            addCard.addEventListener("click", openCreateDialog);

            playerList.appendChild(addCard);
        }
    }

    const validSelection = players.some(
        player => player.id === selectedPlayerId
    );

    continueButton.disabled = !validSelection;

    selectionMessage.textContent = validSelection
        ? `Continue as ${players.find(player => player.id === selectedPlayerId).name}`
        : "Select a player to continue.";
}

function openCreateDialog() {
    dialogMessage.textContent = "";
    playerNameInput.value = "";
    dialog.showModal();
    setTimeout(() => playerNameInput.focus(), 100);
}

function closeCreateDialog() {
    dialog.close();
}

createPlayerForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = playerNameInput.value.trim();

    try {
        const newPlayer = createPlayer(name);

        selectedPlayerId = newPlayer.id;

        dialog.close();
        formMessage.textContent = "";

        renderPlayers();
    } catch (error) {
        dialogMessage.textContent = error.message;
    }
});

closeDialogButton.addEventListener("click", closeCreateDialog);

dialog.addEventListener("click", event => {
    if (event.target === dialog) {
        closeCreateDialog();
    }
});

continueButton.addEventListener("click", () => {
    const activePlayer = getActivePlayer();

    if (!activePlayer || activePlayer.id !== selectedPlayerId) return;

    window.location.href = "./game.html";
});

renderPlayers();
