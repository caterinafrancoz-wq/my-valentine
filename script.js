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
   YES → BANANA SMASH (EVIL)
   ========================= */

function sayYes() {
  playAchievement();
  setTimeout(showBananaGameHard, 300);
}

function playAchievement() {
  achievementSound.currentTime = 0;
  achievementSound.play().catch(() => {});
}

function showBananaGameHard() {
  const totalHits = 20;
  const gainPerHit = 100 / totalHits;
  const drainPerSecond = 20; // 🔥 HARDER
  const tickMs = 50;

  let progress = 0;
  let hits = 0;
  let over = false;

  document.body.innerHTML = `
    <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
      background:linear-gradient(135deg,#ffe4e1,#ffb6c1);font-family:system-ui;text-align:center;">
      <h1>🍌 SMASH THE BANANA 🍌</h1>
      <p>20 hits FAST. Slow = failure 😈</p>
      <div id="banana" style="font-size:130px;cursor:pointer;">🍌</div>
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

  banana.onclick = () => {
    if (over) return;
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
  let cards = [];
  let first = null, second = null, lock = false;
  let matches = 0, wrong = 0;

  function shuffle() {
    cards = [...icons, ...icons].sort(() => Math.random() - 0.5);
    matches = 0;
    wrong = 0;
    render();
  }

  function render() {
    document.body.innerHTML = `
      <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
        background:linear-gradient(135deg,#ffb6c1,#ffe4e1);font-family:system-ui;text-align:center;">
        <h1>🐒 MEMORY MATCH 🧠</h1>
        <p>3 mistakes = reshuffle 😈</p>
        <p>Wrong tries: ${wrong} / 3</p>
        <div id="grid" style="display:grid;grid-template-columns:repeat(4,80px);gap:14px;">
          ${cards.map((_,i)=>`<div class="card" data-i="${i}" 
            style="width:80px;height:80px;background:white;border-radius:12px;
            display:flex;align-items:center;justify-content:center;font-size:36px;
            cursor:pointer;">❓</div>`).join("")}
        </div>
      </div>
    `;

    document.querySelectorAll(".card").forEach(card => {
      card.onclick = () => {
        if (lock) return;
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
          matches++;
          first = second = null;
          lock = false;

          if (matches === icons.length) {
            playAchievement();
            setTimeout(showRedFlagsGame, 500);
          }
        } else {
          wrong++;
          setTimeout(() => {
            first.textContent = second.textContent = "❓";
            first = second = null;
            lock = false;
            if (wrong >= 3) shuffle();
            else render();
          }, 600);
        }
      };
    });
  }

  shuffle();
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
    // Spawn flags
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

    flags.forEach((f, i) => {
      f.style.top = f.offsetTop + 6 + "px";

      // Collision
      const dx = f.offsetLeft - monkey.x;
      const dy = f.offsetTop - monkey.y;
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
        clearInterval(interval);
        showRedFlagsGame(); // restart
      }
    });

    // Win after 5 seconds
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
    <div style="height:100vh;display:flex;align-items:center;justify-content:center;
      background:linear-gradient(135deg,#ffb6c1,#ffe4e1);font-family:system-ui;text-align:center;">
      <div>
        <h1>🏆 ALL ACHIEVEMENTS UNLOCKED 🏆</h1>
        <h2>💖 VALENTINE CONFIRMED 💖</h2>
        <p>You passed every test 😌<br><br>
        📍 Mystery location<br>
        🗓️ This weekend<br>
        🍝 Food involved<br>
        🐒 Monkey approves</p>
      </div>
    </div>
  `;
}


