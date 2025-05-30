let startBtn = document.getElementById("startBtn");
let gameBox = document.getElementById("game");
let message = document.getElementById("message");
let resultsBody = document.getElementById("results-body");
let summary = document.getElementById("summary");
let playCountDisplay = document.getElementById("play-count");
let fastestTimeDisplay = document.getElementById("fastest-time");

let playCount = parseInt(localStorage.getItem("playCount")) || 0;
let fastestTime = parseInt(localStorage.getItem("fastestTime")) || null;

playCountDisplay.textContent = `Games Played: ${playCount}`;
updateFastestTimeDisplay();

let state = "waiting";
let startTime;
let timeout;
let results = [];
let attempt = 0;

startBtn.addEventListener("click", () => {
  results = [];
  attempt = 0;
  summary.textContent = "";
  updateTable();
  startRound();
});

function startRound() {
  gameBox.className = "waiting";
  message.textContent = "Wait for green...";
  state = "waiting";

  timeout = setTimeout(() => {
    gameBox.className = "ready";
    message.textContent = ""; 
    startTime = Date.now();
    state = "ready";
  }, Math.random() * 2000 + 2000);
}

gameBox.addEventListener("click", () => {
  if (state === "waiting") {
    clearTimeout(timeout);
    message.textContent = "Too soon! Click Start to try again.";
    gameBox.className = "waiting";
    state = "waiting";
  } else if (state === "ready") {
    let reactionTime = Date.now() - startTime;
    results.push(reactionTime);
    attempt++;
    message.textContent = `Reaction Time: ${reactionTime} ms`;
    gameBox.className = "waiting";

    updateTable();

    if (attempt < 3) {
      setTimeout(startRound, 1000);
    } else {
      showSummary();
    }

    state = "waiting";
  }
});

function updateTable() {
  for (let i = 0; i < 3; i++) {
    resultsBody.rows[i].cells[1].textContent = results[i] ? `${results[i]} ms` : "-";
  }
}

function showSummary() {
  let average = results.reduce((a, b) => a + b, 0) / results.length;
  summary.textContent = `Average Reaction Time: ${Math.round(average)} ms`;

  // Update local play count
  playCount++;
  localStorage.setItem("playCount", playCount);
  playCountDisplay.textContent = `Games Played: ${playCount}`;

  // Update fastest time
  let currentFastest = Math.min(...results);
  if (fastestTime === null || currentFastest < fastestTime) {
    fastestTime = currentFastest;
    localStorage.setItem("fastestTime", fastestTime);
    updateFastestTimeDisplay();
  }
}

function updateFastestTimeDisplay() {
  if (fastestTime !== null) {
    fastestTimeDisplay.textContent = `Fastest Reaction Time: ${fastestTime} ms`;
  } else {
    fastestTimeDisplay.textContent = "Fastest Reaction Time: - ms";
  }
}

function showSummary() {
  let average = Math.round(results.reduce((a, b) => a + b, 0) / results.length);

  // Update local play count
  playCount++;
  localStorage.setItem("playCount", playCount);
  playCountDisplay.textContent = `Games Played: ${playCount}`;

  // Update fastest time
  let currentFastest = Math.min(...results);
  if (fastestTime === null || currentFastest < fastestTime) {
    fastestTime = currentFastest;
    localStorage.setItem("fastestTime", fastestTime);
    updateFastestTimeDisplay();
  }

  // Display random road safety message
  const safetyMessages = [
    "Did you know? Drivers need at least <strong>2.5 seconds</strong> to perceive and react to a hazard. Stay alert!",
    "Pre-collision warning systems help drivers react in time, reducing the risk of crashes caused by delayed reactions.",
    "On average, a distracted driver’s reaction time increases by up to <strong>0.5 seconds</strong>, making collisions more likely.",
    "Braking distance is only part of the equation — delayed reaction adds crucial meters before you even touch the brakes.",
    "Fatigue can slow reaction time by <strong>30% or more</strong>. Always rest before driving!",
    "Using alert systems like MCAS can give riders precious milliseconds to avoid a crash."
  ];

  const randomMessage = safetyMessages[Math.floor(Math.random() * safetyMessages.length)];

  summary.innerHTML = `
    <strong>Average Reaction Time:</strong> ${average} ms<br><br>
    <div class="safety-message">${randomMessage}</div>
    <br>Click "Start" to try again.
  `;
}
