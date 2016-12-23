// @flow
import type { UsersRole } from '../../../../models.js'
import { take, race, put, fork, select, call, cancel, cancelled } from 'redux-saga/effects'
import { delay, eventChannel, END } from 'redux-saga'
import {
  USER_ACCEPTED_RIDE_REQUEST,
  USER_RECEIVED_RIDE_REQUEST,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
  TRIP_COMPLETED,
} from '../constants.js'
import { addOtherUser, updateOtherUsersLocation, updateOtherUsersRole } from '../actions.js'
import otherTripUsersSelector from '../../../selectors/otherTripUsers.js'
import { subscribeToUsersLocation, unsub } from '../../../api.js'

function* otherRequestersFlow (id, locationTrackingTask) {
  const r = yield race({
    userAcceptedRideRequest:
      take(action => action.type === USER_ACCEPTED_RIDE_REQUEST
        && action.payload.requesterId === id),
    usersRideRequestGotAccepted:
      take(action => action.type === USERS_RIDE_REQUEST_GOT_ACCEPTED
        && action.payload.userId === id),
  })

  if (r && r.userAcceptedRideRequest) {
    yield put(updateOtherUsersRole(id, 'RIDER'))
    yield* otherRidersFlow(id, locationTrackingTask)
  } else if (r && r.usersRideRequestGotAccepted) {
    yield put(updateOtherUsersRole(id, 'DRIVER'))
    yield* otherDriversFlow(id, locationTrackingTask)
  }
}

function* otherRidersFlow (id, locationTrackingTask) {
  yield take(TRIP_COMPLETED)
  yield cancel(locationTrackingTask)
}

function* otherDriversFlow (id, locationTrackingTask) {
  yield take(TRIP_COMPLETED)
  yield cancel(locationTrackingTask)
}

function streamToChannel (stream) {
  return eventChannel(emitter => {
    const sub = stream.subscribe({
      next (msg) {
        if (msg.msg === 'added') {
          emitter(msg.fields.loc)
        }
      },
      complete () {
        emitter(END)
      },
    })

    return () => {
      sub.unsubscribe()
    }
  })
}

function* trackUsersLocation (id: string) {
  const { subId, location$ } = subscribeToUsersLocation(id)
  const locationsChan = yield call(streamToChannel, location$)
  try {
    while (true) {
      const newLocation: any = yield take(locationsChan)
      yield put(updateOtherUsersLocation(id, newLocation))
    }
  } finally {
    if (yield cancelled()) {
      unsub(subId)
    }
  }
}

function* tryAddUser (userId: string, usersRole: UsersRole) {
  const otherUsers = yield select(otherTripUsersSelector)
  if (otherUsers && !otherUsers.map(user => user.id).includes(userId)) {
    yield put(addOtherUser(userId, usersRole))
    return yield fork(trackUsersLocation, userId)
  }
  return false
}

export default function* otherUserFlow (): any {
  while (true) {
    const r = yield race({
      rideRequested: take(USER_RECEIVED_RIDE_REQUEST),
      usersRideRequestGotAccepted: take(USERS_RIDE_REQUEST_GOT_ACCEPTED),
    })

    if (r && r.rideRequested) {
      const { userId } = r.rideRequested.payload
      const locationTask = yield* tryAddUser(userId, 'REQUESTER')
      if (locationTask) {
        yield fork(otherRequestersFlow, userId, locationTask)
      }
    } else if (r && r.usersRideRequestGotAccepted) {
      const { userId } = r.usersRideRequestGotAccepted.payload
      const locationTask = yield* tryAddUser(userId, 'DRIVER')
      if (locationTask) {
        yield fork(otherDriversFlow, userId, locationTask)
      }
    }
  }
}
