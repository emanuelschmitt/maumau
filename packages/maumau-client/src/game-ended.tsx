import { GameEnd, Player, Opponent, GameEndReason } from 'maumau-server/src/types';
import React from 'react';

import JumboTron from './ui/jumbotron';

type Props = {
  player: Player;
  opponents: Opponent[];
  gameEnded: GameEnd;
};

function getPlayerName(gameEnded: GameEnd, player: Player, opponents: Opponent[]): string {
  if (player.id === gameEnded.id) {
    return player.name;
  }

  for (const opponent of opponents) {
    if (opponent.id === gameEnded.id) {
      return opponent.name;
    }
  }

  throw new Error('unable to find player name');
}

const messageGameEndMap: Record<GameEndReason, string> = {
  [GameEndReason.PLAYER_WON]: 'has won the game.',
  [GameEndReason.DISCONNECT]: 'has left the game.',
};

function GameEnded({ player, opponents, gameEnded }: Props) {
  const playerName = getPlayerName(gameEnded, player, opponents);

  return (
    <JumboTron>
      <h1>Game Ended</h1>
      <p>
        {playerName} {messageGameEndMap[gameEnded.type]}
      </p>
    </JumboTron>
  );
}

export default GameEnded;
