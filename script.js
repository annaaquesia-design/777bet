const events = [
  {id:1, title:"Futebol — Amigos FC x Galera FC", time:"Hoje • 20:00", options:[
    ["Amigos FC",1.80],["Empate",3.20],["Galera FC",2.10]
  ]},
  {id:2, title:"Futebol — Azul FC x Vermelho FC", time:"Amanhã • 18:30", options:[
    ["Azul FC",2.00],["Empate",3.00],["Vermelho FC",1.75]
  ]},
  {id:3, title:"Desafio — Ana x Bia", time:"Sábado • 16:00", options:[
    ["Ana",1.90],["Empate",3.50],["Bia",1.95]
  ]}
];

let balance = 1000;
let selection = null;

const eventsEl = document.getElementById("events");
const ticketItems = document.getElementById("ticketItems");
const stakeEl = document.getElementById("stake");
const potentialEl = document.getElementById("potential");
const betBtn = document.getElementById("betBtn");

function renderEvents() {
  eventsEl.innerHTML = events.map(e => `
    <div class="event">
      <div class="event-title">${e.title}</div>
      <div class="event-time">${e.time}</div>
      <div class="odds">
        ${e.options.map((o,i)=>`
          <button class="odd" onclick="selectOdd(${e.id},${i})">
            ${o[0]} <b>${o[1].toFixed(2)}</b>
          </button>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function selectOdd(eventId, optionIndex) {
  const event = events.find(e => e.id === eventId);
  selection = {
    event: event.title,
    choice: event.options[optionIndex][0],
    odd: event.options[optionIndex][1]
  };
  renderTicket();
}

function renderTicket() {
  if (!selection) {
    ticketItems.innerHTML = '<p class="empty">Escolha uma cotação para começar.</p>';
    betBtn.disabled = true;
    potentialEl.textContent = "0";
    return;
  }
  ticketItems.innerHTML = `
    <div class="ticket-item">
      <strong>${selection.choice}</strong><br>
      <small>${selection.event}</small><br>
      <small>Cotação: ${selection.odd.toFixed(2)}</small>
    </div>`;
  betBtn.disabled = false;
  updatePotential();
}

function updatePotential() {
  const stake = Math.max(0, Number(stakeEl.value) || 0);
  potentialEl.textContent = Math.floor(stake * (selection?.odd || 0)).toLocaleString("pt-BR");
}

stakeEl.addEventListener("input", updatePotential);

betBtn.addEventListener("click", () => {
  const stake = Number(stakeEl.value);
  if (!selection || stake < 1) return showToast("Digite uma quantidade válida.");
  if (stake > balance) return showToast("Você não tem moedas suficientes.");

  balance -= stake;
  document.getElementById("balance").textContent = balance.toLocaleString("pt-BR");
  showToast(`Aposta virtual registrada: ${stake} 🪙`);
  selection = null;
  stakeEl.value = 100;
  renderTicket();
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(()=>toast.style.display="none", 2500);
}

function renderRanking() {
  const players = [
    ["🥇", "Você", balance],
    ["🥈", "João", 875],
    ["🥉", "Maria", 760],
    ["4º", "Lucas", 610]
  ];
  document.getElementById("ranking").innerHTML = players.map(p => `
    <div class="rank-row">
      <span><span class="rank-pos">${p[0]}</span>${p[1]}</span>
      <strong>${p[2].toLocaleString("pt-BR")} 🪙</strong>
    </div>
  `).join("");
}

renderEvents();
renderTicket();
renderRanking();
