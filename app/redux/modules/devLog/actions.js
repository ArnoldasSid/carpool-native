// @flow
import {
  LOG_MESSAGE_ADDED,
} from './constants.js'

export function addLogMessage (title: ?string, message: ?string) {
  return {
    type: LOG_MESSAGE_ADDED,
    payload: {
      title,
      message,
    },
  }
}
