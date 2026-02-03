const noBtn = document.getElementById("noBtn");
const achievementSound = document.getElementById("achievementSound");

/* =========================
   NO BUTTON: IMPOSSIBLE MODE
   ========================= */

function moveNoFast() {
  const maxX = window.innerWidth - noBtn.offsetWidth;
  const maxY = window.innerHeight - noBtn.offsetHeight;

  noBtn.style.position = "fixed";
  noBtn.style.left = `${Math.random() * maxX}px`;
  noBtn.style.top = `${Math.random() * maxY}px`;
}

noBtn.addEventListener("mouseover", moveNoFast);
noBtn.addEventListener("touchstart", e => {
  e.preventDefault();
  moveNoFast();
});

/* =========================
   SOUND HELPER
   ========================= */

function playAchievement() {
  if (!achievementSound) return;
  achievementSound.currentTime = 0;
  achievementSound.play().catch(() => {});
}

/* =========================
   PARTICLES (BANANA SMASH)
   ========================= */

function spawnSmashParticles(x, y) {
  const emojis = ["🍌", "🐒", "💥", "✨"];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("span");
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.position = "fixed";
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.fontSize = "20px";
    p.style.pointerEvents = "none";
    p.style.transition = "transform 0.6s ease-out, opacity 0.6s";
    document.body.appendChild(p);

    const dx = (Math.random() - 0.5) * 220;
    const dy = (Math.random() - 0.8) * 220;

    requestAnimationFrame(() => {
      p.style.transform = `translate(${dx}px, ${dy}px)`;
      p.style.opacity = "0";
    });

    setTimeout(() => p.remove(), 600);
  }
}

/* =========================
   YES → BANANA SMASH (BALANCED)
   ========================= */

function sayYes() {
  playAchievement();
  setTimeout(showBananaGame, 300);
}

function showBananaGame() {
  const totalHits = 20;
  const gainPerHit = 100 / totalHits;
  const drainPerSecond = 20;
  const tickMs = 50;

  let progress = 0;
  let hits = 0;
  let over = false;

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
    ">
      <h1>🍌 SMASH THE BANANA 🍌</h1>
      <p>20 hits FAST (but humanly possible)</p>

      <div id="banana" style="
        font-size:130px;
        cursor:pointer;
        outline:none;
        user-select:none;
      ">🍌</div>

      <div style="width:420px;max-width:80vw;height:16px;background:#ddd;border-radius:999px;overflow:hidden;">
        <div id="bar" style="height:100%;width:0%;background:#ff69b4;"></div>
      </div>

      <p>Hits: <span id="hits">0</span> / ${totalHits}</p>
    </div>
  `;

  const banana = document.getElementById("banana");
  const bar = document.getElementById("bar");
  const hitsEl = document.getElementById("hits");

  function setBar(v) {
    progress = Math.max(0, Math.min(100, v));
    bar.style.width = `${progress}%`;
  }

  const drain = setInterval(() => {
    if (!over) setBar(progress - (drainPerSecond * tickMs) / 1000);
  }, tickMs);

  banana.onclick = e => {
    if (over) return;

    spawnSmashParticles(e.clientX, e.clientY);

    hits++;
    hitsEl.textContent = hits;
    setBar(progress + gainPerHit);

    banana.style.transform = "scale(0.9)";
    setTimeout(() => banana.style.transform = "scale(1)", 70);

    if (hits >= totalHits && progress >= 100) {
      over = true;
      clearInterval(drain);
      playAchievement();
      setTimeout(showMemoryGame, 400);
    }
  };
}

/* =========================
   MEMORY MATCH (16 CARDS)
   ========================= */

function showMemoryGame() {
  const icons = ["🍌","🐒","❤️","🎮","🍕","🍷","🎧","🌸"];
  const cards = [...icons, ...icons].sort(() => Math.random() - 0.5);

  let first = null;
  let second = null;
  let lock = false;
  let matches = 0;

  document.body.innerHTML = `
    <div style="
      height:100vh;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      background:linear-gradient(135deg,#ffb6c1,#ffe4e1);
      font-family:system-ui;
      text-align:center;
    ">
      <h1>🐒 MEMORY MATCH 🧠</h1>
      <p>Match all pairs — they stay revealed</p>

      <div id="grid" style="
        display:grid;
        grid-template-columns:repeat(4,80px);
        gap:14px;
        margin-top:20px;
      ">
        ${cards.map((_,i)=>`
          <div class="card" data-i="${i}" style="
            width:80px;height:80px;
            background:white;
            border-radius:12px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:36px;
            cursor:pointer;
            box-shadow:0 6px 12px rgba(0,0,0,0.2);
            user-select:none;
          ">❓</div>
        `).join("")}
      </div>
    </div>
  `;

  document.querySelectorAll(".card").forEach(card => {
    card.onclick = () => {
      if (lock) return;
      if (card.classList.contains("matched")) return;
      if (card === first) return;

      const idx = card.dataset.i;
      card.textContent = cards[idx];

      if (!first) {
        first = card;
        return;
      }

      second = card;
      lock = true;

      if (first.textContent === second.textContent) {
        first.classList.add("matched");
        second.classList.add("matched");
        matches++;
        first = second = null;
        lock = false;

        if (matches === icons.length) {
          playAchievement();
          setTimeout(showRedFlagsGame, 500);
        }
      } else {
        setTimeout(() => {
          first.textContent = "❓";
          second.textContent = "❓";
          first = second = null;
          lock = false;
        }, 700);
      }
    };
  });
}

/* =========================
   FINAL GAME: AVOID RED FLAGS
   ========================= */

function showRedFlagsGame() {
  let start = Date.now();
  let flags = [];
  let monkey = { x: window.innerWidth / 2, y: window.innerHeight - 120 };

  document.body.innerHTML = `
    <div id="game" style="position:relative;height:100vh;background:#ffe4e1;overflow:hidden;">
      <div id="monkey" style="position:absolute;font-size:48px;">🐒</div>
      <p style="position:absolute;top:10px;width:100%;text-align:center;font-family:system-ui;">
        Avoid the red flags for 5 seconds 🚩
      </p>
    </div>
  `;

  const game = document.getElementById("game");
  const monkeyEl = document.getElementById("monkey");

  document.onmousemove = e => {
    monkey.x = e.clientX;
    monkey.y = e.clientY;
    monkeyEl.style.left = monkey.x + "px";
    monkeyEl.style.top = monkey.y + "px";
  };

  const interval = setInterval(() => {
    if (Math.random() < 0.3) {
      const f = document.createElement("div");
      f.textContent = "🚩";
      f.style.position = "absolute";
      f.style.left = Math.random() * window.innerWidth + "px";
      f.style.top = "-40px";
      f.style.fontSize = "36px";
      game.appendChild(f);
      flags.push(f);
    }

    flags.forEach(f => {
      f.style.top = f.offsetTop + 6 + "px";

      const dx = f.offsetLeft - monkey.x;
      const dy = f.offsetTop - monkey.y;
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
        clearInterval(interval);
        showRedFlagsGame();
      }
    });

    if (Date.now() - start > 5000) {
      clearInterval(interval);
      playAchievement();
      setTimeout(showFinalScreen, 400);
    }
  }, 50);
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
      background:linear-gradient(135deg,#ffb6c1,#ffe4e1);
      font-family:system-ui;
      text-align:center;
    ">
      <div>
        <h1>🏆 ALL ACHIEVEMENTS UNLOCKED 🏆</h1>
        <h2>💖 VALENTINE CONFIRMED 💖</h2>

        <p>
          You passed every test 😌<br><br>
          📍 Mystery location<br>
          🗓️ This weekend<br>
          🍝 Food involved<br>
          🐒 Monkey approves
        </p>
      </div>
    </div>
  `;
}
