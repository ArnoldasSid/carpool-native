import { AsyncStorage } from 'react-native'
import { put, take, race, fork, cancel, cancelled, select } from 'redux-saga/effects'

import { startTracking, stopTracking, switchToFastTracking, switchToSlowTracking } from '../../BackgroundGeolocationService'
import { saveLocation, subscribeToUsersLocation, unsub, acceptRequest, requestRide } from '../../api'

const delay = (ms) => new Promise(resolve => setTimeout(() => resolve(true), ms))

import {
  USER_REQUESTED_RIDE,
  USER_RECEIVED_RIDE_REQUEST,
  USER_ACCEPTED_RIDE_REQUEST,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,

  TRIP_COMPLETED,
  USER_WITHDRAWN_RIDE_REQUEST,
  USER_DATA_UPDATED,
  DRIVER_DATA_UPDATED,
  RIDER_DATA_UPDATED,
  USERS_ROLE_UPDATED,
  REQUESTER_DATA_UPDATED,
  TRIP_LOADED,
} from './constants'

import {
  LOGOUT_SUCCEEDED,
  LOGIN_SUCCEEDED,
  REGISTRATION_SUCCEEDED,
} from '../auth/constants'

import {
  TAB_IND_UPDATED,
} from '../router/constants'

import {
  MARK_NOTIFICATION_AS_READ_REQUESTED,
} from '../notifications/constants'

function* enableFastTracking () {
  try {
    const location$ = startTracking()
    let prevLocation = null
    let currLocation = null

    location$.observe((location) => {
      currLocation = location
    })

    while (true) {
      if (currLocation !== prevLocation) {
        prevLocation = currLocation
        console.log('FAST tracking', currLocation)
        saveLocation({
          ...currLocation,
          // latitude: 54.6872 + Math.random() * 0.08 - 0.04,
          // longitude: 25.2797 + Math.random() * 0.08 - 0.04,
        })
      }
      yield delay(500)
    }
  } finally {
    if (yield cancelled()) {
      stopTracking()
    }
  }
}

function* fastTrackingFlow () {
  while(true) {

    yield race({
      login: take(LOGIN_SUCCEEDED),
      register: take(REGISTRATION_SUCCEEDED),
    })

    const fastTrackingTask = yield fork(enableFastTracking)
    console.log('Tracking started')
    while (true) {
      yield race({
        userRequestedRide: take(USER_REQUESTED_RIDE),
        userAcceptedRideRequest: take(USER_ACCEPTED_RIDE_REQUEST),
        usersRideRequestGotAccepted: take(USERS_RIDE_REQUEST_GOT_ACCEPTED),
      })

      switchToFastTracking()

      const { loggedOut } = yield race({
        tripCompleted: take(TRIP_COMPLETED),
        userWithdrawnRideRequest: take(USER_WITHDRAWN_RIDE_REQUEST),
        loggedOut: take(LOGOUT_SUCCEEDED),
      })

      if ( loggedOut ) {
        cancel(fastTrackingTask)
        break
      }

      switchToSlowTracking()
    }
  }
}

function* subscribeToUsersData (id, email, updateActionType) {
  const { subId, location$ } = subscribeToUsersLocation(id)

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
          type: updateActionType,
          payload: {
            id,
            email,
            location: currLocation,
          }
        })
      }
      yield delay(1500)
    }
  } finally {
    if (yield cancelled()) {
      unsub(subId)
    }
  }
}

function* userDataFlow () {
  const { loginData, registerData } = yield race({
    loginData: take(LOGIN_SUCCEEDED),
    registerData: take(REGISTRATION_SUCCEEDED),
  })

  const authData = loginData || registerData
  const userDataUpdateTask = yield fork(subscribeToUsersData, authData.payload.id, authData.payload.email, USER_DATA_UPDATED)

  yield take(LOGOUT_SUCCEEDED)
  cancel(userDataUpdateTask)
}

function* driverDataFlow () {
  while (true) {
    const action = yield take(USERS_RIDE_REQUEST_GOT_ACCEPTED)

    const driverData = {
      id: action.payload.userId,
      email: action.payload.userEmail,
    }

    const driverDataUpdateTask = yield fork(subscribeToUsersData, driverData.id, driverData.email, DRIVER_DATA_UPDATED)

    yield race({
      logout: take(LOGOUT_SUCCEEDED),
      tripComplete: take(TRIP_COMPLETED),
    })
    cancel(driverDataUpdateTask)
  }
}

function* ridersDataFlow () {
  while (true) {
    const actionData = yield take(USER_ACCEPTED_RIDE_REQUEST)

    // TODO: Move this to notifications saga
    const notificationId = actionData.payload.notificationId
    yield put({
      type: MARK_NOTIFICATION_AS_READ_REQUESTED,
      payload: {
        notificationId,
      },
    })

    const requesterId = actionData.payload.requesterId

    yield put({
      type: RIDER_DATA_UPDATED,
      payload: {
        id: requesterId,
      },
    })

    // yield fork(subscribeToUsersData, requesterId, null, RIDER_DATA_UPDATED);
  }
}

function* requestersDataFlow () {
  while (true) {
    const rideRequestAction = yield take(USER_RECEIVED_RIDE_REQUEST)
    // Should unsub if user accepts this requester or if user becomes rider himself
    yield fork(subscribeToUsersData, rideRequestAction.payload.userId, rideRequestAction.payload.userEmail, REQUESTER_DATA_UPDATED)
  }
}

function* usersRoleFlow () {
  while (true) {
    // Start of role flow, user status here should always be none
    const { userRequestedRide, userAcceptedRequest } = yield race({
      userRequestedRide: take(USER_REQUESTED_RIDE),
      userAcceptedRequest: take(USER_ACCEPTED_RIDE_REQUEST),
    })

    if (userRequestedRide) {
      yield fork(requestRide, userRequestedRide.payload.userEmail, userRequestedRide.payload.userId)

      yield put({
        type: USERS_ROLE_UPDATED,
        payload: {
          newRole: 'REQUESTER',
        },
      })

      const { userWithdrawnRequest, usersRequestGotAccepted } = yield race({
        userWithdrawnRequest: take(USER_WITHDRAWN_RIDE_REQUEST),
        usersRequestGotAccepted: take(USERS_RIDE_REQUEST_GOT_ACCEPTED),
      })

      if (userWithdrawnRequest) {
        yield put({
          type: USERS_ROLE_UPDATED,
          payload: {
            newRole: 'NONE',
          },
        })
      } else if (usersRequestGotAccepted) {
        // If user existed in otherUsers change it to driver
        yield put({
          type: USERS_ROLE_UPDATED,
          payload: {
            newRole: 'RIDER',
          },
        })

        yield take(TRIP_COMPLETED)

        yield put({
          type: USERS_ROLE_UPDATED,
          payload: {
            newRole: 'NONE',
          },
        })
      }
    } else if (userAcceptedRequest) {
      yield fork (acceptRequest, userAcceptedRequest.payload.payload, userAcceptedRequest.payload.requesterId)
      yield put({
        type: USERS_ROLE_UPDATED,
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
      yield take(TRIP_COMPLETED)
      yield put({
        type: USERS_ROLE_UPDATED,
        payload: {
          newRole: 'NONE',
        },
      })
    }
  }
}

function* tripTimeoutFlow () {
  const maxTripDuration = 15 * 60 * 1000
  while (true) {
    yield race({
      userAcceptedRideRequest: take(USER_ACCEPTED_RIDE_REQUEST),
      usersRideRequestGotAccepted: take(USERS_RIDE_REQUEST_GOT_ACCEPTED),
    })

    const { timeout } = yield race({
      timeout: delay(maxTripDuration),
      tripCompleted: take(TRIP_COMPLETED),
    })

    if (timeout) {
      alert(`Your trip has been automatically completed because ${maxTripDuration / 60000} minutes after its start have passed`)
      yield put({
        type: TRIP_COMPLETED,
      })
    }
  }
}

function* saveTripToLocalstorage () {
  const trip = yield select(state => state.trip)
  AsyncStorage.setItem('currentTrip', JSON.stringify(trip))
}

function* tripSavingFlow () {
  while (true) {
    yield race({
      logout: take(LOGOUT_SUCCEEDED),
      rideRequest: take(USER_REQUESTED_RIDE),
      acceptRideRequest: take(USER_ACCEPTED_RIDE_REQUEST),
      rideRequestAccepted: take(USERS_RIDE_REQUEST_GOT_ACCEPTED),
      tripCompleted: take(TRIP_COMPLETED),
      rideRequestWithdraw: take(USER_WITHDRAWN_RIDE_REQUEST),
    })

    yield fork(saveTripToLocalstorage)
  }
}

function* tripInitFlow () {
  const lsTripString = yield AsyncStorage.getItem('currentTrip')
  const lsTrip = JSON.parse(lsTripString)
  const tripTime = lsTrip.lastUpdateTime
  const currTime = new Date().valueOf()
  if (tripTime && currTime - tripTime < 15 * 60 * 1000) {
    yield put({
      type: TRIP_LOADED,
      payload: lsTrip,
    })
  }
}

export default function* tripSaga () {
  yield [
    fork(fastTrackingFlow),
    fork(userDataFlow),
    fork(driverDataFlow),
    fork(ridersDataFlow),
    fork(requestersDataFlow),
    fork(usersRoleFlow),
    fork(tripTimeoutFlow),
    fork(tripSavingFlow),
    fork(tripInitFlow),
  ]
}
