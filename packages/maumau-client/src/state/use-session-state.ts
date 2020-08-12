import React from 'react';
import { v4 as uuidV4 } from 'uuid';

type State = {
  name: string;
  userId: string;
  sessionId?: string;
};

export enum ActionType {
  SET_NAME = 'SET_NAME',
  SET_SESSION_ID = 'SET_SESSION_ID',
}

type SetNameAction = {
  type: ActionType.SET_NAME;
  payload: { name: string };
};

type SetSessionIdAction = {
  type: ActionType.SET_SESSION_ID;
  payload: { sessionId: string };
};

type Action = SetNameAction | SetSessionIdAction;

function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionType.SET_NAME: {
      return { ...state, name: action.payload.name };
    }
    case ActionType.SET_SESSION_ID: {
      return { ...state, name: action.payload.sessionId };
    }
    default:
      throw Error('invalid state');
  }
}

export default function useSessionState() {
  return React.useReducer(reducer, { userId: uuidV4(), name: '' });
}
