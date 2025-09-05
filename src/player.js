import Gameboard from "./gameboard.js";

class Player {
  constructor(name, isComputer = false, boardSize = 10) {
    this.name = name;
    this.isComputer = isComputer;
    this.board = new Gameboard(boardSize);
    this.attacks = new Set();
  }

  attack(opponent, x, y) {
    if (this.isComputer) {
      return this.randomAttack(opponent);
    }

    const key = `${x},${y}`;
    if (this.attacks.has(key)) {
      return "Already attacked!";
    }
    this.attacks.add(key);
    return opponent.board.receiveAttack(x, y);
  }

  randomAttack(opponent) {
    let x, y, key;
    do {
      x = Math.floor(Math.random() * this.board.size);
      y = Math.floor(Math.random() * this.board.size);
      key = `${x},${y}`;
    } while (this.attacks.has(key));

    this.attacks.add(key);
    return opponent.board.receiveAttack(x, y);
  }
}

export default Player;
