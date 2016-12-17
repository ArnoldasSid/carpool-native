import moment from 'moment'

import type { UsersRole, Location, User } from '../../../models.js'

import {
  LOGOUT_SUCCEEDED,
} from '../auth/constants'

import {
  USERS_ROLE_UPDATED,
  TRIP_COMPLETED,
  USER_DATA_UPDATED,
  DRIVER_DATA_UPDATED,
  RIDER_DATA_UPDATED,
  REQUESTER_DATA_UPDATED,
  TRIP_LOADED,
} from './constants'

type TripState = {
  usersRole: UsersRole,
  user: ?User,
  driver: ?User,
  riders: {[id:string]: User},
  requesters: {[id:string]: User},
  otherUsers: {[id:string]: User},
  tripStartTime: number,
  lastUpdateTime: number,
}

const initialState: TripState = {
  usersRole: 'NONE',
  user: null,
  driver: null,
  riders: {},
  requesters: {},
  otherUsers: {},
  tripStartTime: 0,
  lastUpdateTime: 0,
}

export default function tripReducer (state: TripState = initialState, action: any) {
  if (action.type === LOGOUT_SUCCEEDED) {
    return initialState
  } else if (action.type === USERS_ROLE_UPDATED) {
    return {
      ...state,
      usersRole: action.payload.newRole,
      lastUpdateTime: action.payload.newRole === state.usersRole ? state.lastUpdateTime : moment().valueOf()
    }
  } else if (action.type === TRIP_COMPLETED) {
    if (state.usersRole === 'DRIVER' || state.usersRole === 'RIDER') {
      return {
        ...state,
        usersRole: 'NONE',
        driver: null,
        riders: {},
      }
    }
  } else if (action.type === USER_DATA_UPDATED) {
    return {
      ...state,
      user: action.payload,
    }
  } else if (action.type === DRIVER_DATA_UPDATED) {
    return {
      ...state,
      driver: action.payload,
    }
  } else if (action.type === RIDER_DATA_UPDATED) {
    const requesters = state.requesters
    delete requesters[action.payload.id]
    return {
      ...state,
      requesters: {
        ...requesters,
      },
      riders: {
        ...state.riders,
        [action.payload.id]: action.payload,
      }
    }
  } else if (action.type === REQUESTER_DATA_UPDATED) {
    return {
      ...state,
      requesters: {
        ...state.requesters,
        [action.payload.id]: action.payload,
      }
    }
  } else if (action.type === TRIP_LOADED) {
    return action.payload
  }
  return state
}
