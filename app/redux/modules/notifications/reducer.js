import {
  NOTIFICATIONS_SUB_READY,
  NOTIFICATION_RECEIVED,
  NOTIFICATION_UPDATED,
} from './constants'
import {
  LOGOUT_SUCCEEDED,
} from '../auth/constants'

const initialState = {
  subReady: false,
  notifications: [],
}

export default function notificationsReducer (state = initialState, action) {
  if (action.type === NOTIFICATIONS_SUB_READY) {
    return {
      ...state,
      subReady: true,
    }
  } else if (action.type === NOTIFICATION_RECEIVED) {
    // FIXME: Temporary solution when same notifications that exist get added after reconnect
    if (state.notifications.some(notification => notification.id === action.payload.id)) {
      return state
    }
    return {
      ...state,
      notifications: [action.payload, ...state.notifications],
    }
  } else if (action.type === NOTIFICATION_UPDATED) {
    return {
      ...state,
      notifications: state.notifications.map(notification => {
        if (notification.id === action.payload.id) {
          return {
            ...notification,
            ...action.payload.updates,
          }
        }
        return notification
      }),
    }
  } else if (action.type === LOGOUT_SUCCEEDED) {
    return initialState
  }
  return state
}
