// @flow
import { LOG_MESSAGE_ADDED } from './constants.js';

import type { LogType } from '../../../models.js';

export function addLogMessage(type: LogType, title: string, message?: string) {
  return {
    type: LOG_MESSAGE_ADDED,
    payload: {
      type,
      title,
      message,
    },
  };
}
