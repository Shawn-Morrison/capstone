
import { getStates } from "./states.js";
import { getActivePlayer } from "./storage.js";

const playerName = document.getElementById("collection-player-name");
const stateCount = document.getElementById("collection-state-count");
const points = document.getElementById("collection-points");

const progressLabel = document.getElementById("collection-progress-label");
const progressFill = document.getElementById("collection-progress-fill");

const stateList = document.getElementById("collection-state-list");

async function initializeCollection() {
    const player = getActivePlayer();

    if (!player) {
        window.location.href = "./players.html";
        return;
    }

    const states = await getStates();

    if (!states.length) {
        stateList.textContent = "Unable to load state information.";
        return;
    }

    const discovered = player.discoveredStates || [];
    const count = discovered.length;
    const percentage = Math.min(100, (count / 50) * 100);

    playerName.textContent = player.name;
    stateCount.textContent = count;
    points.textContent = Number(player.totalPoints || 0).toLocaleString();

    progressLabel.textContent = `${count} of 50`;
    progressFill.style.width = `${percentage}%`;

    stateList.innerHTML = "";

    states.forEach(state => {
        const collected = discovered.some(
            code => String(code).toUpperCase() === state.abbreviation
        );

        const card = document.createElement(
            collected ? "a" : "div"
        );

        card.className = "collection-state-card";

        if (collected) {
            card.href = `./state.html?state=${encodeURIComponent(state.abbreviation)}`;
        } else {
            card.classList.add("not-collected");
        }

        const image = document.createElement("img");
        image.src = state.plateImage;
        image.alt = `${state.name} license plate`;

        const details = document.createElement("span");
        details.className = "collection-state-details";

        const name = document.createElement("strong");
        name.textContent = state.name;

        const status = document.createElement("small");
        status.textContent = collected ? "Collected · View facts" : "Not discovered yet";

        details.append(name, status);

        const indicator = document.createElement("span");
        indicator.className = "collection-state-indicator";
        indicator.textContent = collected ? "›" : "○";

        card.append(image, details, indicator);

        stateList.appendChild(card);
    });
}

initializeCollection();
