// @flow
import R from 'ramda';

import { LOG_MESSAGE_ADDED } from './constants.js';
import type { Action, LogType } from '../../../models.js';

type LogMessage = {
  type: LogType,
  title: string,
  message: string,
  timestamp: number,
};

export type DevLogState = {
  messages: LogMessage[],
};

const initialState: DevLogState = {
  messages: [],
};

const getMsgPrefix = (type: LogType): string => {
  if (type === 'GEOLOCATION') {
    return 'Geolocation';
  } else if (type === 'DDP') {
    return 'DDP';
  } else if (type === 'NOTIFICATION') {
    return 'Notification';
  } else if (type === 'TRIP_UPDATE') {
    return 'Trip Update';
  }
  // Shouldnt happen
  return '--No Type--';
};

export default function devLogReducer(state: DevLogState = initialState, action: Action): DevLogState {
  if (action.type === LOG_MESSAGE_ADDED) {
    const { type, title, message } = action.payload;
    const prefix = getMsgPrefix(type);
    const fullTitle = `[${prefix}] ${title}`;
    const stringMsg = typeof message !== 'string' ? JSON.stringify(message, null, 2) : message;
    return R.evolve(
      {
        messages: R.prepend({
          type,
          title: fullTitle,
          message: stringMsg,
          timestamp: new Date().valueOf(),
        }),
      },
      state,
    );
  }
  return state;
}
