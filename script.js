
const teams = [
    {name:"CSK", full:"Chennai Super Kings", purse:120},
    {name:"MI", full:"Mumbai Indians", purse:120},
    {name:"RCB", full:"Royal Challengers Bengaluru", purse:120},
    {name:"KKR", full:"Kolkata Knight Riders", purse:120},
    {name:"SRH", full:"Sunrisers Hyderabad", purse:120},
    {name:"RR", full:"Rajasthan Royals", purse:120},
    {name:"DC", full:"Delhi Capitals", purse:120},
    {name:"PBKS", full:"Punjab Kings", purse:120},
    {name:"GT", full:"Gujarat Titans", purse:120},
    {name:"LSG", full:"Lucknow Super Giants", purse:120}
];

const players = [
    {name:"Virat Kohli", country:"India", role:"Batter", base:2},
    {name:"Rohit Sharma", country:"India", role:"Batter", base:2},
    {name:"MS Dhoni", country:"India", role:"Wicketkeeper", base:1},
    {name:"Jasprit Bumrah", country:"India", role:"Bowler", base:2},
    {name:"Hardik Pandya", country:"India", role:"All-rounder", base:2},
    {name:"Suryakumar Yadav", country:"India", role:"Batter", base:2},
    {name:"Shubman Gill", country:"India", role:"Batter", base:2},
    {name:"Ravindra Jadeja", country:"India", role:"All-rounder", base:2},
    {name:"Rishabh Pant", country:"India", role:"Wicketkeeper", base:2},
    {name:"KL Rahul", country:"India", role:"Wicketkeeper", base:2},
    {name:"Yashasvi Jaiswal", country:"India", role:"Batter", base:2},
    {name:"Ruturaj Gaikwad", country:"India", role:"Batter", base:1},
    {name:"Shreyas Iyer", country:"India", role:"Batter", base:2},
    {name:"Sanju Samson", country:"India", role:"Wicketkeeper", base:2},
    {name:"Mohammed Siraj", country:"India", role:"Bowler", base:1},
    {name:"Arshdeep Singh", country:"India", role:"Bowler", base:2},
    {name:"Axar Patel", country:"India", role:"All-rounder", base:1},
    {name:"Kuldeep Yadav", country:"India", role:"Bowler", base:2},
    {name:"Rinku Singh", country:"India", role:"Batter", base:1},
    {name:"Tilak Varma", country:"India", role:"Batter", base:1},
    {name:"Faf du Plessis", country:"South Africa", role:"Batter", base:1},
    {name:"David Warner", country:"Australia", role:"Batter", base:1},
    {name:"Jos Buttler", country:"England", role:"Wicketkeeper", base:2},
    {name:"Glenn Maxwell", country:"Australia", role:"All-rounder", base:2},
    {name:"Pat Cummins", country:"Australia", role:"Bowler", base:2},
    {name:"Mitchell Starc", country:"Australia", role:"Bowler", base:2},
    {name:"Trent Boult", country:"New Zealand", role:"Bowler", base:2},
    {name:"Rashid Khan", country:"Afghanistan", role:"Bowler", base:2},
    {name:"Andre Russell", country:"West Indies", role:"All-rounder", base:2},
    {name:"Sunil Narine", country:"West Indies", role:"All-rounder", base:2},
    {name:"Nicholas Pooran", country:"West Indies", role:"Wicketkeeper", base:2},
    {name:"Heinrich Klaasen", country:"South Africa", role:"Wicketkeeper", base:2},
    {name:"Travis Head", country:"Australia", role:"Batter", base:2},
    {name:"Phil Salt", country:"England", role:"Wicketkeeper", base:1.5},
    {name:"Cameron Green", country:"Australia", role:"All-rounder", base:2},
    {name:"Matheesha Pathirana", country:"Sri Lanka", role:"Bowler", base:1.5},
    {name:"Rachin Ravindra", country:"New Zealand", role:"All-rounder", base:1.5},
    {name:"Shivam Dube", country:"India", role:"All-rounder", base:1},
    {name:"Yuzvendra Chahal", country:"India", role:"Bowler", base:1},
    {name:"Ishan Kishan", country:"India", role:"Wicketkeeper", base:2}
].map((p, id) => ({
    ...p,
    id,
    status:"Available",
    soldTo:"",
    soldPrice:0
}));

let selectedPlayerId = null;
let currentBid = 0;
let highestTeam = "";
let auctionFinished = false;

const playerSelect = document.getElementById("playerSelect");
const teamSelect = document.getElementById("teamSelect");

function initialize() {
    teams.forEach(team => {
        teamSelect.innerHTML +=
            `<option value="${team.name}">${team.full}</option>`;
    });

    players.forEach(player => {
        playerSelect.innerHTML +=
            `<option value="${player.id}">${player.name}</option>`;
    });

    displayPlayers();
    displayTeams();
    displayResults();

    selectPlayer(0);
}

function selectPlayer(id) {
    const player = players.find(p => p.id === Number(id));

    if (!player) return;

    if (player.status !== "Available") {
        alert("This player is already " + player.status);
        return;
    }

    selectedPlayerId = player.id;
    currentBid = player.base;
    highestTeam = "";
    auctionFinished = false;

    playerSelect.value = player.id;

    document.getElementById("playerName").textContent = player.name;
    document.getElementById("playerInfo").textContent =
        player.country + " | " + player.role +
        " | Base Price: ₹" + player.base + " Cr";

    document.getElementById("playerAvatar").textContent =
        player.role === "Bowler" ? "🎯" :
        player.role === "Wicketkeeper" ? "🧤" :
        player.role === "All-rounder" ? "🏏" : "🏆";

    updateAuction();
}

function updateAuction() {
    document.getElementById("currentBid").textContent =
        "₹" + currentBid.toFixed(2) + " Cr";

    document.getElementById("bidTeam").textContent =
        highestTeam ? "Highest Bid: " + highestTeam : "Base Price";
}

playerSelect.addEventListener("change", () => {
    selectPlayer(playerSelect.value);
});

function placeBid() {
    const player = players.find(p => p.id === selectedPlayerId);
    const teamName = teamSelect.value;
    const amount = Number(document.getElementById("bidAmount").value);
    const team = teams.find(t => t.name === teamName);

    if (!player || player.status !== "Available" || auctionFinished) {
        alert("Please select an available player.");
        return;
    }

    if (!teamName || !team) {
        alert("Please select a team.");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid bid amount.");
        return;
    }

    if (team.purse < amount) {
        alert("This team does not have enough purse.");
        return;
    }

    if (amount <= currentBid) {
        alert("Your bid must be higher than ₹" +
            currentBid.toFixed(2) + " Cr");
        return;
    }

    currentBid = amount;
    highestTeam = teamName;

    updateAuction();
}

function sellPlayer() {
    const player = players.find(p => p.id === selectedPlayerId);

    if (!player || player.status !== "Available" || auctionFinished) {
        alert("Select an available player first.");
        return;
    }

    if (!highestTeam) {
        alert("Place a bid before selling this player.");
        return;
    }

    const team = teams.find(t => t.name === highestTeam);

    if (!team || team.purse < currentBid) {
        alert("Insufficient team purse.");
        return;
    }

    team.purse -= currentBid;

    player.status = "Sold";
    player.soldTo = highestTeam;
    player.soldPrice = currentBid;

    auctionFinished = true;

    alert(player.name + " SOLD to " + highestTeam +
        " for ₹" + currentBid.toFixed(2) + " Cr!");

    refreshAll();
}

function unsoldPlayer() {
    const player = players.find(p => p.id === selectedPlayerId);

    if (!player || player.status !== "Available" || auctionFinished) {
        alert("Select an available player first.");
        return;
    }

    player.status = "Unsold";
    auctionFinished = true;

    alert(player.name + " is UNSOLD.");

    refreshAll();
}

function displayPlayers() {
    const search = document.getElementById("searchPlayer")
        .value.toLowerCase();

    const role = document.getElementById("roleFilter").value;
    const status = document.getElementById("statusFilter").value;

    const filtered = players.filter(p => {
        const matchesSearch =
            p.name.toLowerCase().includes(search) ||
            p.country.toLowerCase().includes(search) ||
            p.role.toLowerCase().includes(search);

        const matchesRole = role === "All" || p.role === role;
        const matchesStatus = status === "All" || p.status === status;

        return matchesSearch && matchesRole && matchesStatus;
    });

    document.getElementById("playerList").innerHTML =
        filtered.map(p => `
            <div class="player-card">
                <h3>${p.name}</h3>
                <p>${p.country}</p>
                <p>${p.role}</p>
                <p>Base Price: ₹${p.base} Cr</p>
                <span class="status ${p.status}">${p.status}</span>
                ${p.status === "Sold" ?
                    `<p>Team: ${p.soldTo}</p>
                     <p>Price: ₹${p.soldPrice.toFixed(2)} Cr</p>` :
                    ""}
                ${p.status === "Available" ?
                    `<button onclick="selectPlayer(${p.id})">
                        SELECT FOR AUCTION
                     </button>` : ""}
            </div>
        `).join("") || "<p>No players found.</p>";
}

function displayTeams() {
    document.getElementById("teamList").innerHTML =
        teams.map(team => {
            const purchased = players.filter(
                p => p.status === "Sold" && p.soldTo === team.name
            );

            return `
                <div class="team-card">
                    <h3>${team.full}</h3>
                    <p>Remaining Purse</p>
                    <h2>₹${team.purse.toFixed(2)} Cr</h2>
                    <p>Players Bought: ${purchased.length}</p>
                </div>
            `;
        }).join("");
}

function displayResults() {
    const completed = players.filter(
        p => p.status === "Sold" || p.status === "Unsold"
    );

    document.getElementById("resultsBody").innerHTML =
        completed.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${p.soldTo || "-"}</td>
                <td>${p.status === "Sold" ?
                    "₹" + p.soldPrice.toFixed(2) + " Cr" : "-"}</td>
                <td>${p.status}</td>
            </tr>
        `).join("") || `
            <tr>
                <td colspan="4">No auction results yet.</td>
            </tr>
        `;
}

function refreshAll() {
    displayPlayers();
    displayTeams();
    displayResults();
}

initialize();
