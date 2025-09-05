import Ship from "../src/ship.js";
import Gameboard from "../src/gameboard.js";
import Player from "../src/player.js";

test("Ship registers hits and sinks correctly", () => {
  const ship = new Ship(3);
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test("Gameboard places ship correctly", () => {
  const board = new Gameboard(10);
  const placed = board.placeShip(0, 0, 3, true);
  expect(placed).toBe(true);
  expect(board.board[0][0]).not.toBe(null);
  expect(board.board[0][1]).not.toBe(null);
  expect(board.board[0][2]).not.toBe(null);
});

test("Gameboard rejects invalid ship placement", () => {
  const board = new Gameboard(10);
  board.placeShip(0, 0, 3, true);
  const overlap = board.placeShip(0, 1, 3, true);
  expect(overlap).toBe(false);
});

test("Gameboard receives attacks", () => {
  const board = new Gameboard(10);
  board.placeShip(0, 0, 2, true);
  expect(board.receiveAttack(0, 0)).toBe("Hit!");
  expect(board.receiveAttack(0, 1)).toBe("Hit!");
  expect(board.receiveAttack(5, 5)).toBe("Miss!");
});

test("Player attacks opponent", () => {
  const player1 = new Player("Umar");
  const player2 = new Player("Computer");
  player2.board.placeShip(0, 0, 2, true);

  expect(player1.attack(player2, 0, 0)).toBe("Hit!");
  expect(player1.attack(player2, 0, 1)).toBe("Hit!");
});

test("Computer performs random attacks", () => {
  const player = new Player("Umar");
  const computer = new Player("Computer", true);
  player.board.placeShip(0, 0, 2, true);

  const result = computer.attack(player);
  expect(["Hit!", "Miss!"]).toContain(result);
});
