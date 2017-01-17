// @flow
import { race, take, fork, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
const maxTripDuration = 15 * 60 * 1000

// import { subscribeToUsersLoc } from './requestReceived.js'
import { requestRide, acceptRequest } from '../../../api.js'
import { completeTrip } from '../actions.js'
import {
  USER_REQUESTED_RIDE,
  USER_ACCEPTED_RIDE_REQUEST,
  USER_WITHDRAWN_RIDE_REQUEST,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
  TRIP_COMPLETED,
} from '../constants.js'
import { updateYourRole } from '../actions.js'
import { changeTab } from '../../router/actions.js'

function* idleFlow (): any {
  const r = yield race({
    userRequestedRide: take(USER_REQUESTED_RIDE),
    userAcceeptedRideRequest: take(USER_ACCEPTED_RIDE_REQUEST),
  })

  if (r && r.userRequestedRide) {
    yield fork(requestRide, r.userRequestedRide.payload.email, r.userRequestedRide.payload.id)
    yield put(updateYourRole('REQUESTER'))
    yield* requesterFlow()
  } else if (r && r.userAcceeptedRideRequest) {
    yield fork (acceptRequest, r.userAcceeptedRideRequest.payload.payload,
      r.userAcceeptedRideRequest.payload.requesterId)
    yield put(updateYourRole('DRIVER'))

    yield put(changeTab(0))
    yield* driverFlow()
  }
}

function* requesterFlow (): any {
  const r2 = yield race({
    userWithdrawnRequest: take(USER_WITHDRAWN_RIDE_REQUEST),
    usersRequestGotAccepted: take(USERS_RIDE_REQUEST_GOT_ACCEPTED),
    userAcceptedRideRequest: take(USER_ACCEPTED_RIDE_REQUEST),
    timeout: delay(maxTripDuration),
  })

  if (r2 && r2.userWithdrawnRequest) {
    yield put(updateYourRole('NONE'))
    yield* idleFlow()
  } else if (r2 && r2.usersRequestGotAccepted) {
    yield put(updateYourRole('RIDER'))
    yield* riderFlow('driverId')
  } else if (r2 && r2.userAcceptedRideRequest) {
    yield put(updateYourRole('DRIVER'))
    yield* driverFlow()
  } else if (r2 && r2.timeout) {
    alert(`Your trip request has been automatically withdrawn because ${maxTripDuration / 60000} minutes after its start have passed`)
    yield put(updateYourRole('NONE'))
    yield* idleFlow()
  }
}

function* riderFlow (driverId: string): any {
  const r = yield race({
    completed: take(TRIP_COMPLETED),
    timeout: delay(maxTripDuration),
  })
  if (r && r.timeout) {
    yield put(completeTrip())
    alert(`Your trip has been automatically completed because ${maxTripDuration / 60000} minutes after its start have passed`)
  }

  yield put(updateYourRole('NONE'))
  yield* idleFlow()
}

function* driverFlow (): any {
  const r = yield race({
    completed: take(TRIP_COMPLETED),
    timeout: delay(maxTripDuration),
  })
  if (r && r.timeout) {
    yield put(completeTrip())
    alert(`Your trip has been automatically completed because ${maxTripDuration / 60000} minutes after its start have passed`)
  }

  yield put(updateYourRole('NONE'))
  yield* idleFlow()
}

export default function* tripFlow (): any {
  yield* idleFlow()
}
