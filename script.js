const noBtn = document.getElementById("noBtn");
const floating = document.querySelector(".floating");
const achievementSound = document.getElementById("achievementSound");

let speed = 1;

/* 📱 MOVE NO BUTTON ON TOUCH / NEAR TAP */
function moveNoButton() {
  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  const maxX = window.innerWidth - btnWidth - 10;
  const maxY = window.innerHeight - btnHeight - 10;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.position = "fixed";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

/* Simulate hover for mobile */
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
});

/* ❌ IF HE MANAGES TO CLICK */
noBtn.addEventListener("click", () => {
  if (navigator.vibrate) {
    navigator.vibrate(100);
  }

  if (speed === 1) {
    noBtn.textContent = "Wrong choice";
  } else {
    noBtn.textContent = "Nice try";
  }

  setTimeout(() => {
    noBtn.textContent = "No";
  }, 700);

  speed += 0.7;
});

/* Increase chaos by moving more often */
setInterval(() => {
  if (speed > 1) {
    moveNoButton();
  }
}, 700 / speed);

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
  try {
    achievementSound.play();
  } catch (e) {}

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
          You’ve unlocked a Valentine’s date 🎮💖<br><br>
          📍 Mystery location<br>
          🗓️ This weekend<br>
          🍝 Food involved<br>
          🐒 Monkeys cheering in the background
        </p>

        <p style="margin-top:25px;font-size:16px">
          <strong>Reward:</strong><br>
          Lifetime Player 2 access ❤️
        </p>
      </div>
    </div>
  `;
}
