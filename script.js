const noBtn = document.getElementById("noBtn");
const achievementSound = document.getElementById("achievementSound");

/* =========================
   NO BUTTON: IMPOSSIBLE MODE
   ========================= */

function moveNoFast() {
  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  const maxX = window.innerWidth - btnWidth;
  const maxY = window.innerHeight - btnHeight;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.position = "fixed";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

noBtn.addEventListener("mouseover", moveNoFast);
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoFast();
});

/* =========================
   YES → HARD BANANA SMASH
   ========================= */

function sayYes() {
  // Play sound safely
  if (achievementSound) {
    achievementSound.currentTime = 0;
    achievementSound.play().catch(() => {});
  }

  // Load game screen
  setTimeout(showBananaGameHard, 250);
}

function showBananaGameHard() {
  // HARD SETTINGS
  const totalHits = 20;                 // must reach 20
  const gainPerHit = 100 / totalHits;   // +5% per click
  const drainPerSecond = 25;            // HARD: bar drains 18% per second
  const tickMs = 50;                    // update 20 times/sec

  let progressPct = 0;                  // 0..100
  let hits = 0;
  let gameOver = false;

  document.body.innerHTML = `
    <div style="
      height:100vh;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      background:linear-gradient(135deg,#ffe4e1,#ffb6c1);
      font-family:system-ui;
      text-align:center;
      user-select:none;
      padding:20px;
    ">
      <h1 style="margin:0 0 6px 0;">🍌 SMASH THE BANANA 🍌</h1>
      <p id="bananaText" style="margin:0 0 18px 0;">
        Get to 20 hits FAST. If you slow down, the bar drains 😈
      </p>

      <div
        id="banana"
        style="
          font-size:130px;
          cursor:pointer;
          margin:10px 0 18px 0;
          transition:transform 0.08s;
          filter: drop-shadow(0 8px 12px rgba(0,0,0,0.2));
        "
        title="SMASH"
      >🍌</div>

      <div style="
        width:min(420px, 80vw);
        height:16px;
        background:#ddd;
        border-radius:999px;
        overflow:hidden;
        box-shadow: inset 0 2px 6px rgba(0,0,0,0.15);
      ">
        <div
          id="progress"
          style="
            height:100%;
            width:0%;
            background:#ff69b4;
            transition:width ${tickMs}ms linear;
          "
        ></div>
      </div>

      <p style="margin:10px 0 0 0;font-size:14px;">
        Hits: <span id="hitCount">0</span> / ${totalHits}
        &nbsp;•&nbsp;
        Power: <span id="powerPct">0</span>%
      </p>

      <p id="hint" style="margin-top:14px;font-size:13px;opacity:0.85;">
        Pro tip: rapid clicks, no mercy.
      </p>
    </div>
  `;

  const banana = document.getElementById("banana");
  const progressEl = document.getElementById("progress");
  const hitCountEl = document.getElementById("hitCount");
  const powerPctEl = document.getElementById("powerPct");
  const bananaTextEl = document.getElementById("bananaText");
  const hintEl = document.getElementById("hint");

  function setProgress(p) {
    progressPct = Math.max(0, Math.min(100, p));
    progressEl.style.width = `${progressPct}%`;
    powerPctEl.textContent = Math.round(progressPct);
  }

  // Drain loop
  const drainPerTick = (drainPerSecond * tickMs) / 1000;
  const drainTimer = setInterval(() => {
    if (gameOver) return;
    setProgress(progressPct - drainPerTick);

    // If he keeps failing, roast gently
    if (progressPct === 0 && hits > 0) {
      hintEl.textContent = "Too slow… the banana is winning 😭";
    }
  }, tickMs);

  function win() {
    gameOver = true;
    clearInterval(drainTimer);
    showFinalScreen();
  }

  banana.addEventListener("click", () => {
    if (gameOver) return;

    // Visual smack
    banana.style.transform = "scale(0.92) rotate(-6deg)";
    setTimeout(() => {
      banana.style.transform = "scale(1) rotate(0deg)";
    }, 70);

    // Update counters
    hits++;
    hitCountEl.textContent = hits;

    // Add progress
    setProgress(progressPct + gainPerHit);

    // Dynamic taunts
    if (hits === 5) bananaTextEl.textContent = "Okay okay… not bad 😏";
    if (hits === 10) bananaTextEl.textContent = "HALFWAY. Don’t choke now.";
    if (hits === 15) bananaTextEl.textContent = "🧠 Focus. Click faster.";
    if (hits >= totalHits && progressPct >= 100) {
      win();
    } else if (hits >= totalHits) {
      // If he got 20 hits but meter drained, make it clear it's combo-based
      bananaTextEl.textContent = "20 hits isn’t enough… you need SPEED 😈";
      hintEl.textContent = "You must fill the bar before it drains.";
    }
  });
}

/* =========================
   FINAL SCREEN
   ========================= */

function showFinalScreen() {
  document.body.innerHTML = `
    <div style="
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      text-align:center;
      padding:20px;
      background:linear-gradient(135deg,#ffb6c1,#ffe4e1);
      font-family:system-ui;
    ">
      <div>
        <h1>🏆 ACHIEVEMENT UNLOCKED 🏆</h1>
        <h2>✨ Banana Boss Defeated ✨</h2>

        <p style="font-size:18px;margin-top:20px">
          Respect. You earned the date 💖<br><br>
          📍 Mystery location<br>
          🗓️ This weekend<br>
          🍝 Food involved<br>
          🐒 Monkeys celebrating
        </p>

        <p style="margin-top:25px;font-size:16px">
          <strong>Reward:</strong><br>
          Lifetime Player 2 access ❤️
        </p>
      </div>
    </div>
  `;
}

