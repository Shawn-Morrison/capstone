
import { getStates } from "./states.js";

import {
    getActivePlayer,
    recordStateDiscovery
} from "./storage.js";


// =====================================
// PAGE ELEMENTS
// =====================================

const playerName = document.getElementById("player-name");
const totalPoints = document.getElementById("total-points");
const stateCount = document.getElementById("state-count");

const progressText = document.getElementById("progress-text");
const progressRing = document.getElementById("progress-ring");

const foundPlateButton = document.getElementById("found-plate-button");
const discoveryPanel = document.getElementById("discovery-panel");

const plateGrid = document.getElementById("plate-grid");

const addStateButton = document.getElementById("add-state-button");
const cancelButton = document.getElementById("close-discovery-button");

const discoveryMessage = document.getElementById("discovery-message");
const discoveryPlayerName = document.getElementById("discovery-player-name");
const viewCollectionLink = document.getElementById("view-collection-link");


// =====================================
// APPLICATION DATA
// =====================================

let states = [];

let activePlayer = getActivePlayer();

let selectedStateCode = "";


// =====================================
// INITIALIZE DASHBOARD
// =====================================

async function initializeDashboard() {

    // Make sure a player is selected
    if (!activePlayer) {

        window.location.href = "./players.html";

        return;

    }

    // Retrieve state information from JSON
    states = await getStates();

    if (!states.length) {

        collectionList.textContent =
            "Unable to load state information. Please check states.json.";

        return;

    }

    renderDashboard();

    renderStateOptions();

    renderPlateGrid();

}


// =====================================
// RENDER PLAYER DASHBOARD
// =====================================

function renderDashboard() {

    activePlayer = getActivePlayer();

    if (!activePlayer) {
        window.location.href = "./players.html";
        return;
    }

    const discoveredStates = activePlayer.discoveredStates || [];

    const discoveredCount = discoveredStates.length;

    const percentage = Math.min(
        100,
        (discoveredCount / 50) * 100
    );

    playerName.textContent = activePlayer.name;

    totalPoints.textContent =
        (Number(activePlayer.totalPoints) || 0).toLocaleString();

    stateCount.textContent = `${discoveredCount} / 50`;

    progressText.textContent = `${percentage.toFixed(0)}%`;

   progressRing.style.setProperty("--progress", `${percentage * 3.6}deg`);

    renderCollection();

}


// =====================================
// CHECK STATE DISCOVERY
// =====================================

function isCollected(stateCode) {

    const discoveredStates = activePlayer?.discoveredStates || [];

    return discoveredStates.some(
        code => code.toUpperCase() === stateCode.toUpperCase()
    );

}


// =====================================
// RENDER DROPDOWN
// =====================================

function renderStateOptions() {

    stateSelect.innerHTML = "";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent = "Choose a state...";

    stateSelect.appendChild(defaultOption);

    states.forEach(state => {

        const option = document.createElement("option");

        option.value = state.abbreviation;

        option.textContent = isCollected(state.abbreviation)
            ? `${state.name} - Already Collected`
            : state.name;

        option.disabled = isCollected(state.abbreviation);

        stateSelect.appendChild(option);

    });

}


// =====================================
// RENDER LICENSE PLATE OPTIONS
// =====================================

function renderPlateGrid() {

    plateGrid.innerHTML = "";

    states.forEach(state => {

        const collected = isCollected(state.abbreviation);

        const plateCard = document.createElement("button");

        plateCard.type = "button";

        plateCard.className = "plate-option";

        if (collected) {
            plateCard.classList.add("collected");
        }

        if (selectedStateCode === state.abbreviation) {
            plateCard.classList.add("active");
        }

        plateCard.disabled = collected;

        const plateImage = document.createElement("img");

        plateImage.src = state.plateImage || "";
        plateImage.alt = `${state.name} license plate`;

        const stateName = document.createElement("span");
stateName.textContent = state.name;

plateCard.append(
    plateImage,
    stateName
);

        plateCard.addEventListener("click", () => {

            if (collected) {
                return;
            }

            selectState(state.abbreviation);

        });

        plateGrid.appendChild(plateCard);

    });

}


// =====================================
// SELECT A LICENSE PLATE
// =====================================

function selectState(stateAbbreviation) {

    selectedStateCode = stateAbbreviation;

    addStateButton.disabled = false;

    discoveryMessage.textContent = "";

    renderPlateGrid();

}


// =====================================
// DISPLAY STATE DETAILS
// =====================================

function renderStatePreview() {

    const state = states.find(
        item => item.abbreviation === selectedStateCode
    );

    selectedStatePreview.innerHTML = "";

    if (!state) {

        selectedStatePreview.textContent =
            "Select a state to see its details.";

        return;

    }

    const title = document.createElement("h3");
    title.textContent = state.name;

    const capital = document.createElement("p");
    capital.textContent = `Capital: ${state.capital}`;

    const nickname = document.createElement("p");
    nickname.textContent = `Nickname: ${state.nickname || "Not listed"}`;

    const fact = document.createElement("p");

    if (Array.isArray(state.funFacts) && state.funFacts.length) {

        fact.textContent = state.funFacts[0];

    }

    selectedStatePreview.append(
        title,
        capital,
        nickname
    );

    if (fact.textContent) {
        selectedStatePreview.appendChild(fact);
    }

}


// =====================================
// RECORD STATE DISCOVERY
// =====================================

function addStateToCollection() {

    if (!selectedStateCode) {

        discoveryMessage.textContent =
            "Please select a state first.";

        return;

    }

    try {

        const result = recordStateDiscovery(selectedStateCode);

        if (result.alreadyCollected) {

            discoveryMessage.textContent =
                "You've already collected this state! No additional points awarded.";

            return;

        }

        if (result.success) {

            discoveryMessage.textContent =
                `${selectedStateCode} added! You earned ${result.pointsAwarded} points!`;

            // Update dashboard and available state choices
            activePlayer = getActivePlayer();

            selectedStateCode = "";

            stateSelect.value = "";

            addStateButton.disabled = true;

            renderDashboard();

            renderStateOptions();

            renderPlateGrid();

            renderStatePreview();

        }

    } catch (error) {

        discoveryMessage.textContent = error.message;

    }

}


// =====================================
// RENDER COLLECTION
// =====================================

function renderCollection() {

    collectionList.innerHTML = "";

    const discoveredStates = activePlayer.discoveredStates || [];

    if (discoveredStates.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";

        message.textContent =
            "You haven't collected any states yet. Find your first plate!";

        collectionList.appendChild(message);

        return;

    }

    discoveredStates.forEach(stateCode => {

        const state = states.find(
            item => item.abbreviation === stateCode
        );

        if (!state) {
            return;
        }

        const card = document.createElement("div");

        card.className = "collected-state-card";

        const image = document.createElement("img");

        image.src = state.plateImage || "";
        image.alt = `${state.name} plate`;

        const name = document.createElement("span");

        name.textContent = state.name;

        card.append(image, name);

        collectionList.appendChild(card);

    });

}


// =====================================
// EVENT LISTENERS
// =====================================

foundPlateButton.addEventListener("click", () => {

    discoveryPanel.hidden = !discoveryPanel.hidden;

    discoveryMessage.textContent = "";

    if (!discoveryPanel.hidden) {
        renderPlateGrid();
    }

});

cancelButton.addEventListener("click", () => {

    discoveryPanel.hidden = true;

    selectedStateCode = "";

    addStateButton.disabled = true;

    renderPlateGrid();

});

addStateButton.addEventListener("click", () => {

    if (!selectedStateCode) {
        return;
    }

    const result = recordStateDiscovery(selectedStateCode);

    if (result) {

        discoveryMessage.textContent = "Plate added to your collection!";

        addStateButton.disabled = true;

        viewCollectionLink.hidden = false;

        selectedStateCode = "";

        renderPlateGrid();

        updateDashboard();

    }

});

// =====================================
// START APPLICATION
// =====================================

initializeDashboard();
