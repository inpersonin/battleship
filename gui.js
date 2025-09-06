import Player from "./src/player.js";

const player = new Player("Umar");
const computer = new Player("Computer", true);

function placeRandomShips(player) {
  const lengths = [4, 3, 6];
  lengths.forEach((length) => {
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * player.board.size);
      const y = Math.floor(Math.random() * player.board.size);
      const horizontal = Math.random() > 0.5;
      placed = player.board.placeShip(x, y, length, horizontal);
    }
  });
}
placeRandomShips(computer);
placeRandomShips(player);

const playerBoard = document.getElementById("player-board");
const computerBoard = document.getElementById("computer-board");
const resultBox = document.getElementById("result");

function setResult(text, blast = false) {
  if (resultBox) {
    resultBox.textContent = text;
    if (blast) {
      resultBox.classList.remove("show");
      void resultBox.offsetWidth;
      resultBox.classList.add("show");

      const blastOverlay = document.getElementById("blast");
      blastOverlay.classList.remove("active");
      void blastOverlay.offsetWidth;
      blastOverlay.classList.add("active");
    }
  }
}

function renderBoard(boardElement, gameboard, hideShips = false) {
  boardElement.innerHTML = "";
  for (let x = 0; x < gameboard.size; x++) {
    for (let y = 0; y < gameboard.size; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = x;
      cell.dataset.col = y;

      const value = gameboard.board[x][y];
      if (value === "H") cell.classList.add("hit");
      else if (value === "M") cell.classList.add("miss");
      else if (value && !hideShips) cell.classList.add("ship");

      boardElement.appendChild(cell);
    }
  }
}

function render() {
  renderBoard(playerBoard, player.board, false);
  renderBoard(computerBoard, computer.board, true);
}

function checkWinner() {
  if (computer.board.allShipsSunk()) {
    setResult("YOU WIN!", true);
    computerBoard.style.pointerEvents = "none";
    return true;
  }
  if (player.board.allShipsSunk()) {
    setResult("COMPUTER WINS!", true);
    computerBoard.style.pointerEvents = "none";
    return true;
  }
  return false;
}

render();

computerBoard.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cell")) return;
  if (e.target.classList.contains("hit") || e.target.classList.contains("miss"))
    return;
  if (checkWinner()) return;

  const x = parseInt(e.target.dataset.row, 10);
  const y = parseInt(e.target.dataset.col, 10);

  const pRes = player.attack(computer, x, y);
  render();

  if (checkWinner()) return;

  const cRes = computer.attack(player);
  setResult(`YOU: ${pRes}  —  CPU: ${cRes}`);
  render();

  checkWinner();
});

function createFallingObject(type = "ship") {
  const container = document.querySelector(".falling-ships");
  const obj = document.createElement("span");

  obj.textContent = type === "ship" ? "⛴" : "🚀";
  obj.classList.add(type);

  obj.style.left = `${Math.random() * 95}%`;

  const baseSize =
    window.innerWidth < 480 ? 1 : window.innerWidth < 768 ? 1.5 : 2.5;
  const size = type === "ship" ? 5 + Math.random() * 2 : 4 + Math.random();
  obj.style.fontSize = `${size}rem`;

  const duration =
    type === "ship" ? 4 + Math.random() * 4 : 2 + Math.random() * 2;
  obj.style.animationDuration = `${duration}s`;

  container.appendChild(obj);
  obj.addEventListener("animationend", () => obj.remove());
}

function spawnLoop() {
  if (Math.random() < 0.75) createFallingObject("ship");
  if (Math.random() < 0.5) createFallingObject("missile");
  setTimeout(spawnLoop, 500);
}

function detectCollisions() {
  const ships = document.querySelectorAll(".falling-ships .ship");
  const missiles = document.querySelectorAll(".falling-ships .missile");

  ships.forEach((ship) => {
    const sRect = ship.getBoundingClientRect();
    missiles.forEach((missile) => {
      const mRect = missile.getBoundingClientRect();
      const overlap = !(
        sRect.top > mRect.bottom ||
        sRect.bottom < mRect.top ||
        sRect.left > mRect.right ||
        sRect.right < mRect.left
      );
      if (overlap) {
        ship.remove();
        missile.remove();
      }
    });
  });
}

function gameLoop() {
  detectCollisions();
  requestAnimationFrame(gameLoop);
}

spawnLoop();
gameLoop();
