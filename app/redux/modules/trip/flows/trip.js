// @flow
import { race, take, fork, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'

// import { subscribeToUsersLoc } from './requestReceived.js'
import otherTripUsersSelector from '../../../selectors/otherTripUsers.js'
import { requestRide, acceptRequest } from '../../../api.js'
import {
  USER_REQUESTED_RIDE,
  USER_ACCEPTED_RIDE_REQUEST,
  USER_WITHDRAWN_RIDE_REQUEST,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
  TRIP_COMPLETED,
} from '../constants.js'
import { updateYourRole, addOtherUser, updateOtherUsersRole } from '../actions.js'
import { changeTab } from '../../router/actions.js'

function* otherRequestersFlow (userId: string): any {

}

function* otherRidersFlow (userId: string): any {

}

function* otherDriversFlow (userId: string): any {

}

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
    timeout: delay(15 * 60 * 1000),
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
    alert('Your request has been withdrawn because more than 15 minutes passed')
    yield put(updateYourRole('NONE'))
    yield* idleFlow()
  }
}

function* riderFlow (driverId: string): any {
  // TODO: if rider in otherUsers changeRole if not add him and sub to location
  const otherTripUsers = yield select(otherTripUsersSelector)
  if (!otherTripUsers || !otherTripUsers.map(user => user.id).includes(driverId)) {
    addOtherUser('id', 'DRIVER')
    // Add user and sub to location
  } else {
    updateOtherUsersRole('id', 'DRIVER')
    // Change that users role to driver
  }

  yield take(TRIP_COMPLETED)
  // Should cancel driver location sub

  yield put(updateYourRole('NONE'))
}

function* driverFlow (): any {
  yield take(TRIP_COMPLETED)
  yield put(updateYourRole('NONE'))
  yield* idleFlow()
}

export default function* tripFlow (): any {
  yield* idleFlow()
}
