// @flow
import { delay } from 'redux-saga'
import { take, select, put, fork, TakeEffect, IOEffect, cancelled } from 'redux-saga/effects'

import otherTripUsersSelector from '../../../selectors/otherTripUsers.js'
import { subscribeToUsersLocation, unsub } from '../../../api.js'
import { USER_RECEIVED_RIDE_REQUEST, OTHER_USER_ADDED, OTHER_USERS_LOCATION_UPDATED } from '../constants.js'

export function* subscribeToUsersLoc (id: string): Generator<IOEffect, *, *> {
  // TODO: should automatically unsub on removed action
  const { subId, location$ } = subscribeToUsersLocation(id)
  location$.observe(console.log.bind(console))

  try {
    let prevLocation = null
    let currLocation = null

    location$
      .filter(msg => msg.msg === 'added')
      .map(msg => msg.fields.loc)
      .observe((location) => {
        currLocation = location
      })

    while (true) {
      if (currLocation !== prevLocation) {
        prevLocation = currLocation
        yield put({
          type: OTHER_USERS_LOCATION_UPDATED,
          payload: {
            id,
            location: currLocation,
          }
        })
      }
      yield delay(500)
    }
  } finally {
    if (yield cancelled()) {
      unsub(subId)
    }
  }
}

export default function* requestReceivedFlow (): Generator<TakeEffect, * , *> {
  while (true) {
    const rideRequest = yield take(USER_RECEIVED_RIDE_REQUEST)
    if (rideRequest) {
      const requester = {
        id: rideRequest.payload.userId,
        email: rideRequest.payload.userEmail,
      }

      const otherTripUsers = yield select(otherTripUsersSelector)
      console.log(otherTripUsers, requester)
      if (!otherTripUsers || !otherTripUsers.map(user => user.id).includes(requester.id)) {
        yield put({
          type: OTHER_USER_ADDED,
          payload: {
            ...requester,
            role: 'REQUESTER',
          },
        })

        console.log('Added', requester)
        yield fork(subscribeToUsersLoc, requester.id)
      }
    }
  }
}
