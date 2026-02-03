const noBtn = document.getElementById("noBtn");
const achievementSound = document.getElementById("achievementSound");

/* =========================
   NO BUTTON — IMPOSSIBLE
   ========================= */

function moveNoFast() {
  const maxX = window.innerWidth - noBtn.offsetWidth;
  const maxY = window.innerHeight - noBtn.offsetHeight;
  noBtn.style.position = "fixed";
  noBtn.style.left = Math.random() * maxX + "px";
  noBtn.style.top = Math.random() * maxY + "px";
}

noBtn.addEventListener("mouseover", moveNoFast);
noBtn.addEventListener("touchstart", e => {
  e.preventDefault();
  moveNoFast();
});

/* =========================
   SOUND
   ========================= */

function playAchievement() {
  if (!achievementSound) return;
  achievementSound.currentTime = 0;
  achievementSound.play().catch(() => {});
}

/* =========================
   FLOATING BACKGROUND
   ========================= */

function startFloatingBackground() {
  const emojis = ["🍌", "🐒", "❤️"];
  const layer = document.createElement("div");
  layer.id = "floatingLayer";
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  document.body.appendChild(layer);

  return setInterval(() => {
    const e = document.createElement("span");
    e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    e.style.position = "absolute";
    e.style.left = Math.random() * 100 + "vw";
    e.style.top = "100vh";
    e.style.fontSize = 18 + Math.random() * 22 + "px";
    e.style.opacity = "0.8";
    e.style.transition = "transform 6s linear, opacity 6s linear";
    layer.appendChild(e);

    requestAnimationFrame(() => {
      e.style.transform = "translateY(-120vh)";
      e.style.opacity = "0";
    });

    setTimeout(() => e.remove(), 6000);
  }, 400);
}

/* =========================
   SMASH PARTICLES
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
    p.style.transition = "transform .6s, opacity .6s";
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
   YES → BANANA SMASH
   ========================= */

function sayYes() {
  playAchievement();
  setTimeout(showBananaGame, 300);
}

function showBananaGame() {
  const totalHits = 20;
  const drainPerSecond = 3;

  let hits = 0;
  let progress = 0;
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
      <h1>🍌 Smash the Banana 🍌</h1>
      <p style="opacity:.85">A little chaos never hurt anyone</p>

      <div id="banana" style="font-size:130px;cursor:pointer;outline:none;">🍌</div>

      <div style="width:420px;max-width:80vw;height:16px;background:#ddd;border-radius:999px;overflow:hidden;">
        <div id="bar" style="height:100%;width:0%;background:#ff69b4;"></div>
      </div>

      <p>Hits: <span id="hits">0</span> / 20</p>
    </div>
  `;

  const bgInterval = startFloatingBackground();
  const banana = document.getElementById("banana");
  const bar = document.getElementById("bar");
  const hitsEl = document.getElementById("hits");

  const drain = setInterval(() => {
    if (!over) {
      progress = Math.max(0, progress - drainPerSecond / 20);
      bar.style.width = progress + "%";
    }
  }, 50);

  banana.onclick = e => {
    if (over) return;

    spawnSmashParticles(e.clientX, e.clientY);
    hits++;
    hitsEl.textContent = hits;
    progress = Math.min(100, progress + 5);
    bar.style.width = progress + "%";

    if (hits >= totalHits && progress >= 100) {
      over = true;
      clearInterval(drain);
      clearInterval(bgInterval);
      document.getElementById("floatingLayer")?.remove();
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
      <h1>🐒 Monkey Memory Match 🧠</h1>
      <p style="opacity:.85">Focus… the monkey believes in you</p>

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
            user-select:none;
          ">❓</div>
        `).join("")}
      </div>
    </div>
  `;

  document.querySelectorAll(".card").forEach(card => {
    card.onclick = () => {
      if (lock || card.classList.contains("matched") || card === first) return;

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
   RED FLAGS — HARD MODE
   ========================= */

function showRedFlagsGame() {
  let start = Date.now();
  let monkey = { x: 0, y: 0 };
  let flags = [];

  document.body.innerHTML = `
    <div id="game" style="
      position:relative;
      height:100vh;
      background:#ffe4e1;
      overflow:hidden;
    ">
      <div id="monkey" style="position:absolute;font-size:48px;">🐒</div>
      <p style="position:absolute;top:10px;width:100%;text-align:center;font-family:system-ui;">
        Avoid the red flags… for love 🚩
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

  const loop = setInterval(() => {
    if (Math.random() < 0.6) {
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
      f.style.top = f.offsetTop + 9 + "px";

      const dx = f.offsetLeft - monkey.x;
      const dy = f.offsetTop - monkey.y;
      if (Math.abs(dx) < 40 && Math.abs(dy) < 40) {
        clearInterval(loop);
        showRedFlagsGame();
      }
    });

    if (Date.now() - start > 10000) {
      clearInterval(loop);
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

        <p style="margin-top:16px;font-size:16px;line-height:1.5">
          You passed every test 😌<br><br>
          <strong>🎮 New Quest Unlocked 🎮</strong><br>
          Plan the perfect Valentine’s date 💖<br><br>
          🗓️ Choose the day<br>
          📍 Choose the place<br>
          🐒 Choose wisely
        </p>
      </div>
    </div>
  `;
}


