
import { getPlayers } from "./storage.js";

const podium = document.getElementById("leaderboard-podium");
const leaderboardList = document.getElementById("leaderboard-list");

function renderLeaderboard() {
    const players = getPlayers()
        .sort((a, b) => {
            const pointDifference =
                (Number(b.totalPoints) || 0) - (Number(a.totalPoints) || 0);

            if (pointDifference !== 0) return pointDifference;

            return (b.discoveredStates?.length || 0) -
                (a.discoveredStates?.length || 0);
        });

    podium.innerHTML = "";
    leaderboardList.innerHTML = "";

    if (!players.length) {
        leaderboardList.textContent =
            "No players yet. Create a profile to start competing.";
        return;
    }

    const podiumOrder = [1, 0, 2];

    podiumOrder.forEach(index => {
        const player = players[index];

        if (!player) return;

        const card = document.createElement("div");
        card.className = `podium-card podium-${index + 1}`;

        const rank = document.createElement("span");
        rank.className = "podium-rank";
        rank.textContent = index === 0 ? "1ST" : index === 1 ? "2ND" : "3RD";

        const avatar = document.createElement("span");
        avatar.className = "podium-avatar";
        avatar.textContent = player.name.charAt(0).toUpperCase();

        const name = document.createElement("strong");
        name.textContent = player.name;

        const points = document.createElement("small");
        points.textContent = `${player.totalPoints || 0} pts`;

        card.append(rank, avatar, name, points);
        podium.appendChild(card);
    });

    players.forEach((player, index) => {
        const card = document.createElement("article");
        card.className = "leaderboard-row";

        const rank = document.createElement("span");
        rank.className = "leaderboard-number";
        rank.textContent = `0${index + 1}`;

        const avatar = document.createElement("span");
        avatar.className = "leaderboard-avatar";
        avatar.textContent = player.name.charAt(0).toUpperCase();

        const details = document.createElement("span");
        details.className = "leaderboard-player-details";

        const name = document.createElement("strong");
        name.textContent = player.name;

        const states = document.createElement("small");
        states.textContent =
            `${player.discoveredStates?.length || 0} states collected`;

        details.append(name, states);

        const score = document.createElement("strong");
        score.className = "leaderboard-score";
        score.textContent = `${player.totalPoints || 0} pts`;

        card.append(rank, avatar, details, score);
        leaderboardList.appendChild(card);
    });
}

renderLeaderboard();
