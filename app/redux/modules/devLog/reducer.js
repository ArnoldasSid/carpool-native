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
    const { title, message } = action.payload
    return R.evolve({
      messages: R.append({
        title,
        message,
        timestamp: new Date().valueOf(),
      }),
    }, state)
  } else if (action.type === DDP_CONNECTED) {
    return R.evolve({
      messages: R.append({
        title: 'DDP Connected',
        timestamp: new Date().valueOf(),
      }),
    }, state)
  } else if (action.type === DDP_DISCONNECTED) {
    return R.evolve({
      messages: R.append({
        title: 'DDP Disconnected',
        timestamp: new Date().valueOf(),
      }),
    }, state)
  }
  return state
}
