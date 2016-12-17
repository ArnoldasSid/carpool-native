// @flow
import { delay } from 'redux-saga'
import { take, race, fork, cancel, put, cancelled, TakeEffect } from 'redux-saga/effects'

import {
  startTracking,
  stopTracking,
  switchToFastTracking,
  switchToSlowTracking
} from '../../../BackgroundGeolocationService'
import { saveLocation } from '../../../api'
import {
  LOGIN_SUCCEEDED,
  REGISTRATION_SUCCEEDED,
  LOGOUT_SUCCEEDED,
} from '../../auth/constants.js'
import {
  USER_REQUESTED_RIDE,
  USER_ACCEPTED_RIDE_REQUEST,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
  TRIP_COMPLETED,
  USER_WITHDRAWN_RIDE_REQUEST,
} from '../constants.js'
import {
  updateYourLocation,
} from '../actions.js'

function* trackLocation () {
  console.log('Tracking started')
  try {
    const location$ = startTracking()
    let prevLocation = null
    let currLocation = null

    location$.observe((location) => currLocation = location)

    while (true) {
      if (currLocation !== prevLocation) {
        prevLocation = currLocation
        yield put(updateYourLocation(currLocation))
        yield fork(saveLocation, currLocation)
      }
      yield delay(500)
    }
  } finally {
    if (yield cancelled()) {
      stopTracking()
    }
  }
}

export default function* backgroundTrackingFlow (): Generator<TakeEffect, *, *> {
  while (true) {
    yield race({
      login: take(LOGIN_SUCCEEDED),
      register: take(REGISTRATION_SUCCEEDED),
    })

    const trackingTask = yield fork(trackLocation)

    while (true) {
      const r1 = yield race({
        userRequestedRide: take(USER_REQUESTED_RIDE),
        userAcceptedRideRequest: take(USER_ACCEPTED_RIDE_REQUEST),
        usersRideRequestGotAccepted: take(USERS_RIDE_REQUEST_GOT_ACCEPTED),
        loggedOut: take(LOGOUT_SUCCEEDED),
      })

      if (r1 && r1.loggedOut) {
        cancel(trackingTask)
        break
      }

      switchToFastTracking()

      const r2 = yield race({
        tripCompleted: take(TRIP_COMPLETED),
        userWithdrawnRideRequest: take(USER_WITHDRAWN_RIDE_REQUEST),
        loggedOut: take(LOGOUT_SUCCEEDED),
      })

      if (r2 && r2.loggedOut) {
        cancel(trackingTask)
        break
      }

      switchToSlowTracking()
    }
  }
}
