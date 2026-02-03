const watchlist = ["arbitrum","chainlink","optimism","avalanche"];

const wallet = { bitcoin:29, ethereum:13, solana:4 };

const btc = document.getElementById("btc");
const eth = document.getElementById("eth");
const sol = document.getElementById("sol");
const alerts = document.getElementById("alerts");
const historyBox = document.getElementById("history");

function getTime(){
 const d = new Date();
 return d.toLocaleString();
}

function loadHistory(){
 const h = JSON.parse(localStorage.getItem("cryptoHistory")) || [];
 historyBox.innerHTML = "";
 h.forEach(i=>{
  historyBox.innerHTML += `<div class="history-item">${i}</div>`;
 });
}

function addAlert(msg){

alerts.innerHTML += `<div class="alert">${msg}</div>`;

let history = JSON.parse(localStorage.getItem("cryptoHistory")) || [];

history.unshift(`🕒 ${getTime()} — ${msg}`);

history = history.slice(0,10);

localStorage.setItem("cryptoHistory",JSON.stringify(history));

loadHistory();
}

async function loadPrices(){

alerts.innerHTML="";

const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true");
const data = await res.json();

btc.innerHTML = `<h3>Bitcoin</h3>$${data.bitcoin.usd}<br>24h: ${data.bitcoin.usd_24h_change.toFixed(2)}%`;
eth.innerHTML = `<h3>Ethereum</h3>$${data.ethereum.usd}<br>24h: ${data.ethereum.usd_24h_change.toFixed(2)}%`;
sol.innerHTML = `<h3>Solana</h3>$${data.solana.usd}<br>24h: ${data.solana.usd_24h_change.toFixed(2)}%`;

if(data.solana.usd_24h_change<-8) addAlert("⚠️ SOL caiu forte");
if(data.ethereum.usd_24h_change<-6) addAlert("⚠️ ETH queda relevante");
if(data.bitcoin.usd_24h_change<-5) addAlert("⚠️ BTC fraco");

addAlert(`💰 Carteira: $${(wallet.bitcoin+wallet.ethereum+wallet.solana).toFixed(2)}`);
}

async function scanOpportunities(){

const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${watchlist.join(",")}&vs_currencies=usd&include_24hr_change=true`);
const coins = await res.json();

for(let c in coins){
 if(coins[c].usd_24h_change>10)
  addAlert(`🚀 ${c.toUpperCase()} rompendo forte`);
}
}

loadHistory();
loadPrices();
scanOpportunities();

setInterval(()=>{loadPrices();scanOpportunities();},30000);
