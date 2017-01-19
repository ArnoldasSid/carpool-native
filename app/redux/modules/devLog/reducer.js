// @flow
import R from 'ramda'

import {
  DDP_CONNECTED,
  DDP_DISCONNECTED,
} from '../app/constants.js'
import {
  LOG_MESSAGE_ADDED,
} from './constants.js'

const initialState = {
  messages: [],
}

export default function devLogReducer (state: any = initialState, action: any) {
  if (action.type === LOG_MESSAGE_ADDED) {
    const { type, title, message } = action.payload
    const fullTitle = type ? `[${type}] ${title}` : title
    const stringMsg = (typeof message !== 'string') ? JSON.stringify(message, null, 2) : message
    return R.evolve({
      messages: R.prepend({
        title: fullTitle,
        message: stringMsg,
        timestamp: new Date().valueOf(),
      }),
    }, state)
  } else if (action.type === DDP_CONNECTED) {
    return R.evolve({
      messages: R.prepend({
        title: '[DDP] DDP Connected',
        timestamp: new Date().valueOf(),
      }),
    }, state)
  } else if (action.type === DDP_DISCONNECTED) {
    return R.evolve({
      messages: R.prepend({
        title: '[DDP] DDP Disconnected',
        timestamp: new Date().valueOf(),
      }),
    }, state)
  }
  return state
}
