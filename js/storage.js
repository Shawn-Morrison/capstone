
const PLAYER_STORAGE_KEY = "licensePlateCollector_players";
const ACTIVE_PLAYER_KEY = "licensePlateCollector_activePlayer";

const MAX_PLAYERS = 2;

// Retrieve all saved players
export function getPlayers() {
    try {
        const savedPlayers = localStorage.getItem(PLAYER_STORAGE_KEY);

        if (!savedPlayers) {
            return [];
        }

        const players = JSON.parse(savedPlayers);

        return Array.isArray(players) ? players : [];

    } catch (error) {
        console.error("Unable to retrieve players:", error);
        return [];
    }
}

// Save all players
export function savePlayers(players) {
    if (!Array.isArray(players)) {
        throw new Error("Player data must be an array.");
    }

    try {
        localStorage.setItem(
            PLAYER_STORAGE_KEY,
            JSON.stringify(players)
        );

        return true;

    } catch (error) {
        console.error("Unable to save players:", error);
        throw new Error("Your player information could not be saved.");
    }
}

// Generate a unique player ID
function generatePlayerId() {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return "player_" + Date.now() + "_" + Math.random();
}

// Create a new player
export function createPlayer(name) {
    const trimmedName = name.trim();

    if (!trimmedName) {
        throw new Error("Please enter a player name.");
    }

    const players = getPlayers();

    if (players.length >= MAX_PLAYERS) {
        throw new Error("The maximum of two players has been reached.");
    }

    // Prevent duplicate names, ignoring capitalization
    const duplicate = players.some(
        player => player.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicate) {
        throw new Error("That player name is already in use.");
    }

    const newPlayer = {
        id: generatePlayerId(),
        name: trimmedName,
        discoveredStates: [],
        sightings: [],
        totalPoints: 0,
        achievements: []
    };

    players.push(newPlayer);

    savePlayers(players);

    // Automatically make the new player active
    setActivePlayer(newPlayer.id);

    return newPlayer;
}

// Retrieve the active player
export function getActivePlayer() {
    const activeId = localStorage.getItem(ACTIVE_PLAYER_KEY);

    if (!activeId) {
        return null;
    }

    const players = getPlayers();

    const activePlayer = players.find(
        player => player.id === activeId
    );

    if (!activePlayer) {
        localStorage.removeItem(ACTIVE_PLAYER_KEY);
        return null;
    }

    return activePlayer;
}

// Set the active player
export function setActivePlayer(playerId) {
    const players = getPlayers();

    const playerExists = players.some(
        player => player.id === playerId
    );

    if (!playerExists) {
        throw new Error("Player could not be found.");
    }

    localStorage.setItem(ACTIVE_PLAYER_KEY, playerId);
}

// Update an existing player
export function updatePlayer(updatedPlayer) {
    const players = getPlayers();

    const index = players.findIndex(
        player => player.id === updatedPlayer.id
    );

    if (index === -1) {
        throw new Error("Player could not be found.");
    }

    const updatedName = updatedPlayer.name.trim();

    if (!updatedName) {
        throw new Error("Player name cannot be blank.");
    }

    const duplicate = players.some(
        player =>
            player.id !== updatedPlayer.id &&
            player.name.toLowerCase() === updatedName.toLowerCase()
    );

    if (duplicate) {
        throw new Error("That player name is already in use.");
    }

    players[index] = {
        ...players[index],
        ...updatedPlayer,
        name: updatedName
    };

    savePlayers(players);

    return players[index];
}

// Delete a player
export function deletePlayer(playerId) {
    const players = getPlayers();

    const updatedPlayers = players.filter(
        player => player.id !== playerId
    );

    savePlayers(updatedPlayers);

    if (localStorage.getItem(ACTIVE_PLAYER_KEY) === playerId) {
        localStorage.removeItem(ACTIVE_PLAYER_KEY);
    }
}
