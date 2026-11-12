
import { getPlayers } from "./storage.js";

const leaderboardList = document.getElementById("leaderboard-list");

function renderLeaderboard() {

    const players = getPlayers();

    leaderboardList.innerHTML = "";

    if (players.length === 0) {

        const emptyMessage = document.createElement("div");

        emptyMessage.className = "empty-message";

        emptyMessage.textContent =
            "No players yet! Create a player profile to start competing.";

        leaderboardList.appendChild(emptyMessage);

        return;

    }

    // Sort by points, then by unique states discovered
    players.sort((a, b) => {

        if (b.totalPoints !== a.totalPoints) {
            return b.totalPoints - a.totalPoints;
        }

        return b.discoveredStates.length - a.discoveredStates.length;

    });

    players.forEach((player, index) => {

        const discoveredCount = player.discoveredStates.length;

        const percentage = Math.min(
            100,
            (discoveredCount / 50) * 100
        );

        const card = document.createElement("article");

        card.className = "leaderboard-card";

        const rank = document.createElement("div");
        rank.className = "leaderboard-rank";
        rank.textContent = `#${index + 1}`;

        const details = document.createElement("div");
        details.className = "leaderboard-details";

        const name = document.createElement("h2");
        name.textContent = player.name;

        const stats = document.createElement("p");

        stats.textContent =
            `${discoveredCount} of 50 states discovered`;

        const progressContainer = document.createElement("div");
        progressContainer.className = "progress-container";

        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";

        progressBar.style.width = `${percentage}%`;

        progressContainer.appendChild(progressBar);

        const percentageText = document.createElement("p");
        percentageText.className = "progress-text";

        percentageText.textContent =
            `${percentage.toFixed(0)}% collected`;

        details.append(
            name,
            stats,
            progressContainer,
            percentageText
        );

        const points = document.createElement("div");
        points.className = "leaderboard-points";

        const pointValue = document.createElement("strong");
        pointValue.textContent = player.totalPoints.toLocaleString();

        const pointLabel = document.createElement("span");
        pointLabel.textContent = "POINTS";

        points.append(pointValue, pointLabel);

        card.append(rank, details, points);

        leaderboardList.appendChild(card);

    });

}

renderLeaderboard();
