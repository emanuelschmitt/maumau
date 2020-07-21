import Card from "../models/card";
import { Suit } from "../models/suit";
import { Rank } from "../models/rank";
import { State } from "./reducer";
import Player from "../models/player";
import shuffle from "../utils/shuffle";

export function createStack(): Card[] {
  const allSuit: Suit[] = [Suit.CLUBS, Suit.DIAMONDS, Suit.HEARTS, Suit.SPADES];
  const allRank: Rank[] = [
    Rank.ACE,
    Rank.SEVEN,
    Rank.EIGHT,
    Rank.NINE,
    Rank.TEN,
    Rank.JACK,
    Rank.QUEEN,
    Rank.KING,
  ];

  const stack: Card[] = [];
  for (const suit of allSuit) {
    for (const rank of allRank) {
      stack.push(new Card(suit, rank));
    }
  }

  return stack;
}

export function initalizeGame(nPlayers: number = 2): State {
  if (nPlayers < 2 || nPlayers > 4) {
    throw new Error("Cannot initialize game with " + nPlayers + " players. Only 2-4 players allowed.");
  }
  const stack = createStack();
  shuffle(stack);

  let players: Player[] = [];
  for (let i = 0; i < nPlayers; i++) {
    players.push(new Player(i, `P${i}`, []));
  }

  const numberOfCardsPerPlayer = 7;

  for (let i = 0; i < numberOfCardsPerPlayer; i++) {
    for (const player of players) {
      const card = stack.pop();
      if (card) {
        player.giveCard(card);
      }
    }
  }

  return {
    stack,
    players,
    hasDrawnCard: false,
    nextSuit: null,
    pendingSevens: null,
    playersTurnIndex: 0,
  };
}
