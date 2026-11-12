
import { getStates } from "./states.js";

async function initializeApp() {
    const states = await getStates();

    const stateContainer = document.getElementById("stateContainer");

    stateContainer.innerHTML = states.map(state => `
        <div class="state-card">
            <img src="${state.flag}" alt="${state.name} flag">

            <h2>${state.name}</h2>

            <p>${state.abbreviation}</p>
            <p>Capital: ${state.capital}</p>
        </div>
    `).join("");
}

initializeApp();
