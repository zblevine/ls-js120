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

function Square() {
  this.marker = Square.EMPTY_MARKER;
}

Square.EMPTY_MARKER = ' ';

Square.prototype.isEmpty = function() {
  return this.marker === Square.EMPTY_MARKER;
};

Square.prototype.fill = function(marker) {
  this.marker = marker;
};

function Player(marker) {
  this.marker = marker;
}

Player.prototype.placePiece = function(board, idx) {
  board.placePiece(this.marker, idx);
};

function Human() {
  Player.call(this, Human.HUMAN_MARKER);
}

Human.prototype = Object.create(Player.prototype);
Human.prototype.constructor = Human;
Human.HUMAN_MARKER = 'X';

function Computer() {
  Player.call(this, Computer.COMPUTER_MARKER);
}

Computer.prototype = Object.create(Player.prototype);
Computer.prototype.constructor = Computer;
Computer.COMPUTER_MARKER = 'O';

Computer.prototype.takeTurn = function(board) {
  let emptySquares = board.getEmptySquares();
  let randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  this.placePiece(board, randomSquare);
};

function Board() {
  this.squares = [];
  // eslint-disable-next-line id-length
  for (let i = 0; i < 9; i++) {
    this.squares.push(new Square());
  }
}

Board.ALL_ROWS = [[1, 2, 3], [4, 5, 6], [7, 8, 9],
  [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
Board.BOARD_INDICES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

Board.prototype.display = function() {
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
};

Board.prototype.placePiece = function(marker, idx) {
  this.squares[idx - 1].marker = marker;
};

Board.prototype.getEmptySquares = function() {
  return Board.BOARD_INDICES.filter(idx => this.squares[idx - 1].marker === Square.EMPTY_MARKER);
};

Board.prototype.isBoardFull = function() {
  return !(this.getEmptySquares().length);
};

Board.prototype.rowMatches = function(row, marker) {
  return row.every(idx => this.squares[idx - 1].marker === marker);
};

function Game() {
  this.board = new Board();
  this.humanPlayer = new Human();
  this.computerPlayer = new Computer();
}

Game.prototype.prompt = function(str) {
  console.log(`==> ${str}`);
};

Game.prototype.someoneWon = function() {
  return this.humanWon() || this.computerWon();
};

Game.prototype.humanWon = function() {
  return Board.ALL_ROWS.some(row => this.board.rowMatches(row, Human.HUMAN_MARKER));
};

Game.prototype.computerWon = function() {
  return Board.ALL_ROWS.some(row => this.board.rowMatches(row, Computer.COMPUTER_MARKER));
};

Game.prototype.gameOver = function() {
  return this.board.isBoardFull() || this.someoneWon();
};

Game.prototype.getInputSquare = function() {
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
};

Game.prototype.displayResults = function() {
  if (this.humanWon()) {
    console.log('You win!');
  } else if (this.computerWon()) {
    console.log('The computer wins!');
  } else {
    console.log('It\'s a tie!');
  }
};

Game.prototype.play = function() {
  while (true) {
    this.board.display();
    this.humanPlayer.placePiece(this.board, this.getInputSquare());
    if (this.gameOver()) break;
    this.computerPlayer.takeTurn(this.board);
    if (this.gameOver()) break;
  }

  this.displayResults();
};

new Game().play();