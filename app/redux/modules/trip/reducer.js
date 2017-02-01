// @flow
import R from 'ramda'

import type { UsersRole, Location, User } from '../../../models.js'

import {
  LOGOUT_SUCCEEDED,
} from '../auth/constants'

import {
  YOUR_ROLE_UPDATED,
  YOUR_LOCATION_UPDATED,
  TRIP_COMPLETED,
  TRIP_LOADED,
  OTHER_USERS_LOCATION_UPDATED,
  OTHER_USERS_ROLE_UPDATED,
  OTHER_USER_ADDED,
  OTHER_USER_REMOVED,
  OTHER_USER_WITHDRAWN_RIDE_REQUEST,
} from './constants'

type TripState = {
  yourRole: UsersRole,
  yourLocation: ?Location,
  otherUsers: {[id: string]: User},
  lastUpdateTime: number,
}

export const initialState: TripState = {
  yourRole: 'NONE',
  yourLocation: null,
  otherUsers: {},
  lastUpdateTime: 0,
}

function getTripUpdates (state: TripState, action: any): ((tripState: TripState) => TripState) {
  if (action.type === YOUR_ROLE_UPDATED) {
    const { newRole } = action.payload
    return R.evolve({
      yourRole: () => newRole,
      lastUpdateTime: state.yourRole !== newRole ? new Date().valueOf() : state.lastUpdateTime,
    })
  } else if (action.type === YOUR_LOCATION_UPDATED) {
    const { location } = action.payload
    return R.evolve({
      yourLocation: () => location,
    })
  } else if (action.type === TRIP_COMPLETED) {
    return R.evolve({
      usersRole: () => 'NONE',
      otherUsers: R.pickBy(user => user.role !== 'RIDER' && user.role !== 'DRIVER'),
    })
  } else if (action.type === TRIP_LOADED) {
    const newTrip = action.payload
    return R.always(newTrip)
  } else if (action.type === OTHER_USERS_LOCATION_UPDATED) {
    const { userId, newLocation } = action.payload
    return R.assocPath(['otherUsers', userId, 'location'], newLocation)
  } else if (action.type === OTHER_USERS_ROLE_UPDATED) {
    const { userId, newRole } = action.payload
    return R.assocPath(['otherUsers', userId, 'role'], newRole)
  } else if (action.type === OTHER_USER_ADDED) {
    const newUser = action.payload
    if (!(newUser.id in state.otherUsers)) {
      return R.evolve({
        otherUsers: R.assoc(newUser.id, newUser),
      })
    }

    return R.identity
  } else if (action.type === OTHER_USER_REMOVED) {
    console.log('TODO:', action)
    return R.identity
  } else if (action.type === LOGOUT_SUCCEEDED) {
    return R.always(initialState)
  } else if (action.type === OTHER_USER_WITHDRAWN_RIDE_REQUEST) {
    const { userId } = action.payload
    return R.evolve({
      otherUsers: R.dissoc(userId),
    })
  }
  return R.identity
}

export default function tripReducer (state: TripState = initialState, action: any): TripState {
  return getTripUpdates(state, action)(state)
}
