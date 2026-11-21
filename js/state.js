
import { getStates } from "./states.js";
import { getActivePlayer } from "./storage.js";

const stateName = document.getElementById("state-name");
const stateNickname = document.getElementById("state-nickname");
const statePlateImage = document.getElementById("state-plate-image");

const stateFlagImage = document.getElementById("state-flag-image");
const stateCapital = document.getElementById("state-capital");
const stateAbbreviation = document.getElementById("state-abbreviation");

const stateFactsList = document.getElementById("state-facts-list");

async function initializeStatePage() {
    const player = getActivePlayer();

    if (!player) {
        window.location.href = "./players.html";
        return;
    }

    const abbreviation = new URLSearchParams(window.location.search)
        .get("state");

    if (!abbreviation) {
        window.location.href = "./collection.html";
        return;
    }

    const states = await getStates();

    const state = states.find(
        item => item.abbreviation === abbreviation.toUpperCase()
    );

    if (!state) {
        window.location.href = "./collection.html";
        return;
    }

    const collected = (player.discoveredStates || []).some(
        code => String(code).toUpperCase() === state.abbreviation
    );

    if (!collected) {
        window.location.href = "./collection.html";
        return;
    }

    document.title = `${state.name} | License Plate Scavenger Hunt`;

    stateName.textContent = state.name;
    stateNickname.textContent = state.nickname || "";

    statePlateImage.src = state.plateImage;
    statePlateImage.alt = `${state.name} license plate`;

    stateFlagImage.src = state.flag;
    stateFlagImage.alt = `${state.name} state flag`;

    stateCapital.textContent = state.capital;
    stateAbbreviation.textContent = state.abbreviation;

    stateFactsList.innerHTML = "";

    (state.funFacts || []).slice(0, 3).forEach((fact, index) => {
        const card = document.createElement("article");
        card.className = "state-fact-card";

        const number = document.createElement("span");
        number.className = "fact-number";
        number.textContent = String(index + 1).padStart(2, "0");

        const text = document.createElement("p");
        text.textContent = fact;

        card.append(number, text);
        stateFactsList.appendChild(card);
    });
}

initializeStatePage();
