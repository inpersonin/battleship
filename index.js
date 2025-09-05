import Player from "./Player.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const player1 = new Player("Umar");
const computer = new Player("Computer", true);

player1.board.placeShip(0, 0, 3, true);
player1.board.placeShip(5, 5, 2, false);

function placeRandomShips(player) {
  const lengths = [3, 2, 4];
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

function askMove() {
  rl.question("Enter attack coordinates (row,col): ", (input) => {
    const [x, y] = input.split(",").map(Number);
    console.log(player1.attack(computer, x, y));
    console.log(computer.attack(player1));
    player1.board.printBoard();
    computer.board.printBoard();
    askMove();
  });
}

askMove();
