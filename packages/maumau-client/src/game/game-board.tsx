import { Opponent, Card as TCard, Player, ActionType, Suit } from 'maumau-server/src/types';
import React from 'react';

import CardStack from './card-stack';
import Grid from './grid';
import OpponentPanel from './opponent-panel';
import PlayerHand from './player-hand';
import SuitSelectDialog from './suit-select-dialog';
import SwitchButton from './switch-button';
import TopCard from './top-card';
import TurnIndicator from './turn-indicator';

export type GameBoardProps = {
  opponents: Opponent[];
  topCard: TCard;
  player: Player;
  pendingSeven: number | null;
  playingJack: TCard | null;
  nextSuit?: Suit;
  onPlayCard: (card: TCard) => void;
  onSelectJack: (card: TCard) => void;
  onPlayJack: (card: TCard, suit: Suit) => void;
  onDrawCard: () => void;
  onKannet: () => void;
  canDo: (action: ActionType) => boolean;
  canPlayCard: (card: TCard) => boolean;
  onAcceptPendingSeven: () => void;
  onCancelJack: () => void;
};

function GameBoard({
  opponents,
  topCard,
  player,
  pendingSeven,
  playingJack,
  nextSuit,
  onPlayJack,
  onSelectJack,
  onPlayCard,
  onDrawCard,
  onKannet,
  canDo,
  canPlayCard,
  onAcceptPendingSeven,
  onCancelJack,
}: GameBoardProps) {
  const isYourTurn = opponents.filter((o) => o.isPlaying).length === 0;
  const showPendingSeven = isYourTurn && Boolean(pendingSeven);
  return (
    <>
      <Grid.Container>
        <Grid.One>
          {opponents.map((o) => (
            <OpponentPanel name={o.name} cardAmount={o.handCount} isPlaying={o.isPlaying} key={o.id} />
          ))}
        </Grid.One>
        <Grid.Two>
          <TopCard card={topCard} nextSuit={nextSuit} />
        </Grid.Two>
        <Grid.Three>
          <CardStack
            cardBadge={showPendingSeven ? `+${pendingSeven! * 2}` : undefined}
            buttonProps={{
              onClick: showPendingSeven ? onAcceptPendingSeven : onDrawCard,
              disabled: !(canDo(ActionType.KANNET_AND_DRAW) || canDo(ActionType.ACCEPT_PENDING_SEVENS)),
            }}
          />
          <SwitchButton onClick={onKannet} disabled={!canDo(ActionType.KANNET)} show={canDo(ActionType.KANNET)} />
        </Grid.Three>
        <Grid.Four>
          <PlayerHand
            hand={player.hand}
            onPlayCard={onPlayCard}
            onSelectJack={onSelectJack}
            canPlayCard={canPlayCard}
          />
        </Grid.Four>
        <Grid.Five>
          <TurnIndicator show={isYourTurn} />
        </Grid.Five>
      </Grid.Container>
      {Boolean(playingJack) && (
        <SuitSelectDialog
          onSelect={(suit) => {
            if (!playingJack) {
              return;
            }
            onPlayJack(playingJack, suit);
          }}
          onCancel={onCancelJack}
        />
      )}
    </>
  );
}

export default GameBoard;
