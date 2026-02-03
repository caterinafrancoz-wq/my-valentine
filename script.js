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
  if (achievementSound) {
    achievementSound.currentTime = 0;
    achievementSound.play().catch(() => {});
  }
  setTimeout(showBananaGameHard, 250);
}

function showBananaGameHard() {
  const totalHits = 20;
  const gainPerHit = 100 / totalHits;
  const drainPerSecond = 25;
  const tickMs = 50;

  let progressPct = 0;
  let hits = 0;
  let gameOver = false;

  document.body.innerHTML = `
    <div id="game" style="
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
      overflow:hidden;
    ">
      <h1>🍌 SMASH THE BANANA 🍌</h1>
      <p id="bananaText">Get to 20 hits FAST or the bar drains 😈</p>

      <div
        id="banana"
        style="
          font-size:130px;
          cursor:pointer;
          margin:12px 0 20px 0;
          transition:transform 0.08s;
          filter: drop-shadow(0 8px 12px rgba(0,0,0,0.2));
        "
      >🍌</div>

      <div style="
        width:min(420px, 80vw);
        height:16px;
        background:#ddd;
        border-radius:999px;
        overflow:hidden;
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

      <p style="margin-top:10px;font-size:14px;">
        Hits: <span id="hitCount">0</span> / ${totalHits}
        • Power: <span id="powerPct">0</span>%
      </p>

      <div id="particles"></div>
    </div>
  `;

  const banana = document.getElementById("banana");
  const progressEl = document.getElementById("progress");
  const hitCountEl = document.getElementById("hitCount");
  const powerPctEl = document.getElementById("powerPct");
  const bananaTextEl = document.getElementById("bananaText");
  const particles = document.getElementById("particles");

  function setProgress(p) {
    progressPct = Math.max(0, Math.min(100, p));
    progressEl.style.width = `${progressPct}%`;
    powerPctEl.textContent = Math.round(progressPct);
  }

  /* 🍌 PARTICLES */
  function spawnParticles(x, y) {
    const emojis = ["🍌", "💥", "✨"];
    for (let i = 0; i < 10; i++) {
      const p = document.createElement("span");
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.position = "fixed";
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.pointerEvents = "none";
      p.style.fontSize = "18px";
      p.style.transition = "transform 0.6s ease-out, opacity 0.6s";
      particles.appendChild(p);

      const dx = (Math.random() - 0.5) * 200;
      const dy = Math.random() * -200;

      requestAnimationFrame(() => {
        p.style.transform = `translate(${dx}px, ${dy}px)`;
        p.style.opacity = "0";
      });

      setTimeout(() => p.remove(), 600);
    }
  }

  /* Drain loop */
  const drainPerTick = (drainPerSecond * tickMs) / 1000;
  const drainTimer = setInterval(() => {
    if (!gameOver) setProgress(progressPct - drainPerTick);
  }, tickMs);

  function win() {
    gameOver = true;
    clearInterval(drainTimer);
    showFinalScreen();
  }

  banana.addEventListener("click", (e) => {
    if (gameOver) return;

    // Smash animation
    banana.style.transform = "scale(0.92) rotate(-6deg)";
    setTimeout(() => {
      banana.style.transform = "scale(1) rotate(0deg)";
    }, 70);

    // Particles
    spawnParticles(e.clientX, e.clientY);

    hits++;
    hitCountEl.textContent = hits;
    setProgress(progressPct + gainPerHit);

    // 🐒 Monkey cheers
    if (hits === 10) bananaTextEl.textContent = "🐒 OOH OOH! Halfway!";
    if (hits === 15) bananaTextEl.textContent = "🐒 SCREAMING. KEEP GOING.";

    if (hits >= totalHits && progressPct >= 100) {
      win();
    } else if (hits >= totalHits) {
      bananaTextEl.textContent = "Too slow 😈 SPEED MATTERS.";
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
        <h2>🐒🍌 BANANA BOSS DEFEATED 🍌🐒</h2>

        <p style="font-size:18px;margin-top:20px">
          Absolute gamer behaviour 💖<br><br>
          📍 Mystery location<br>
          🗓️ This weekend<br>
          🍝 Food involved<br>
          🐒 Monkeys cheering violently
        </p>

        <p style="margin-top:25px;font-size:16px">
          <strong>Reward:</strong><br>
          Lifetime Player 2 access ❤️
        </p>
      </div>
    </div>
  `;
}
