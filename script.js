const noBtn = document.getElementById("noBtn");
const floating = document.querySelector(".floating");
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

/* Desktop hover = dodge */
noBtn.addEventListener("mouseover", moveNoFast);

/* Mobile fallback (does nothing harmful on desktop) */
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoFast();
});


/* =========================
   FLOATING EMOJIS BACKGROUND
   ========================= */

const emojis = ["❤️", "🍌", "🐒"];

function createEmoji() {
  const span = document.createElement("span");
  span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  span.style.left = Math.random() * 100 + "vw";
  span.style.animationDuration = 3 + Math.random() * 4 + "s";
  span.style.fontSize = 20 + Math.random() * 25 + "px";
  floating.appendChild(span);

  setTimeout(() => span.remove(), 8000);
}

setInterval(createEmoji, 350);


/* =========================
   YES BUTTON / FINAL SCREEN
   ========================= */

function sayYes() {
  const sound = document.getElementById("achievementSound");

  // Play sound directly from click
  sound.currentTime = 0;
  sound.play().catch(() => {});

  // Delay page change so sound can start
  setTimeout(() => {
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
          <h2>✨ Valentine Acquired ✨</h2>

          <p style="font-size:18px;margin-top:20px">
            You’re officially going on a Valentine’s date 💖<br><br>
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
  }, 300);
}


