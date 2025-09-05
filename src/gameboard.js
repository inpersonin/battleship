import Ship from "./ship.js";

class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.board = Array.from({ length: size }, () => Array(size).fill(null));
    this.ships = [];
  }

  placeShip(x, y, length, horizontal = true) {
    const ship = new Ship(length);
    const coords = [];

    for (let i = 0; i < length; i++) {
      const row = horizontal ? x : x + i;
      const col = horizontal ? y + i : y;
      if (!this.isValid(row, col) || this.board[row][col] !== null) {
        return false;
      }
      coords.push([row, col]);
    }

    coords.forEach(([row, col]) => {
      this.board[row][col] = ship;
    });

    this.ships.push(ship);
    return true;
  }

  receiveAttack(x, y) {
    if (!this.isValid(x, y)) return "Invalid";

    const cell = this.board[x][y];
    if (cell instanceof Ship) {
      cell.hit();
      this.board[x][y] = "H";
      return "Hit!";
    } else if (cell === null) {
      this.board[x][y] = "M";
      return "Miss!";
    } else {
      return "Already attacked!";
    }
  }

  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }

  isValid(x, y) {
    return x >= 0 && y >= 0 && x < this.size && y < this.size;
  }

  printBoard() {
    console.log(
      this.board
        .map((row) =>
          row
            .map((cell) => {
              if (cell instanceof Ship) return "S";
              return cell === null ? "." : cell;
            })
            .join(" "),
        )
        .join("\n"),
    );
  }
}

export default Gameboard;
