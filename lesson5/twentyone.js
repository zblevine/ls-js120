/* eslint-disable id-length */
const readline = require('readline-sync');

/*
info
i want to implement a twenty-one game as follows:
the player gets two cards in their hand and can see the dealer's
top card. the player with that info can choose to hit or stay.
if they hit, the hand is displayed to them again. once
they decide to stay, their turn is over.

if the player is over 21 points, they automatically bust and lose without
knowing what the dealer's other cards are.

the dealer then reveals their other card and hits/stays until they reach 17,
at which point staying is mandatory. they must hit until they reach 17.

after the game ends, the user is prompted whether they would like to play again.
if they would like to play, the console clears and the score updates.

relevant nouns: player, dealer, hand, card, game, score, deck
relevant verbs: hit, stay, display (hand), play, prompt
other methods: play again, console clear
*/

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  toString() {
    return `${this.value} of ${this.suit}`;
  }
}

class Hand {
  constructor() {
    this.cards = [];
    this.score = 0;
  }

  static CARD_POINTS = {Ace: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8,
    9: 9, 10: 10, Jack: 10, Queen: 10, King: 10};

  calcScore() {
    /*
    need to calc score where aces count as 11 unless it would cause to go
    over, in which case they count as 1

    idea: sum up all other cards, then sum up aces as 1, if sum < 12 then add 10
    */

    let score = this.cards
      .map(card => Hand.CARD_POINTS[card.value])
      .reduce((acc, curr) => acc + curr, 0);

    let numAces = this.cards.filter(card => card.value === 'Ace').length;
    while (score < 12 && numAces > 0) {
      score += 10;
      numAces--;
    }

    return score;
  }

  addCard(card) {
    this.cards.push(card);
  }

  getScore() {
    return this.score;
  }

  updateScore() {
    this.score = this.calcScore();
  }

  showTopCard() {
    return this.cards[0].toString();
  }

  showAllCards() {
    return this.cards.map(card => card.toString()).join(', ');
  }

  busted() {
    return this.score > 21;
  }
}


class Deck {
  static SUITS = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  static CARD_VALUES = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

  constructor() {
    this.cards = [];
    for (let suit of Deck.SUITS) {
      for (let value of Deck.CARD_VALUES) {
        this.cards.push(new Card(suit, value));
      }
    }

    Deck.shuffle(this.cards);
  }

  deal(hand, numCards) {
    for (let idx = 0; idx < numCards; idx++) {
      hand.addCard(this.cards.shift());
    }
    hand.updateScore();
  }

  static shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

class Player {
  constructor() {
    this.hand = new Hand();
  }

  newHand() {
    this.hand = new Hand();
  }

  hit(deck) {
    deck.deal(this.hand, 1);
  }
}

class HumanPlayer extends Player {
  constructor() {
    super();
    this.score = 5;
  }

  getScore() {
    return this.score;
  }

  addOneToScore() {
    this.score += 1;
  }

  subtractOneFromScore() {
    this.score -= 1;
  }

  isBroke() {
    return this.score < 1;
  }

  isRich() {
    return this.score > 9;
  }
}

class Game {
  constructor() {
    this.humanPlayer = new HumanPlayer();
    this.dealer = new Player();
  }

  prompt(str) {
    console.log(`==> ${str}`);
  }

  shuffleDeck() {
    this.deck = new Deck();
  }

  play() {
    console.clear();
    while (true) {
      this.prompt(`Your money: ${this.humanPlayer.getScore()}`);
      if (this.gameOver()) {
        this.displayGameOverText();
        break;
      } else {
        this.shuffleDeck();
        this.humanPlayer.newHand();
        this.dealer.newHand();
        this.playOneHand();
      }

      if (!(this.playAgain())) break;
    }
  }

  playOneHand() {
    this.deck.deal(this.humanPlayer.hand, 2);
    this.deck.deal(this.dealer.hand, 2);
    this.prompt(`Your hand: ${this.humanPlayer.hand.showAllCards()}`);
    this.prompt(`Dealer's top card: ${this.dealer.hand.showTopCard()}`);
    this.playHumanHand();

    if (this.humanPlayer.hand.busted()) {
      this.prompt(`Your score: ${this.humanPlayer.hand.getScore()}`);
      this.prompt('You busted!');
    } else {
      this.playDealerHand();
      this.prompt(`Dealer score: ${this.dealer.hand.getScore()}`);
      if (this.dealer.hand.busted()) {
        this.prompt('Dealer busted!');
      }
      this.prompt(`Your score: ${this.humanPlayer.hand.getScore()}`);
    }

    this.handleEndOfGame();
  }

  handleEndOfGame() {
    if (this.humanPlayer.hand.busted() || ((this.dealer.hand.getScore() >
      this.humanPlayer.hand.getScore()) && !(this.dealer.hand.busted()))) {
      this.prompt('Dealer wins!');
      this.humanPlayer.subtractOneFromScore();
    } else if (this.dealer.hand.busted() || (this.humanPlayer.hand.getScore() >
      this.dealer.hand.getScore())) {
      this.prompt('You win!');
      this.humanPlayer.addOneToScore();
    } else {
      this.prompt('Push!');
    }
  }

  playHumanHand() {
    while (true) {
      this.prompt(`Your hand: ${this.humanPlayer.hand.showAllCards()}`);

      if (this.humanPlayer.hand.busted()) {
        break;
      }

      if (this.hitOrStay() === 'hit') {
        this.humanPlayer.hit(this.deck);
      } else {
        break;
      }
    }
  }

  playDealerHand() {
    this.prompt(`Dealer's hand: ${this.dealer.hand.showAllCards()}`);
    while (this.dealer.hand.getScore() < 17) {
      this.dealer.hit(this.deck);
      this.prompt(`Dealer's hand: ${this.dealer.hand.showAllCards()}`);
    }
  }

  gameOver() {
    return this.humanPlayer.isRich() || this.humanPlayer.isBroke();
  }

  displayGameOverText() {
    if (this.humanPlayer.isRich()) {
      this.prompt('You are rich!');
    } else {
      this.prompt('You are out of money!');
    }
  }

  hitOrStay() {
    let answer;

    while (true) {
      this.prompt("Hit or stay?");
      answer = readline.question().toLowerCase();

      if (["hit", "stay"].includes(answer)) break;

      this.prompt("Sorry, that's not a valid choice.");
      console.log("");
    }

    return answer;
  }

  playAgain() {
    let answer;

    while (true) {
      this.prompt("Play again (y/n)? ");
      answer = readline.question().toLowerCase();

      if (["y", "n"].includes(answer)) break;

      this.prompt("Sorry, that's not a valid choice.");
      console.log("");
    }

    console.clear();
    return answer === "y";
  }
}

new Game().play();
