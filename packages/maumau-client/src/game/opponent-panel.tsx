import React from 'react';
import styled from 'styled-components';

import CardStatusIcon from '../icons/cards-status';

const Container = styled.div`
  background: white;
  box-shadow: 3px 9px 28px -2px rgba(0, 0, 0, 0.15);
  padding: 8px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  height: 90px;
  border-radius: 90px;
  min-width: 250px;
  padding-right: 40px;
  user-select: none;
  margin: 8px;
`;

const Avatar = styled.div`
  border-radius: 50%;
  background: #262626;
  color: white;
  font-size: 1.5em;
  margin: 16px;
  margin-right: 16px;
  text-transform: uppercase;
  height: 70px;
  width: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-size: 1.25em;
  margin-bottom: 8px;
`;

const Status = styled.div`
  display: flex;
`;

const CardStatus = styled.div`
  display: flex;
  font-size: 0.9em;
  background: #262626;
  border-radius: 8px;
  padding: 7px 12px;
  color: white;
  margin-right: 4px;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: 8px;
  }
`;

const PlayingStatus = styled.div`
  padding: 7px 12px;
  text-transform: uppercase;
  background: red;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export type OpponentPanelProps = {
  name: string;
  cardAmount: number;
  isPlaying: boolean;
};

function OpponentPanel({ name = '', cardAmount = 0, isPlaying = false }: OpponentPanelProps) {
  const stripAbbreviation = (name: string) => name.substr(0, 2);
  return (
    <Container>
      <Avatar>{stripAbbreviation(name)}</Avatar>
      <InformationContainer>
        <Name>{name}</Name>
        <Status>
          <CardStatus>
            <CardStatusIcon /> {cardAmount}
          </CardStatus>
          {isPlaying && <PlayingStatus>playing</PlayingStatus>}
        </Status>
      </InformationContainer>
    </Container>
  );
}

export default OpponentPanel;
