let game = document.getElementById('game');
let message = document.getElementById('message');
let startBtn = document.getElementById('startBtn');
let summary = document.getElementById('summary');
let resultsBody = document.getElementById('results-body');

let attempt = 0;
let reactionTimes = [];
let timeoutID;
let startTime;

function reset() {
  attempt = 0;
  reactionTimes = [];
  resultsBody.innerHTML = `
    <tr><td>1</td><td>-</td></tr>
    <tr><td>2</td><td>-</td></tr>
    <tr><td>3</td><td>-</td></tr>
  `;
  summary.innerHTML = '';
  game.className = 'waiting';
  message.textContent = 'Click "Start" to begin';
}

function startRound() {
  game.className = 'waiting';
  message.textContent = 'Wait for green...';
  timeoutID = setTimeout(() => {
    game.className = 'ready';
    message.textContent = 'CLICK!';
    startTime = Date.now();
  }, Math.random() * 3000 + 2000);
}

function showFinalResults() {
  const avg = Math.round(reactionTimes.reduce((a, b) => a + b) / reactionTimes.length);

  const safetyMessages = [
    "Did you know? A driver who is fit and alert and not affected by alcohol, drugs or fatigue, needs at least **2.5 seconds** to perceive and react to a hazard?. Stay alert!",
    "Pre-collision warning systems help drivers react in time, reducing the risk of crashes caused by delayed reactions.",
    "On average, a distracted driver’s reaction time increases by up to **0.5 seconds**, making collisions more likely.",
    "Braking distance is only part of the equation — delayed reaction adds crucial meters before you even touch the brakes.",
    "Fatigue can slow reaction time by **30% or more**. Always rest before driving!",
    "Using alert systems like MCAS can give riders precious milliseconds to avoid a crash.",
    "Reaction time is the time a driver needs to see and understand a situation, decide on a response, and then start to take action"
  ];

  const randomMessage = safetyMessages[Math.floor(Math.random() * safetyMessages.length)];

  summary.innerHTML = `
    <strong>Average Reaction Time:</strong> ${avg} ms<br><br>
    <div class="safety-message">${randomMessage}</div>
    <br>Click "Start" to try again.
  `;
}


startBtn.addEventListener('click', () => {
  reset();
  startRound();
});

game.addEventListener('click', () => {
  if (game.className === 'ready') {
    let reactionTime = Date.now() - startTime;
    reactionTimes.push(reactionTime);
    resultsBody.rows[attempt].cells[1].textContent = `${reactionTime} ms`;
    attempt++;
    if (attempt < 3) {
      game.className = 'result';
      message.textContent = `Your time: ${reactionTime} ms. Click to continue.`;
    } else {
      showFinalResults();
      game.className = 'result';
      message.textContent = 'Done! See results.';
    }
  } else if (game.className === 'waiting') {
    game.className = 'too-soon';
    message.textContent = 'Too soon! Wait for green.';
    clearTimeout(timeoutID);
  } else if (game.className === 'result' || game.className === 'too-soon') {
    if (attempt < 3) {
      startRound();
    }
  }
});
