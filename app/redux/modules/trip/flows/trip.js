// @flow
import { race, take, fork, put, select } from 'redux-saga/effects'

// import { subscribeToUsersLoc } from './requestReceived.js'
import otherTripUsersSelector from '../../../selectors/otherTripUsers.js'
import { requestRide, acceptRequest } from '../../../api.js'
import {
  USER_REQUESTED_RIDE,
  USER_ACCEPTED_RIDE_REQUEST,
  YOUR_ROLE_UPDATED,
  USER_WITHDRAWN_RIDE_REQUEST,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
  TRIP_COMPLETED,
  TAB_IND_UPDATED,
} from '../constants.js'

export function* idleFlow (): any {
  const r = yield race({
    userRequestedRide: take(USER_REQUESTED_RIDE),
    userAcceeptedRideRequest: take(USER_ACCEPTED_RIDE_REQUEST),
  })

  if (r && r.userRequestedRide) {
    yield fork (requestRide, r.userRequestedRide.payload.userEmail, r.userRequestedRide.userId)
    yield put({
      type: YOUR_ROLE_UPDATED,
      payload: {
        newRole: 'REQUESTER',
      },
    })
    yield* requesterFlow()
  } else if (r && r.userAcceeptedRideRequest) {
    yield fork (acceptRequest, r.userAcceptedRequest.payload.payload, r.userAcceptedRequest.payload.requesterId)
    yield put({
      type: YOUR_ROLE_UPDATED,
      payload: {
        newRole: 'DRIVER',
      },
    })

    yield put({
      type: TAB_IND_UPDATED,
      payload: {
        tabInd: 0,
      },
    })
    yield* driverFlow()
  }
}

export function* requesterFlow (): any {
  const r2 = yield race({
    userWithdrawnRequest: take(USER_WITHDRAWN_RIDE_REQUEST),
    usersRequestGotAccepted: take(USERS_RIDE_REQUEST_GOT_ACCEPTED),
  })

  if (r2 && r2.userWithdrawnRequest) {
    yield put({
      type: YOUR_ROLE_UPDATED,
      payload: {
        newRole: 'NONE',
      },
    })
    yield* idleFlow()
  } else if (r2 && r2.usersRequestGotAccepted) {
    yield put({
      type: YOUR_ROLE_UPDATED,
      payload: {
        newRole: 'RIDER',
      },
    })
    const id = ''
    // TODO: if rider in otherUsers changeRole if not add him and sub to location
    const otherTripUsers = yield select(otherTripUsersSelector)
    if (!otherTripUsers || !otherTripUsers.map(user => user.id).contains(id)) {
      // Add user and sub to location
    } else {
      // Change that users role to driver
    }
    yield* riderFlow()
  }
}

export function* riderFlow (): any {
  yield take(TRIP_COMPLETED)

  yield put({
    type: YOUR_ROLE_UPDATED,
    payload: {
      newRole: 'NONE',
    },
  })
}

export function* driverFlow (): any {
  yield take(TRIP_COMPLETED)
  yield put({
    type: YOUR_ROLE_UPDATED,
    payload: {
      newRole: 'NONE',
    },
  })
  yield* idleFlow()
}

export default function* tripFlow (): any {
  yield* idleFlow()
}
