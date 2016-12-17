// @flow
import { delay } from 'redux-saga'
import { race, take, put, TakeEffect } from 'redux-saga/effects'

import {
  USER_ACCEPTED_RIDE_REQUEST,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
  TRIP_COMPLETED,
} from '../constants.js'
import {
  completeTrip,
} from '../actions.js'

export default function* tripTimeoutFlow (): Generator<TakeEffect, *, *> {
  const maxTripDuration = 15 * 60 * 1000
  while (true) {
    yield race({
      userAcceptedRideRequest: take(USER_ACCEPTED_RIDE_REQUEST),
      usersRideRequestGotAccepted: take(USERS_RIDE_REQUEST_GOT_ACCEPTED),
    })

    const r = yield race({
      timeout: delay(maxTripDuration),
      tripCompleted: take(TRIP_COMPLETED),
    })

    if (r && r.timeout) {
      alert(`Your trip has been automatically completed because ${maxTripDuration / 60000} minutes after its start have passed`)
      yield put(completeTrip())
    }
  }
}
