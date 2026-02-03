const noBtn = document.getElementById("noBtn");

noBtn.addEventListener("mouseover", () => {
  const x = Math.random() * 200;
  const y = Math.random() * 100;

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
});

function sayYes() {
  document.body.innerHTML = `
    <div style="
      display:flex;
      height:100vh;
      align-items:center;
      justify-content:center;
      font-family:Arial;
      background:#ffe4e1;
      text-align:center;
    ">
      <h1>Yay!!! 💕🥰<br>You’re my Valentine 💖</h1>
    </div>
  `;
}
