const game = document.getElementById("game");
const rabbit = document.getElementById("rabbit");
const scoreText = document.getElementById("score");
const message = document.getElementById("message");
const startButton = document.getElementById("startButton");

let running = false;
let jumping = false;
let score = 0;
let speed = 5;
let spawnTimer;

function jump() {
  if (!running || jumping) return;

  jumping = true;
  let height = 0;
  let goingUp = true;

  const jumpLoop = setInterval(() => {
    if (goingUp) {
      height += 10;
      rabbit.style.bottom = `${55 + height}px`;

      if (height >= 150) goingUp = false;
    } else {
      height -= 10;
      rabbit.style.bottom = `${55 + height}px`;

      if (height <= 0) {
        rabbit.style.bottom = "55px";
        jumping = false;
        clearInterval(jumpLoop);
      }
    }
  }, 20);
}

function createObstacle() {
  if (!running) return;

  const obstacle = document.createElement("div");
  obstacle.className = "obstacle";
  obstacle.style.height = `${45 + Math.random() * 35}px`;
  obstacle.style.left = `${game.clientWidth}px`;
  game.appendChild(obstacle);

  const moveObstacle = setInterval(() => {
    if (!running) {
      clearInterval(moveObstacle);
      obstacle.remove();
      return;
    }

    let position = parseFloat(obstacle.style.left);
    position -= speed;
    obstacle.style.left = `${position}px`;

    const rabbitBox = rabbit.getBoundingClientRect();
    const obstacleBox = obstacle.getBoundingClientRect();

    const hit =
      rabbitBox.right - 15 > obstacleBox.left &&
      rabbitBox.left + 18 < obstacleBox.right &&
      rabbitBox.bottom - 12 > obstacleBox.top &&
      rabbitBox.top + 15 < obstacleBox.bottom;

    if (hit) endGame();

    if (position < -80) {
      clearInterval(moveObstacle);
      obstacle.remove();
      score++;
      speed += 0.08;
      scoreText.textContent = `Score: ${score}`;
    }
  }, 16);
}

function startGame() {
  document.querySelectorAll(".obstacle").forEach(item => item.remove());

  running = true;
  jumping = false;
  score = 0;
  speed = 5;
  rabbit.style.bottom = "55px";
  scoreText.textContent = "Score: 0";
  message.classList.add("hidden");

  clearInterval(spawnTimer);
  spawnTimer = setInterval(createObstacle, 1500);
}

function endGame() {
  if (!running) return;

  running = false;
  clearInterval(spawnTimer);

  message.innerHTML = `
    <div>
      <h1>Game Over! 🥕</h1>
      <p>Your score: <strong>${score}</strong></p>
      <button id="restartButton">Play Again</button>
    </div>
  `;

  message.classList.remove("hidden");
  document.getElementById("restartButton").addEventListener("click", startGame);
}

startButton.addEventListener("click", startGame);

document.addEventListener("keydown", event => {
  if (event.code === "Space" || event.code === "ArrowUp") {
    event.preventDefault();
    jump();
  }
});

game.addEventListener("click", jump);

game.addEventListener("touchstart", event => {
  event.preventDefault();
  jump();
});
