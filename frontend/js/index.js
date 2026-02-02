let LOOT_WEIGHTS = {};

// 1. Initialisatie: Haal data op en teken de velden
document.addEventListener('DOMContentLoaded', async () => {
    await fetchWeights();
    generatePlayerFields();
});

// 2. Weights ophalen van de Backend
async function fetchWeights() {
    try {
        const response = await fetch('http://localhost:8080/api/heist/loot-weights');
        LOOT_WEIGHTS = await response.json();
    } catch (err) {
        console.error("Kon weights niet laden, gebruik fallback:", err);
        LOOT_WEIGHTS = { 'GOLD': 0.66, 'COCAINE': 0.50, 'CASH': 0.25, 'WEED': 0.33, 'PAINTING': 0.50 };
    }
}

// 3. Spelersvelden genereren
function generatePlayerFields() {
    const count = document.getElementById('playerCount').value;
    const container = document.getElementById('playersContainer');
    if (!container) return;

    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        container.innerHTML += `
            <div class="player-card mb-4 p-3 rounded shadow-sm border border-secondary bg-dark bg-opacity-25">
                <div class="row mb-3">
                    <div class="col-md-1 fw-bold text-warning">#${i}</div>
                    <div class="col-md-7">
                        <input type="text" class="form-control p-name" value="Speler ${i}">
                    </div>
                    <div class="col-md-4">
                        <div class="input-group">
                            <input type="number" class="form-control p-cut" value="${i === 1 ? 85 : 15}" oninput="validateCuts()">
                            <span class="input-group-text bg-dark text-white">%</span>
                        </div>
                    </div>
                </div>
                
                <div class="progress mb-3" style="height: 15px; background-color: #333;">
                    <div id="bag-bar-${i}" class="progress-bar bg-info" role="progressbar" style="width: 0%">0% Vol</div>
                </div>

                <div id="loot-container-${i}" class="mb-3"></div>
                
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-sm btn-outline-light" onclick="addLoot(${i})">+ Loot</button>
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-warning dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            ✨ Vul rest met...
                        </button>
                        <ul class="dropdown-menu dropdown-menu-dark">
                            <li><button class="dropdown-item" type="button" onclick="fillRemainingBag(${i}, 'GOLD')">Goud</button></li>
                            <li><button class="dropdown-item" type="button" onclick="fillRemainingBag(${i}, 'COCAINE')">Cocaine</button></li>
                            <li><button class="dropdown-item" type="button" onclick="fillRemainingBag(${i}, 'WEED')">Wiet</button></li>
                            <li><button class="dropdown-item" type="button" onclick="fillRemainingBag(${i}, 'CASH')">Cash</button></li>
                        </ul>
                    </div>
                </div>
            </div>`;
    }
    validateCuts();
}

// 4. Loot toevoegen aan een speler
function addLoot(playerIndex, type = "GOLD", amount = 0.5) {
    const lootContainer = document.getElementById(`loot-container-${playerIndex}`);
    const div = document.createElement('div');
    div.className = 'input-group mb-2 loot-item shadow-sm';

    let optionsHtml = '';
    for (const key in LOOT_WEIGHTS) {
        optionsHtml += `<option value="${key}" ${type === key ? 'selected' : ''}>${key}</option>`;
    }

    div.innerHTML = `
        <select class="form-select loot-type" onchange="updateBagProgress(${playerIndex})">
            ${optionsHtml}
        </select>
        <input type="number" class="form-control loot-amount" step="0.01" value="${amount}" oninput="updateBagProgress(${playerIndex})">
        <button class="btn btn-outline-danger" onclick="this.parentElement.remove(); updateBagProgress(${playerIndex});">×</button>
    `;
    lootContainer.appendChild(div);
    updateBagProgress(playerIndex);
}

// 5. Tasinhoud visueel updaten
function updateBagProgress(playerIndex) {
    let totalWeight = 0;
    const items = document.querySelectorAll(`#loot-container-${playerIndex} .loot-item`);

    items.forEach(item => {
        const type = item.querySelector('.loot-type').value;
        const amount = parseFloat(item.querySelector('.loot-amount').value) || 0;
        totalWeight += (amount * (LOOT_WEIGHTS[type] || 0));
    });

    const progressBar = document.getElementById(`bag-bar-${playerIndex}`);


    const percentage = Math.round(totalWeight * 100);

    progressBar.style.width = Math.min(percentage, 100) + "%";
    progressBar.innerText = percentage + "% Vol";

    if (percentage > 100) {
        progressBar.classList.remove('bg-info', 'bg-success');
        progressBar.classList.add('bg-danger'); // Te vol (>100)
    } else if (percentage === 100) {
        progressBar.classList.remove('bg-info', 'bg-danger');
        progressBar.classList.add('bg-success'); // 99% of 100% is nu beide groen
    } else {
        progressBar.classList.remove('bg-danger', 'bg-success');
        progressBar.classList.add('bg-info'); // Nog ruimte over
    }
}

// 6. Vul de rest van de tas automatisch
function fillRemainingBag(playerIndex, fillType) {
    let currentWeight = 0;
    const items = document.querySelectorAll(`#loot-container-${playerIndex} .loot-item`);

    items.forEach(item => {
        const type = item.querySelector('.loot-type').value;
        const amount = parseFloat(item.querySelector('.loot-amount').value) || 0;
        currentWeight += (amount * (LOOT_WEIGHTS[type] || 0));
    });

    const remaining = 1.0 - currentWeight;
    if (remaining <= 0.01) return alert("Tas is al vol!");

    const typeKey = fillType.toUpperCase();
    if (LOOT_WEIGHTS[typeKey]) {
        let needed = remaining / LOOT_WEIGHTS[typeKey];

        addLoot(playerIndex, typeKey, parseFloat(needed.toFixed(2)));
    }
}

// 7. Cuts valideren (moet 100% zijn)
function validateCuts() {
    let total = 0;
    document.querySelectorAll('.p-cut').forEach(input => {
        total += parseInt(input.value) || 0;
    });

    const errorBox = document.getElementById('errorBox');
    if (total !== 100) {
        errorBox.innerText = `Totaal percentage: ${total}%. Moet 100% zijn.`;
        errorBox.classList.remove('d-none');
    } else {
        errorBox.classList.add('d-none');
    }
}

// 8. Berekening versturen naar Backend
async function calculate() {
    const errorBox = document.getElementById('errorBox');
    const resultBox = document.getElementById('resultBox');
    errorBox.classList.add('d-none');

    const players = [];
    let totalCut = 0;

    const miniVaultValue = parseFloat(document.getElementById('miniVault').value) || 0;

    const vaultInput = document.getElementById('miniVault');
    if (vaultInput.classList.contains('is-invalid')) {
        return; // Stop de functie hier
    }

    const overfilledBags = document.querySelectorAll('.progress-bar.bg-danger');
    if (overfilledBags.length > 0) {
        const errorBox = document.getElementById('errorBox');
        errorBox.innerText = "Eén of meerdere tassen zijn te vol (>100%)!";
        errorBox.classList.remove('d-none');
        return; // STOP de functie hier
    }

    document.querySelectorAll('.player-card').forEach((card, index) => {
        const cut = parseInt(card.querySelector('.p-cut').value) || 0;
        totalCut += cut;

        const lootItems = [];
        card.querySelectorAll('.loot-item').forEach(item => {
            lootItems.push({
                secondaryLoot: item.querySelector('.loot-type').value,
                amount: parseFloat(item.querySelector('.loot-amount').value) || 0
            });
        });

        players.push({
            name: card.querySelector('.p-name').value,
            playerCut: cut,
            bagContents: lootItems
        });
    });

    if (totalCut !== 100) {
        errorBox.innerText = `Totaal percentage ${totalCut}%. Moet 100% zijn.`;
        errorBox.classList.remove('d-none');
        return; // HIER wordt het versturen echt tegengehouden
    }// validateCuts laat de error al zien

    try {
        const requestData = {
            difficulty: document.getElementById('difficulty').value,
            elite: document.getElementById('elite').checked,
            miniVault: miniVaultValue,
            primaryTarget: document.getElementById('primaryTarget').value,
            players: players
        };

        const response = await fetch('https://gta-project.onrender.com/api/heist/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '';

        for (const [name, amount] of Object.entries(data)) {
            resultsList.innerHTML += `<li class="list-group-item bg-transparent text-white d-flex justify-content-between">
                ${name} <span>$ ${amount.toLocaleString('nl-NL')}</span>
            </li>`;
        }
        resultBox.classList.remove('d-none');
    } catch (err) {
        errorBox.innerText = "Server fout: " + err.message;
        errorBox.classList.remove('d-none');
    }
}

// Wacht tot de pagina geladen is
document.addEventListener('DOMContentLoaded', () => {
    const miniVaultInput = document.getElementById('miniVault');

    if (miniVaultInput) {
        miniVaultInput.addEventListener('input', function() {
            const val = parseFloat(this.value);
            // We tellen een leeg veld als 0
            //const numericVal = isNaN(val) ? 0 : val;

            // De logica: 0 of tussen 50k en 100k
            const isValid = !isNaN(val) && (val === 0 || (val >= 50000 && val <= 100000));

            if (isValid) {
                this.classList.remove('is-invalid');
                document.getElementById("melding").style.display = 'block';
                // Optioneel: voeg 'is-valid' toe voor een groene rand
                // this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
                document.getElementById("melding").style.display = 'none';
            }
        });
    }
});