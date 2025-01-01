const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");
const pipeContainer = document.getElementById("pipe-container");
const scoreDisplay = document.getElementById("score");
const startMenu = document.getElementById("start-menu");
const gameOverMenu = document.getElementById("game-over-menu");
const finalScoreDisplay = document.getElementById("final-score");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");

let birdTop = 250;
let gravity = 4;
let jumpStrength = 65;
let pipeSpeed = 3;
const pipeGap = 200;
let isGameOver = false;
let score = 0;

// Start the game
startButton.addEventListener("click", () => {
  startMenu.classList.add("hidden");
  startGame();
});

// Restart the game
restartButton.addEventListener("click", () => {
  gameOverMenu.classList.add("hidden");
  resetGame();
  startGame();
});

// Handle bird jump with Spacebar
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isGameOver) {
    birdTop -= jumpStrength;
  }
});

function startGame() {
  birdTop = 250;
  score = 0;
  isGameOver = false;
  scoreDisplay.textContent = `Score: ${score}`;
  bird.style.top = birdTop + "px";
  pipeContainer.innerHTML = ""; // Clear old pipes
  gameLoop();
}

function resetGame() {
  birdTop = 250;
  score = 0;
  isGameOver = false;
  pipeContainer.innerHTML = ""; // Remove all pipes
}

function gameLoop() {
  if (isGameOver) return;

  // Gravity
  birdTop += gravity;
  bird.style.top = birdTop + "px";

  // Check for ground or ceiling collision
  if (birdTop > gameContainer.offsetHeight - bird.offsetHeight || birdTop < 0) {
    endGame();
  }

  // Pipe movement and collision
  movePipes();

  requestAnimationFrame(gameLoop);
}

function movePipes() {
  const pipes = document.querySelectorAll(".pipe");

  pipes.forEach(pipe => {
    let pipeLeft = parseInt(pipe.style.left) || gameContainer.offsetWidth;
    pipeLeft -= pipeSpeed;
    pipe.style.left = pipeLeft + "px";

    // Remove pipes out of bounds
    if (pipeLeft < -50) pipe.remove();

    // Increment score when bird passes a pipe
    if (pipeLeft + pipeSpeed < bird.offsetLeft && !pipe.scored) {
      pipe.scored = true; // Mark pipe as scored
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    // Collision detection
    if (
      pipeLeft < bird.offsetLeft + bird.offsetWidth &&
      pipeLeft + 50 > bird.offsetLeft
    ) {
      if (
        pipe.classList.contains("pipe-top") &&
        birdTop < pipe.offsetHeight
      ) {
        endGame();
      }
      if (
        pipe.classList.contains("pipe-bottom") &&
        birdTop + bird.offsetHeight > gameContainer.offsetHeight - pipe.offsetHeight
      ) {
        endGame();
      }
    }
  });

  // Generate new pipes
  if (pipes.length < 2 || pipes[pipes.length - 1].style.left < "200px") {
    createPipePair();
  }
}

function createPipePair() {
  const pipeHeight = Math.random() * (gameContainer.offsetHeight - pipeGap - 200) + 100;

  const pipeTop = document.createElement("div");
  pipeTop.classList.add("pipe", "pipe-top");
  pipeTop.style.height = pipeHeight + "px";
  pipeTop.style.left = gameContainer.offsetWidth + "px";

  const pipeBottom = document.createElement("div");
  pipeBottom.classList.add("pipe", "pipe-bottom");
  pipeBottom.style.height = gameContainer.offsetHeight - pipeHeight - pipeGap + "px";
  pipeBottom.style.left = gameContainer.offsetWidth + "px";

  pipeContainer.appendChild(pipeTop);
  pipeContainer.appendChild(pipeBottom);
}

function endGame() {
  isGameOver = true;
  finalScoreDisplay.textContent = score;
  gameOverMenu.classList.remove("hidden");
}
