/* eslint-disable max-len */
const rlSync = require('readline-sync');

/*
Tic-tac-toe: need to write code for a 2-player board game, with a 3x3 grid of squares that can either be X, O, or blank.

One player has the X pieces, and the other has the O pieces. Each turn, the player places their piece onto an empty square.

If one player has three squares in a row with their tile in it, they win.
If the board is full without a winner, it's a draw.

Objects:
Game - The object that runs the show. Prompts each player to play when their move, tells the computer player to move, and makes sure input is valid.
Board - Keeps track of game state. At the start of each turn, checks if the game is over either way.
Player - Places pieces every turn. Can have X or O as their tile.
  Computer - subclass of player, needs to be able to place randomly
Square - Elements of the board. Can be empty or have a tile.
Tile - Can be X or O. Probably doesn't need a separate object class.

Verbs/actions:
Detect winner/loser/tie, place piece, move, check validity, prompt
*/

class Square {
  static EMPTY_MARKER = ' ';

  constructor() {
    this.marker = Square.EMPTY_MARKER;
  }

  isEmpty() {
    return this.marker === Square.EMPTY_MARKER;
  }

  fill(marker) {
    this.marker = marker;
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
  }

  placePiece(board, idx) {
    board.placePiece(this.marker, idx);
  }
}

class Human extends Player {
  static HUMAN_MARKER = 'X';

  constructor(marker = Human.HUMAN_MARKER) {
    super(marker);
  }
}

class Computer extends Player {
  static COMPUTER_MARKER = 'O';

  constructor(marker = Computer.COMPUTER_MARKER) {
    super(marker);
  }

  takeTurn(board) {
    let emptySquares = board.getEmptySquares();
    let randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    this.placePiece(board, randomSquare);
  }
}


class Board {
  static ALL_ROWS = [[1, 2, 3], [4, 5, 6], [7, 8, 9],
    [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
  static BOARD_INDICES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor() {
    this.squares = [];
    // eslint-disable-next-line id-length
    for (let i = 0; i < 9; i++) {
      this.squares.push(new Square());
    }
  }

  display() {
    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares[0].marker}  |  ${this.squares[1].marker}  |  ${this.squares[2].marker}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares[3].marker}  |  ${this.squares[4].marker}  |  ${this.squares[5].marker}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares[6].marker}  |  ${this.squares[7].marker}  |  ${this.squares[8].marker}`);
    console.log("     |     |");
    console.log("");
  }

  placePiece(marker, idx) {
    this.squares[idx - 1].marker = marker;
  }

  getEmptySquares() {
    return Board.BOARD_INDICES.filter(idx => this.squares[idx - 1].marker === Square.EMPTY_MARKER);
  }

  isBoardFull() {
    return !(this.getEmptySquares().length);
  }

  rowMatches(row, marker) {
    return row.every(idx => this.squares[idx - 1].marker === marker);
  }

}

class Game {
  constructor() {
    this.board = new Board();
    this.humanPlayer = new Human();
    this.computerPlayer = new Computer();
  }

  prompt(str) {
    console.log(`==> ${str}`);
  }

  someoneWon() {
    return this.humanWon() || this.computerWon();
  }

  humanWon() {
    return Board.ALL_ROWS.some(row => this.board.rowMatches(row, Human.HUMAN_MARKER));
  }

  computerWon() {
    return Board.ALL_ROWS.some(row => this.board.rowMatches(row, Computer.COMPUTER_MARKER));
  }

  gameOver() {
    return this.board.isBoardFull() || this.someoneWon();
  }

  getInputSquare() {
    let validChoices = this.board.getEmptySquares().map(square => String(square));

    while (true) {
      this.prompt(`Please enter an empty square. (${validChoices.join(', ')})`);
      let input = rlSync.question();
      if (validChoices.includes(input)) {
        return input;
      } else {
        this.prompt('Sorry, that\'s not an empty square.');
      }
    }
  }

  displayResults() {
    if (this.humanWon()) {
      console.log('You win!');
    } else if (this.computerWon()) {
      console.log('The computer wins!');
    } else {
      console.log('It\'s a tie!');
    }
  }

  play() {
    while (true) {
      this.board.display();
      this.humanPlayer.placePiece(this.board, this.getInputSquare());
      if (this.gameOver()) break;
      this.computerPlayer.takeTurn(this.board);
      if (this.gameOver()) break;
    }

    this.displayResults();
  }
}

new Game().play();