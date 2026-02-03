const noBtn = document.getElementById("noBtn");
const floating = document.querySelector(".floating");
const achievementSound = document.getElementById("achievementSound");

let chaosLevel = 1;

/* ❌ NO BUTTON CHAOS */
noBtn.addEventListener("click", () => {
  chaosLevel++;

  // Vibrate phone (mobile only)
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 200]);
  }

  const maxX = window.innerWidth - noBtn.offsetWidth;
  const maxY = window.innerHeight - noBtn.offsetHeight;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  const insults = [
    "❌ Wrong choice",
    "❌ Skill issue",
    "❌ Try again",
    "❌ Absolutely not",
    "❌ Nice try 😏",
    "❌ You wish"
  ];

  noBtn.textContent = insults[Math.min(chaosLevel - 1, insults.length - 1)];
});

/* 🍌❤️🐒 FLOATING CHAOS */
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

/* 🎮 YES = ACHIEVEMENT UNLOCKED */
function sayYes() {
  achievementSound.play();

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
          You’ve been selected for a Valentine’s date 🎮💖<br><br>
          📍 Mystery location<br>
          🗓️ This weekend<br>
          🍝 Food involved<br>
          🐒 Monkeys emotionally supporting us
        </p>

        <p style="margin-top:25px;font-size:16px">
          <strong>Reward:</strong><br>
          Unlimited kisses, laughs,<br>
          and lifetime Player 2 access ❤️
        </p>
      </div>
    </div>
  `;
}
