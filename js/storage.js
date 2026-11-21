
const PLAYER_STORAGE_KEY = "licensePlateCollector_players";
const ACTIVE_PLAYER_KEY = "licensePlateCollector_activePlayer";

const MAX_PLAYERS = 4;

export function getPlayers() {
    try {
        const savedPlayers = localStorage.getItem(PLAYER_STORAGE_KEY);

        if (!savedPlayers) return [];

        const players = JSON.parse(savedPlayers);

        return Array.isArray(players) ? players : [];
    } catch (error) {
        console.error("Unable to retrieve players:", error);
        return [];
    }
}

export function savePlayers(players) {
    if (!Array.isArray(players)) {
        throw new Error("Player data must be an array.");
    }

    try {
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(players));
        return true;
    } catch (error) {
        console.error("Unable to save players:", error);
        throw new Error("Your player information could not be saved.");
    }
}

function generatePlayerId() {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return "player_" + Date.now() + "_" + Math.random();
}

export function createPlayer(name) {
    const trimmedName = name.trim();

    if (!trimmedName) {
        throw new Error("Please enter a player name.");
    }

    const players = getPlayers();

    if (players.length >= MAX_PLAYERS) {
        throw new Error("All four player slots are occupied.");
    }

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
    setActivePlayer(newPlayer.id);

    return newPlayer;
}

export function getActivePlayer() {
    const activeId = localStorage.getItem(ACTIVE_PLAYER_KEY);

    if (!activeId) return null;

    const players = getPlayers();

    const activePlayer = players.find(player => player.id === activeId);

    if (!activePlayer) {
        localStorage.removeItem(ACTIVE_PLAYER_KEY);
        return null;
    }

    return activePlayer;
}

export function setActivePlayer(playerId) {
    const players = getPlayers();

    const playerExists = players.some(player => player.id === playerId);

    if (!playerExists) {
        throw new Error("Player could not be found.");
    }

    localStorage.setItem(ACTIVE_PLAYER_KEY, playerId);
}

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

export function recordStateDiscovery(stateAbbreviation) {
    const abbreviation = String(stateAbbreviation).trim().toUpperCase();

    const players = getPlayers();
    const activeId = localStorage.getItem(ACTIVE_PLAYER_KEY);

    const playerIndex = players.findIndex(
        player => player.id === activeId
    );

    if (playerIndex === -1) {
        throw new Error("No active player was found.");
    }

    const player = players[playerIndex];

    if (!Array.isArray(player.discoveredStates)) {
        player.discoveredStates = [];
    }

    if (!Array.isArray(player.sightings)) {
        player.sightings = [];
    }

    const alreadyCollected = player.discoveredStates.some(
        state => String(state).toUpperCase() === abbreviation
    );

    if (alreadyCollected) {
        return {
            success: false,
            alreadyCollected: true,
            pointsAwarded: 0,
            player
        };
    }

    player.discoveredStates.push(abbreviation);

    const pointsAwarded = 10;

    player.totalPoints = (Number(player.totalPoints) || 0) + pointsAwarded;

    player.sightings.push({
        state: abbreviation,
        pointsAwarded,
        date: new Date().toISOString()
    });

    savePlayers(players);

    return {
        success: true,
        alreadyCollected: false,
        pointsAwarded,
        player
    };
}

export { MAX_PLAYERS };
